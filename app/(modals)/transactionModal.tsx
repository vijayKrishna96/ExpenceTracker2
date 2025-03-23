import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import BackButton from "@/components/BackButton";
import Feather from "@expo/vector-icons/Feather";
import Header from "@/components/Header";
import { Image } from "expo-image";
import Typo from "@/components/Typo";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import ImageUpload from "@/components/ImageUpload";
import { createOrUpdateWallet, deletewallet } from "@/services/walletService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TransactionType, WalletType } from "@/types";

import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import { expenseCategories, transactionTypes } from "@/constants/data";
import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "@/components/Input";
import { createOrUpdateTransaction, deleteTransaction } from "@/services/transactionService";

const TransactionModal = () => {
  const { user, updateUserData } = useAuth();

  const [transaction, setTransaction] = useState<TransactionType>({
    type: "",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);


  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState({
    type: false,
    wallet: false,
    category: false,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  type  paramType = {
    id: string;
    type: string,
    amount: any;
    category: string;
    date: string;
    description?: string;
    image?: any;
    uid: string;
    walletId:string
  }

  const oldTransaction:  paramType =
    useLocalSearchParams();
  // console.log("oldTransaction", oldTransaction);

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS === "ios" ? true : false);
  };

  const hideDatePicker = () => {
    setShowDatePicker(false);
  };

    useEffect(() => {
      if (oldTransaction?.id) {
        setTransaction({
          type: oldTransaction?.type,
          image: oldTransaction?.image,
          amount: oldTransaction?.amount,
          description:oldTransaction?.description || "",
          category: oldTransaction?.category || "",
          date: new Date(oldTransaction?.date),
          walletId: oldTransaction.walletId,
        });
      }
    }, []);

  const onSubmit = async () => {
    let { type, amount, description, category, date, walletId, image } =
      transaction;
    if (!type.trim() || !walletId.trim() || amount <= 0) {
      Alert.alert("Transaction", "Please fill all the required fields");
      return;
    }

    if (type === "expense" && !category.trim()) {
      Alert.alert("Transaction", "Please select a category for your expense");
      return;
    }

    const data: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image,
      uid: user?.uid,
    };

    if (oldTransaction?.id) data.id = oldTransaction?.id;

    setLoading(true);

    // Replace with proper transaction service call
    const res = await createOrUpdateTransaction(data);

    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.msg);
    }
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteTransaction(oldTransaction?.id , oldTransaction?.walletId);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
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
          title={oldTransaction.id ? "Update Transaction" : "New Transaction"}
          leftIcon={<BackButton />}
        />
        {/* Form */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContaier}>
            <Typo color={colors.neutral200}>Type</Typo>
            <Dropdown
              style={styles.dropDownContainer}
              placeholderStyle={styles.dropdownPlaceholder}
              activeColor={colors.neutral700}
              iconStyle={styles.dropDownIcon}
              selectedTextStyle={styles.dropdownSelectedText}
              data={transactionTypes}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropDownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              placeholder={!isFocus.type ? "Select item" : "..."}
              searchPlaceholder="Search..."
              value={transaction.type}
              onFocus={() => setIsFocus({ ...isFocus, type: true })}
              onBlur={() => setIsFocus({ ...isFocus, type: false })}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value });
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={isFocus.type || transaction.type ? "blue" : "black"}
                  name="Safety"
                  size={20}
                />
              )}
            />
          </View>

          {/* wallet */}
          <View style={styles.inputContaier}>
            <Typo color={colors.neutral200}>Wallet</Typo>
            <Dropdown
              style={styles.dropDownContainer}
              placeholderStyle={styles.dropdownPlaceholder}
              activeColor={colors.neutral700}
              iconStyle={styles.dropDownIcon}
              selectedTextStyle={styles.dropdownSelectedText}
              data={wallets.map((wallet) => ({
                label: `${wallet.name} ($${wallet.amount}) `,
                value: wallet?.id,
              }))}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropDownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              placeholder={"select wallet"}
              searchPlaceholder="Search..."
              value={transaction.walletId}
              onFocus={() => setIsFocus({ ...isFocus, wallet: true })}
              onBlur={() => setIsFocus({ ...isFocus, wallet: false })}
              onChange={(item) => {
                setTransaction({ ...transaction, walletId: item.value || "" });
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={
                    isFocus.wallet || transaction.walletId ? "blue" : "black"
                  }
                  name="Safety"
                  size={20}
                />
              )}
            />
          </View>

          {/* Expense Category Dropdown */}
          {transaction.type === "expense" && (
            <View style={styles.inputContaier}>
              <Typo color={colors.neutral200}>Category</Typo>
              <Dropdown
                style={styles.dropDownContainer}
                placeholderStyle={styles.dropdownPlaceholder}
                activeColor={colors.neutral700}
                iconStyle={styles.dropDownIcon}
                selectedTextStyle={styles.dropdownSelectedText}
                data={Object.values(expenseCategories)}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropDownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                placeholder={"select category"}
                searchPlaceholder="Search..."
                value={transaction.category}
                onFocus={() => setIsFocus({ ...isFocus, category: true })}
                onBlur={() => setIsFocus({ ...isFocus, category: false })}
                onChange={(item) => {
                  setTransaction({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color={
                      isFocus.category || transaction.category
                        ? "blue"
                        : "black"
                    }
                    name="Safety"
                    size={20}
                  />
                )}
              />
            </View>
          )}

          {/* Amount Input */}
          <View style={styles.inputContaier}>
            <Typo color={colors.neutral200}>Amount</Typo>
            <TextInput
              style={styles.textInput}
              placeholder="Enter amount"
              placeholderTextColor={colors.neutral300}
              keyboardType="numeric"
              value={transaction.amount ? String(transaction.amount) : ""}
              onChangeText={(text) => {
                const numValue = parseFloat(text) || 0;
                setTransaction({ ...transaction, amount: numValue });
              }}
            />
          </View>

          {/* date picker*/}
          <View style={styles.inputContaier}>
            <Typo color={colors.neutral200}>Date</Typo>
            <Pressable
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Typo size={14}>{transaction.date.toLocaleDateString()}</Typo>
            </Pressable>

            {showDatePicker && (
              <>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={transaction.date as Date}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                  style={Platform.OS === "ios" ? styles.isoDatePicker : {}}
                  textColor={Platform.OS === "ios" ? colors.white : undefined}
                />

                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={hideDatePicker}
                  >
                    <Typo>Done</Typo>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>


          {/* Description Input */}
          <View style={styles.inputContaier}>
            <Typo color={colors.neutral200}>Description (Optional)</Typo>
            <TextInput
              style={[
                styles.dateInput,
                {
                  height: verticalScale(80),
                  textAlignVertical: "top",
                  paddingTop: spacingY._10,
                  color: colors.neutral300,
                },
              ]}
              placeholder="Enter description"
              placeholderTextColor={colors.neutral300}
              multiline
              value={transaction.description}
              onChangeText={(text) =>
                setTransaction({ ...transaction, description: text })
              }
            />
          </View>

          <View style={styles.inputContaier}>
            <Typo color={colors.neutral200}>Receipt (Optional)</Typo>
            {/* Image Input */}
            <ImageUpload
              file={transaction.image}
              onClear={() => setTransaction({ ...transaction, image: null })}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              placeholder="Upload Image"
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldTransaction?.id && (
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
          <Typo>{oldTransaction.id ? "Update " : "Add "}</Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  inputContaier: {
    gap: spacingY._10,
  },
  form: {
    gap: spacingY._25,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
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
  iosDropdown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._20,
    borderCurve: "continuous",
    borderWidth: 1,
    borderRadius: radius._17,
  },
  androidDropdown: {
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    color: colors.white,
    paddingHorizontal: spacingX._20,
    borderRadius: radius._17,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.neutral300,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  textInput :{
    flexDirection: "row",
    height: verticalScale(54),
    color: colors.neutral300,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  isoDatePicker: {
    alignSelf: "flex-start",
    marginVertical: spacingY._10,
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    marginTop: spacingY._10,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._10,
  },
  dropDownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._17,
    borderCurve: "continuous",
  },
  dropDownItemText: { color: colors.white },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropDownIcon: {
    height: verticalScale(54),
    tintColor: colors.neutral300,
  },
});
