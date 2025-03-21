import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import React from "react";
  import ScreenWrapper from "@/components/ScreenWrapper";
  import { verticalScale } from "@/utils/styling";
  import MaterialIcons from "@expo/vector-icons/MaterialIcons";
  import { colors, radius, spacingX, spacingY } from "@/constants/theme";
  import Typo from "@/components/Typo";
  import { useRouter } from "expo-router";
  import { useAuth } from "@/contexts/authContext";
  import useFetchData from "@/hooks/useFetchData";
  import { WalletType } from "@/types";
  import { orderBy, where } from "firebase/firestore";
  import Loading from "@/components/Loading";
  import WalletListItem from "@/components/WalletListItem";
  
  const wallet = () => {
    const router = useRouter();
    const { user } = useAuth();
  
    const {
      data: wallets,
      error,
      loading,
    } = useFetchData<WalletType>("wallets", [
      where("uid", "==", user?.uid),
      orderBy("created", "desc"),
    ]);
  
    console.log(wallets[0], "wallets");
  
    const getTotalBalance = () => {
      wallets.reduce((total , item) =>{
        total = total + (item.amount || 0);
        return total
      }, 0)
    };
  
    return (
      <ScreenWrapper style={{ backgroundColor: colors.black }}>
        <View style={styles.container}>
          {/* Balance View */}
          <View style={styles.balanceView}>
            <View>
              <Typo size={45} fontWeight={"500"}>
                $ {getTotalBalance()?.toFixed(2)}
              </Typo>
              <Typo size={16} color={colors.neutral400}>
                Total Balance
              </Typo>
            </View>
          </View>
  
          {/* Wallets */}
          <View style={styles.wallets}>
            {/* header */}
            <View style={styles.flexRow}>
              <Typo size={20}>My Wallets</Typo>
              <TouchableOpacity
                onPress={() => router.push("../(modals)/walletModal")}
              >
                <MaterialIcons name="add-circle" size={24} color="black" />
              </TouchableOpacity>
            </View>
  
            {loading && <Loading />}
  
            <FlatList
              data={wallets}
              renderItem={({ item , index }) =>{
              return(<WalletListItem item = {item} index = {index} router = {router}/>)
            }}
            contentContainerStyle={styles.listStyle}
            />
          </View>
        </View>
      </ScreenWrapper>
    );
  };
  
  export default wallet;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
    },
    balanceView: {
      height: verticalScale(160),
      backgroundColor: colors.black,
      justifyContent: "center",
      alignItems: "center",
    },
    flexRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacingY._10,
    },
    wallets: {
      flex: 1,
      backgroundColor: colors.neutral900,
      borderTopRightRadius: radius._30,
  
      borderTopLeftRadius: radius._30,
      padding: spacingX._20,
      paddingTop: spacingY._25,
    },
    listStyle: {
      paddingVertical: spacingY._25,
      paddingTop: spacingY._15,
    },
  });
  