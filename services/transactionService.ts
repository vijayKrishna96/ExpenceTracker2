import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadfileToCloudinary } from "./imageService";
import { createOrUpdateWallet } from "./walletService";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, walletId, type, amount, image } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data!" };
    }

    if (id) {
      const oldTransactionSnapshot = await getDoc(doc(firestore, "transactions", id));
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
      const shouldRevertOrginal = 
        oldTransaction.type !== type ||
        oldTransaction.amount !== amount || 
        oldTransaction.walletId !== walletId;
        
      if (shouldRevertOrginal) {
        let res = await revertAndUpdateWallet(oldTransaction, Number(amount), type, walletId);
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
      transactionData.image = imageUploadRes.data;
    }

    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, transactionData, { merge: true });

    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id }
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

    const revertType = oldTransaction.type == 'income' ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense: number = oldTransaction.type === 'income' 
      ? -Number(oldTransaction.amount)
      : Number(oldTransaction.amount);

    const revertedWalletAmount = Number(orginalWallet.amount) + revertIncomeExpense;

    const revertedIncomeExpenseAmount = 
      Number(orginalWallet[revertType]) - Number(oldTransaction.amount);

    if (newTransactionType == "expense") {
      if (
        oldTransaction.walletId === newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "The selected wallet doesn't have enough balance"
        };
      }

      if (
        oldTransaction.walletId !== newWalletId && 
        newWallet.amount! < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "The selected wallet doesn't have enough balance"
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount
    });

    newWalletSnapshot = await getDoc(
      doc(firestore, "wallets", newWalletId)
    );
    newWallet = newWalletSnapshot.data() as WalletType;

    const updateType =
      newTransactionType == "income" ? "totalIncome" : "totalExpenses";
    
    const updatedTransactionAmount: number =
      newTransactionType == "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);
    
    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;
    
    const newIncomeExpenseAmount = Number(newWallet[updateType]) + Number(newTransactionAmount);

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount
    });
    
    return { success: true };
  } catch (err: any) {
    console.log("error reverting and updating wallet", err);
    return { success: false, msg: err?.message };
  }
};