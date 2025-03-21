import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors,  radius,  spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import { useAuth } from "@/contexts/authContext";
import { Image } from "expo-image";

import { accountOptionType } from "@/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from '@expo/vector-icons/AntDesign';
import Animated from "react-native-reanimated";
import { FadeInDown } from "react-native-reanimated";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "expo-router";
import { getProfileImage } from "@/services/imageService";

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();

  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <FontAwesome name="user" size={26} color={colors.white} weight="fill" />,
      routeName: "/(modals)/profileModal",
      bgColor: "#6366f1",
    },
    {
      title: "Settings",
      icon: <FontAwesome name="user" size={26} color={colors.white}  weight="fill" />,
      // routeName: "(modals)/profilemodal",
      bgColor: "#059669",
    },
    {
      title: "Privacy Policy",
      icon: <FontAwesome name="user" size={26} color={colors.white}  weight="fill" />,
      // routeName: "(modals)/profilemodal",
      bgColor: colors.neutral600,
    },
    {
      title: "Logout",
      icon: <FontAwesome name="user" size={26} color={colors.white}  weight="fill" />,
      // routeName: "(modals)/profilemodal",
      bgColor: "#e11d48",
    },
  ];

  const handleLogout = async () => {
    await signOut(auth)
  }

  const showLogoutAlert = () => {
    Alert.alert("Confirm" , "Are you sure you want to logout?" , [
      {
        text: "Cancel",
        onPress: ()=> console.log("Cancel logout")
      } , 
      {
        text: "Logout" , 
        onPress: () => handleLogout(),
          style: 'destructive'
      }
    ]);
  }

  const handlePress = (item: accountOptionType) => {
    if(item.title === "Logout") {
      showLogoutAlert();
    }

    if(item.routeName) router.push(item.routeName);
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profile" style={{ marginVertical: spacingY._10 }} />

        {/* user Info */}
        <View style={styles.userInfo}>
          {/* avatar */}
          <View>
            {/* userImage */}
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>
          {/* name & email */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"600"} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>

          {/* account options */}
          <View style={styles.accountOptions}>
            {accountOptions.map((item, index) => {
              return (
                <Animated.View 
                key={index} style={styles.listItem}
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(14)
                }
                >
                  <TouchableOpacity style={styles.flexRow} 
                  onPress={() => handlePress(item)}
                  >
                    <View style={[styles.listIcon,
                      { backgroundColor: item?.bgColor }
                    ]} >
                        {item.icon && item.icon}
                    </View>
                    <Typo size={16} style={{flex: 1}} fontWeight={"500"} >
                      {item.title}
                    </Typo>
                    <AntDesign name="right" size={24} color="white" />
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingX._15,
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
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOptions: {
    marginTop: spacingY._35,
    width: "100%",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
