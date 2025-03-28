import {
    Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import BackButton from "@/components/BackButton";
import Feather from "@expo/vector-icons/Feather";
import Header from "@/components/Header";
import { Image } from "expo-image";
import Typo from "@/components/Typo";
import { UserDataType } from "@/types";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { updateUser } from "@/services/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { getProfileImage } from "@/services/imageService";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";

const ProfileModal = () => {
  const { user, updateUserData } = useAuth();

  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    email:"",
    image: null,
    phone: null,
    address: null,
    personalInfo: null,
  });
  const [image, setImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    data: data,
  } = useFetchData<UserDataType>("users", [
    where("uid", "==", user?.uid),
  ]);

  console.log(data, "dataaa")
  const userDataFromDB = data && data.length > 0 ? data[0] : null;
  
  useEffect(() => {
    if (userDataFromDB) {
      setUserData({
        name: userDataFromDB.name || user?.name || "",
        email: userDataFromDB.email || user?.email || "",
        image: userDataFromDB.image || user?.image || null,
        phone: userDataFromDB.phone || null,
        address: userDataFromDB.address || user?.address || null,
        personalInfo: userDataFromDB.personalInfo || user?.personalInfo || null,
      });
    }
  }, [user, userDataFromDB]);

  const onSubmit = async () => {
    let { name } = userData;
    if (!name.trim()) {
      Alert.alert("User", "Please fill all the required fields");
      return;
    }
    setLoading(true);

    const res = await updateUser(user?.uid as string, userData);
    setLoading(false);
    if (res.success) {
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("User", res.msg);
    }
  };


  const onPickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setUserData({ ...userData, image: result.assets[0].uri });
    }
  };

  return (
    <ModalWrapper>
      
      <View >
        <Header
          title="Update Profile"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
      </View>

      {/* Form */}
      <ScrollView contentContainerStyle={styles.form} 
          showsVerticalScrollIndicator={false}>

        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={getProfileImage(userData.image)}
            contentFit="cover"
            transition={100}
          />

          <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
            <Feather name="edit-2" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContaier}>
          <Typo color={colors.neutral200}>Name*</Typo>
          <Input
            placeholder="Name"
            value={userData.name}
            onChangeText={(value) => setUserData({ ...userData, name: value })}
          />
        </View>

        <View style={styles.inputContaier}>
          <Typo color={colors.neutral200}>Email*</Typo>
          <Input
            placeholder="Email"
            value={userData.email}
            editable={false} // Disables editing
          />
        </View>

        <View style={styles.inputContaier}>
          <Typo color={colors.neutral200}>Phone Number (Optional)</Typo>
          <Input
            placeholder="Enter phone number"
            value={userData?.phone || ""}
            onChangeText={(value) => setUserData({ ...userData, phone: value })}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContaier}>
          <Typo color={colors.neutral200}>Address (Optional)</Typo>
          <Input
            placeholder="Enter address"
            value={userData.address || ""}
            onChangeText={(value) => setUserData({ ...userData, address: value })}
          />
        </View>

        <View style={styles.inputContaier}>
          <Typo color={colors.neutral200}>Personal Information (Optional)</Typo>
          <Input
            placeholder="Add personal information"
            value={userData.personalInfo || ""}
            onChangeText={(value) => setUserData({ ...userData, personalInfo: value })}
            multiline={true}
            numberOfLines={3}
          />
        </View>

        <View style={styles.footer}>
          <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
            <Typo>Update</Typo>
          </Button>
        </View>
      </ScrollView>
    </ModalWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
    paddingBottom: spacingY._30
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._5,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContaier: {
    gap: spacingY._10,
  },
});
