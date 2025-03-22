import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { scale, verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { ImageBackground } from "expo-image";
import Typo from "./Typo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";

const HomeCard = () => {
  const {user} = useAuth();

  const {
    data: wallets,
    error,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ])

  console.log(wallets, "walletsss")

  const getTotals = () => {
    return wallets.reduce((totals , item) =>{
      totals.balance = totals.balance + Number(item.amount || 0);
      totals.income = totals.income + Number(item.totalIncome || 0);
      totals.expense = totals.expense + Number(item.totalExpenses || 0);
      return totals;
    },{balance: 0, income: 0, expense: 0})
  }

  return (
    <ImageBackground
      source={require("../assets/images/card.png")}
      resizeMode="stretch"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View>
          <View style={styles.totalBalanceRow}>
            <Typo color={colors.neutral800} size={17} fontWeight={"500"}>
              Total Balance
            </Typo>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color="black"
            />
          </View>
          <Typo color={colors.black} size={30} fontWeight={"700"}>
          <Text>&#x20B9;</Text> {walletLoading ? "----" :getTotals().balance?.toFixed(2)}
          </Typo>
        </View>

        <View style={styles.stats}>
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Feather name="arrow-down" size={16} color="black" />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                Income
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.green} fontWeight={"600"}>
              <Text>&#x20B9;</Text> {walletLoading ? "----" : getTotals().income?.toFixed(2)}
              </Typo>
            </View>
          </View>

          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Feather name="arrow-up" size={16} color="black" />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                Expense
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
              <Text>&#x20B9;</Text> {walletLoading ? "----" : getTotals().expense?.toFixed(2)}
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%",
  },
  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7,
  },
});
