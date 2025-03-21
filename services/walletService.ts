import { ResponseType, WalletType } from "@/types";

import { firestore } from "@/config/firebase";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { uploadfileToCloudinary } from "./imageService";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };

    if (walletData.image) {
      const imageUploadRes = await uploadfileToCloudinary(
        walletData.image,
        "wallets"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Error uploading wallet image",
        };
      }
      walletToSave.image = imageUploadRes.data;
    }
    
    if (!walletData?.id) {
        walletToSave.amount = 0;
        walletToSave.totalExpenses = 0;
        walletToSave.totalIncome = 0;
        walletToSave.created = new Date();
      }

      const walletRef = walletData?.id
        ? doc(firestore, "wallets", walletData.id)
        : doc(collection(firestore, "wallets"));
      await setDoc(walletRef, walletToSave , { merge: true });
      return { success: true, data: {...walletToSave, id: walletRef.id } };
  } catch (error: any) {
    console.log("error creating wallet", error);
    return { success: false, msg: error.message };
  }
};


export const deletewallet = async(walletId: string): Promise<ResponseType> => {
  try{
      const walletRef = doc(firestore , "wallets" , walletId);
      await deleteDoc(walletRef);
      return {success: true , msg: "Deleted Successfully"}
  }catch(err: any){
      console.log('error deleting wallet' , err);
      return {success: false , msg: err?.message}
  }
}