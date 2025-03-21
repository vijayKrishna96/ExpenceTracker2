import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ImageUploadProps } from "@/types";
import Feather from "@expo/vector-icons/Feather";
import Entypo from '@expo/vector-icons/Entypo';
import Typo from "./Typo";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import { Image } from "expo-image";

import * as ImagePicker from 'expo-image-picker';
import { getFilePath } from "@/services/imageService";

const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  placeholder = "",
}: ImageUploadProps) => {

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
        //   allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          onSelect(result.assets[0]);
        }
      };

  return (
    <View>
      {!file && (
        <TouchableOpacity
            
          style={[styles.inputContainer, containerStyle && containerStyle]}
          onPress={pickImage}
        >
          <Feather name="upload" size={24} color="black" />
          {placeholder && <Typo size={15}>{placeholder}</Typo>}
        </TouchableOpacity>
      )}

      {file && (
        <View>
            <Image
            style={styles.image}
            source={getFilePath(file)}
            contentFit="cover"
            transition={100}
            />
            <TouchableOpacity style={styles.deleteIcon} onPress={onClear} >
            <Entypo name="circle-with-cross" size={24} color="black" />
            </TouchableOpacity>
        </View>
      )}

    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  inputContainer: {
    height: verticalScale(54),
    backgroundColor: colors.neutral700,
    borderRadius: radius._15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.neutral500,
    borderStyle: "dashed",
  },
  image:{
    height: scale(150), 
    width: scale(150),
    borderRadius: radius._15,
    borderCurve: "continuous",
   
  },
  deleteIcon: {
      position: "absolute",
      top: scale(6),
      right: scale(6),
      shadowColor: colors.black,
      shadowOffset:{
        width: 0,
        height: 5,
      },
      shadowOpacity: 1,
      shadowRadius: 10,
  }
});
