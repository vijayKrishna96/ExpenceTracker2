import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { useAuth } from "@/contexts/authContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import Entypo from "@expo/vector-icons/Entypo";
import HomeCard from "@/components/HomeCard";
import TransactionList from "@/components/TransactionList";
import * as Icons from "phosphor-react-native";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  const constraints = [
    where("uid" , "==" , user?.uid),
    orderBy("date" , "desc"),
    limit(30)
  ]

  const {
    data: recentTransactions,
    error,
    loading: transactionsLoading,
  } = useFetchData<TransactionType>("transactions", constraints)

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo size={16} fontWeight={"500"}>
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity onPress={() => router.push("../(modals)/searchModal")} style={styles.searchIcon}>
            <Entypo name="magnifying-glass" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView
        contentContainerStyle={styles.scrollViewStyle}
        showsHorizontalScrollIndicator={false}
        >
          <View>
              <HomeCard/>
          </View>
          <TransactionList 
          data={recentTransactions}
          loading={transactionsLoading}
          emptyListMessage="No transactions found" 
          title="Recent Transactions"/>
        </ScrollView>
        <Button style={styles.floatingButton} onPress={() => router.push("../(modals)/transactionModal")}>
            <Icons.Plus
            color={colors.black}
            weight="bold"
            size={verticalScale(24)}
            />
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacingY._10,
  },
  searchIcon: {
    backgroundColor: colors.neutral600,
    padding: spacingX._10,
    borderRadius: 50,
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
});
