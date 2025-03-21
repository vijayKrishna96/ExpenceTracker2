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
  import { WalletType } from "@/types";
  import Input from "@/components/Input";
  import Button from "@/components/Button";
  import { useAuth } from "@/contexts/authContext";
  import { updateUser } from "@/services/userService";
  import { useLocalSearchParams, useRouter } from "expo-router";
  import * as ImagePicker from "expo-image-picker";
  import ImageUpload from "@/components/ImageUpload";
  import { createOrUpdateWallet, deletewallet } from "@/services/walletService";
  import MaterialIcons from '@expo/vector-icons/MaterialIcons';
  
  const WalletModal = () => {
    const { user, updateUserData } = useAuth();
  
    const [wallet, setWallet] = useState<WalletType>({
      name: "",
      image: null,
    });
  
    const [loading, setLoading] = useState(false);
    const router = useRouter();
  
    const oldWallet: { name: string; image: string; id: string } =
      useLocalSearchParams();
    console.log("oldWallet", oldWallet);
  
    useEffect(() => {
      if (oldWallet?.id) {
        setWallet({
          name: oldWallet?.name,
          image: oldWallet?.image,
        });
      }
    }, []);
  
    const onSubmit = async () => {
      let { name, image } = wallet;
      if (!name.trim() || !image) {
        Alert.alert("Wallet", "Please fill all the fields");
        return;
      }
  
      const data: WalletType = {
        name,
        image,
        uid: user?.uid,
      };
  
      if (oldWallet?.id) data.id = oldWallet?.id;
  
      setLoading(true);
  
      const res = await createOrUpdateWallet(data);
      setLoading(false);
      if (res.success) {
        updateUserData(user?.uid as string);
        router.back();
      } else {
        Alert.alert("user", res.msg);
      }
    };
  
    const onDelete = async() => {
          if(!oldWallet?.id) return;
          setLoading(true);
          const res = await deletewallet(oldWallet?.id);
          setLoading(false);
          if(res.success){
            router.back();
          }else{
            Alert.alert("Wallet" , res.msg)
          }
    };
  
    const showDeleteAlert = () => {
      Alert.alert(
        "Delete Wallet",
        "Are you sure you want to delete this wallet?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => onDelete(),
            style: "destructive",
          },
        ]
      );
    };
  
    return (
      <ModalWrapper>
        <View style={styles.container}>
          <Header
            title={oldWallet.id ? "Update Wallet" : "New Wallet"}
            leftIcon={<BackButton />}
          />
        </View>
  
        {/* Form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContaier}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <Input
              placeholder="Name"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>
  
          <View style={styles.inputContaier}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            {/* Image Input */}
            <ImageUpload
              file={wallet.image}
              onClear={() => setWallet({ ...wallet, image: null })}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              placeholder="Upload Image"
            />
          </View>
  
          <View style={styles.footer}>
            {oldWallet?.id && (
              <Button
                onPress={showDeleteAlert}
                style={{
                  backgroundColor: colors.rose,
                  paddingHorizontal: spacingX._15,
                }}
              >
                <MaterialIcons name="delete-outline" size={24} color="white" />
              </Button>
            )}
            <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
              <Typo>{oldWallet.id ? "Update Wallet" : "Add Wallet"}</Typo>
            </Button>
          </View>
        </ScrollView>
      </ModalWrapper>
    );
  };
  
  export default WalletModal;
  
  const styles = StyleSheet.create({
    container: {
      padding: spacingY._20,
      justifyContent: "space-between",
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
  