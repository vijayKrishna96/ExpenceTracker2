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
import { TransactionType, WalletType } from "@/types";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { updateUser } from "@/services/userService";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import ImageUpload from "@/components/ImageUpload";
import { createOrUpdateWallet, deletewallet } from "@/services/walletService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import TransactionList from "@/components/TransactionList";

const SearchModal = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const constraints = [where("uid", "==", user?.uid), orderBy("date", "desc")];

  const {
    data: allTransactions,
    error,
    loading: transactionsLoading,
  } = useFetchData<TransactionType>("transactions", constraints);

  const filteredTransactions = allTransactions.filter((item) => {
    if (search.length > 1) {
      if (
        item.category?.toLowerCase()?.includes(search.toLowerCase()) ||
        item.type?.toLowerCase()?.includes(search.toLowerCase()) ||
        item.description?.toLowerCase()?.includes(search.toLowerCase())
      ) {
        return true;
      }
      return false;
    }
    return true;
  });

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title={"Search"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
      </View>

      {/* Form */}
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.inputContaier}>
          <Typo color={colors.neutral200}>Wallet Name</Typo>
          <Input
            placeholder="shoes..."
            value={search}
            placeholderTextColor={colors.neutral400}
            containerStyle={{ backgroundColor: colors.neutral800 }}
            onChangeText={(value) => setSearch(value)}
          />
        </View>

        <View>
          <TransactionList
            data={allTransactions}
            loading={filteredTransactions}
            emptyListMessage={"No transactions found"}
          />
        </View>
      </ScrollView>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    padding: spacingY._20,
    justifyContent: "space-between",
  },

  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  inputContaier: {
    gap: spacingY._10,
  },
});
