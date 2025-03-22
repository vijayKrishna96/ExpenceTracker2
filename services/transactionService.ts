import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadfileToCloudinary } from "./imageService";
import { createOrUpdateWallet } from "./walletService";
import wallet from "@/app/(tabs)/wallet";
import { getLast12Months, getLast7Days, getYearRange } from "@/utils/common";
import { scale } from "@/utils/styling";
import { colors } from "@/constants/theme";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, walletId, type, amount, image } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data!" };
    }

    if (id) {
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, "transactions", id)
      );
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
      const shouldRevertOrginal =
        oldTransaction.type !== type ||
        oldTransaction.amount !== amount ||
        oldTransaction.walletId !== walletId;

      if (shouldRevertOrginal) {
        let res = await revertAndUpdateWallet(
          oldTransaction,
          Number(amount),
          type,
          walletId
        );
        if (!res.success) return res;
      }
    } else {
      let res = await updateWalletForNewTransaction(
        walletId,
        Number(amount),
        type
      );
      if (!res.success) return res;
    }

    // Create a clean copy of the transaction data
    const cleanTransactionData = { ...transactionData };

    // Handle image upload if provided
    if (image) {
      const imageUploadRes = await uploadfileToCloudinary(
        image,
        "transactions"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload receipt",
        };
      }
      cleanTransactionData.image = imageUploadRes.data;
    } else {
      // If image is undefined, remove the field from the data object
      delete cleanTransactionData.image;
    }

    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, cleanTransactionData, { merge: true });

    return {
      success: true,
      data: { ...cleanTransactionData, id: transactionRef.id },
    };
  } catch (err: any) {
    console.log("error creating or updating transaction", err);
    return { success: false, msg: err?.message };
  }
};

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);
    if (!walletSnapshot.exists()) {
      console.log("error updating wallet", "Wallet does not exist");
      return { success: false, msg: "Wallet does not exist" };
    }

    const walletData = walletSnapshot.data() as WalletType;

    if (type === "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "Insufficient balance in wallet",
      };
    }

    const updateType = type == "expense" ? "totalExpenses" : "totalIncome";
    const updateWalletAmount =
      type == "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updateTotals =
      type == "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updateWalletAmount,
      [updateType]: updateTotals,
    });

    return { success: true, msg: "Updated Successfully" };
  } catch (err: any) {
    console.log("error updating wallet for new transaction", err);
    return { success: false, msg: err?.message };
  }
};

const revertAndUpdateWallet = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
): Promise<ResponseType> => {
  try {
    const orginalWalletSnapshot = await getDoc(
      doc(firestore, "wallets", oldTransaction.walletId)
    );

    const orginalWallet = orginalWalletSnapshot.data() as WalletType;

    let newWalletSnapshot = await getDoc(
      doc(firestore, "wallets", newWalletId)
    );

    let newWallet = newWalletSnapshot.data() as WalletType;

    const revertType =
      oldTransaction.type == "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense: number =
      oldTransaction.type === "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertedWalletAmount =
      Number(orginalWallet.amount) + revertIncomeExpense;

    const revertedIncomeExpenseAmount =
      Number(orginalWallet[revertType]) - Number(oldTransaction.amount);

    if (newTransactionType == "expense") {
      if (
        oldTransaction.walletId === newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "The selected wallet doesn't have enough balance",
        };
      }

      if (
        oldTransaction.walletId !== newWalletId &&
        newWallet.amount! < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "The selected wallet doesn't have enough balance",
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });

    newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));
    newWallet = newWalletSnapshot.data() as WalletType;

    const updateType =
      newTransactionType == "income" ? "totalIncome" : "totalExpenses";

    const updatedTransactionAmount: number =
      newTransactionType == "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

    const newIncomeExpenseAmount =
      Number(newWallet[updateType]) + Number(newTransactionAmount);

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    return { success: true };
  } catch (err: any) {
    console.log("error reverting and updating wallet", err);
    return { success: false, msg: err?.message };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  walletId: string
) => {
  try {
    const transactionSnapshot = await getDoc(
      doc(firestore, "transactions", transactionId)
    );

    if (!transactionSnapshot.exists()) {
      return { success: false, msg: "Transaction does not exist" };
    }

    const transactionData = transactionSnapshot.data() as TransactionType;
    const transactionType = transactionData?.type;
    const transactionAmount = transactionData?.amount;

    const walletSnapshot = await getDoc(doc(firestore, "wallets", walletId));
    const walletData = walletSnapshot.data() as WalletType;

    // When deleting a transaction, we need to:
    // - For income: subtract the amount from wallet (reverse the addition)
    // - For expense: add the amount back to wallet (reverse the subtraction)
    const updateType =
      transactionType == "expense" ? "totalExpenses" : "totalIncome";

    let newWalletAmount;
    if (transactionType == "income") {
      newWalletAmount = walletData?.amount! - transactionAmount;
    } else {
      // expense
      newWalletAmount = walletData?.amount! + transactionAmount;
    }

    const newIncomeExpenseAmount = walletData[updateType]! - transactionAmount;

    await createOrUpdateWallet({
      id: walletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    await deleteDoc(doc(firestore, "transactions", transactionId));

    return { success: true };
  } catch (err: any) {
    console.log("error deleting transaction", err);
    return { success: false, msg: err?.message };
  }
};
// * 24 * 60 * 60 * 1000
export const fetchWeeklyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const db = firestore;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const transactionsQuery = query(
      collection(db, "transactions"),
      where("uid", "==", uid),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(transactionsQuery);
    const weeklyData = getLast7Days();
    const transactions: TransactionType[] = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);
      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0];

      const dayData = weeklyData.find((day) => day.date == transactionDate);

      if (dayData) {
        if (transaction.type == "income") {
          dayData.income += transaction.amount;
        } else if (transaction.type == "expense") {
          dayData.expense += transaction.amount;
        }
      }
    });

    const stats = weeklyData.flatMap((day) => [
      {
        value: day?.income || 0,
        label: day?.date,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: "blue",
      },
      {
        value: day?.expense || 0,
        frontColor: colors.rose,
      },
    ]);

    return { 
      success: true ,
      data:{
        stats,
        transactions
      }

    };
  } catch (err: any) {
    console.log("error fetching weekly stats", err);
    return { success: false, msg: err?.message };
  }
};

export const fetchMonthlyStats = async (uid: string):Promise<ResponseType> => {
  try {
    const db = firestore;
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setDate(today.getMonth() - 12);

    const transactionsQuery = query(
      collection(db, "transactions"),
      where("uid", "==", uid),
      where("date", ">=", Timestamp.fromDate(twelveMonthsAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(transactionsQuery);
    const monthlyData = getLast12Months();
    const transactions: TransactionType[] = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);
      const transactionDate = (transaction.date as Timestamp).toDate()
      const monthName = transactionDate.toLocaleString('default', { month: 'short' });

      const shortYear = transactionDate.getFullYear().toString().slice(-2);

      const monthData = monthlyData.find((month) => month.month === `${monthName} ${shortYear}`);
      console.log(monthData, "lkhfudchc");
      if (monthData) {
        if (transaction.type == "income") {
          monthData.income += transaction.amount;
        } else if (transaction.type == "expense") {
          monthData.expense += transaction.amount;
        }
      }
    });

    const stats = monthlyData.flatMap((month) => [
      {
        value: month?.income,
        label: month?.month,
        spacing: scale(4),
        labelWidth: scale(45),
        frontColor: "blue",
      },
      {
        value: month?.expense ,
        frontColor: colors.rose,
      },
    ]);

    

    return { 
      success: true ,
      data:{
        stats,
        transactions
      }

    };
  } catch (err: any) {
    console.log("error fetching monthly stats", err);
    return { success: false, msg: err?.message };
  }
};


export const fetchYearlyStats = async (uid: string):Promise<ResponseType> => {
  try {
    const db = firestore;
  
    const transactionsQuery = query(
      collection(db, "transactions"),
      orderBy("date", "desc"),
      where("uid", "==", uid),
    );

    const querySnapshot = await getDocs(transactionsQuery);
    const transactions: TransactionType[] = [];


    const firstTransaction = querySnapshot.docs.reduce((earliest , doc) =>{
      const transactionDate = doc.data().date.toDate();
      return transactionDate < earliest ? transactionDate : earliest;
    }, new Date());

      const firstYear = firstTransaction.getFullYear();
      const currentYear = new Date().getFullYear();

      const yearlyData = getYearRange(firstYear, currentYear);

      querySnapshot.forEach((doc) => {
        const transaction = doc.data() as TransactionType;
        transaction.id = doc.id;
        transactions.push(transaction);
        const transactionYear = (transaction.date as Timestamp).toDate().getFullYear()
        
       
        const yearData = yearlyData.find((item:any) => item?.year === transactionYear.toString());
        
        if (yearData) {
          if (transaction.type == "income") {
            yearData.income += transaction.amount;
          } else if (transaction.type == "expense") {
            yearData.expense += transaction.amount;
          }
        }
      });

      const stats = yearlyData.flatMap((year:any) => [
        {
          value: year?.income,
          label: year?.month,
          spacing: scale(4),
          labelWidth: scale(35),
          frontColor: "blue",
        },
        {
          value: year?.expense ,
          frontColor: colors.rose,
        },
      ]);

    return { 
      success: true ,
      data:{
        stats,
        transactions
      }

    };
  } catch (err: any) {
    console.log("error fetching yearly stats", err);
    return { success: false, msg: err?.message };
  }
};