import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadfileToCloudinary } from "./imageService";



export const updateUser = async(
    uid: string,
    updateData: UserDataType
): Promise<ResponseType> => {
    try{

        if(updateData.image && updateData?.image?.uri){
            const imageUploadRes = await uploadfileToCloudinary(
                updateData.image,
                "users",
            );
            if(!imageUploadRes.success){
                return {
                    success : false , 
                    msg : imageUploadRes.msg || "Error uploading image"
                };
            }
            updateData.image = imageUploadRes.data;
        }

        // Create a clean update object with only the fields that are provided
        const updateFields: Partial<UserDataType> = {};
        
        // Add required field
        if (updateData.name) {
            updateFields.name = updateData.name;
        }
        
        // Add optional fields only if they exist in the update data
        if (updateData.image) {
            updateFields.image = updateData.image;
        }
        
        // Add the new optional fields
        if (updateData.phone !== undefined) {
            updateFields.phone = updateData.phone;
        }
        
        if (updateData.address !== undefined) {
            updateFields.address = updateData.address;
        }
        
        if (updateData.personalInfo !== undefined) {
            updateFields.personalInfo = updateData.personalInfo;
        }

        const userRef = doc(firestore, "users", uid);
        await updateDoc(userRef, updateFields);
        return { success: true, msg: "Updated Successfully" };
    }catch(error : any){
        console.log("error updating user" , error);
        return { success : false , msg: error?.message}
    }
}