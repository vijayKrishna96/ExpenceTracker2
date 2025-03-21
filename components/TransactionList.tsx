import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { verticalScale } from "@/utils/styling";
import { colors,  radius,  spacingX, spacingY } from "@/constants/theme";
import { TransactionItemProps, TransactionListType } from "@/types";
import Typo from "./Typo";
import { FlashList } from "@shopify/flash-list";
import { expenseCategories } from "@/constants/data";
import Animated, { FadeInDown } from "react-native-reanimated";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {


  const  handleClick = () =>{

  };

  return (
    <View style={styles.container}>
      {title && (
        <Typo size={20} fontWeight={"500"} color={colors.white}>
          {title}
        </Typo>
      )}
      <View style={styles.lists}>
        <FlashList
          data={data}
          renderItem={({ item , index }) => (
          <TransactionItem
          item = {item}  index = {index}  handleClick = {handleClick} 
          />)}
          estimatedItemSize={60}
        />
      </View>

        {
            !loading && data.length == 0 && (
                <Typo
                size={15}
                color={colors.neutral400}
                style={{textAlign: "center" , marginTop: spacingY._15}}
                >
                    {emptyListMessage}
                </Typo>
            )
        }

    </View>
  );
};

const TransactionItem = ({
    item ,
    index,
    handleClick
}:TransactionItemProps) =>{

  let category  = expenseCategories['groceries']
  const IconComponent = category.icon
  console.log(category, "category")

    return(
        <Animated.View
        entering={FadeInDown.delay(index * 50)
          .springify()
          .damping(14)
        }
        >
            <TouchableOpacity style={styles.row} onPress={()=> handleClick(item)}>
                <View style={[styles.icon , {backgroundColor: category.bgColor}]}>
                  {
                      IconComponent&&(
                        <IconComponent
                        size={verticalScale(25)}
                        weight="fill"
                        color={colors.white}
                        />
                      )
                  }
                </View>

                <View style={styles.categoryDes}>
                  <Typo size={17}>{category.label}</Typo>
                  <Typo size={12} color={colors.neutral400} textProps={{numberOfLines: 1}}>
                    {/* {item?.description} */}
                    guds dbd
                  </Typo>
                </View>

                <View style={styles.amountDate}>
                  <Typo fontWeight={"500"} color={colors.rose}>
                    -$332
                  </Typo>
                  <Typo size={13} color={colors.neutral400}>
                    12 days ago
                  </Typo>
                </View>

            </TouchableOpacity>
        </Animated.View>
    )
}

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._17,
  },
  lists: {
    minHeight: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,

    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  categoryDes: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    gap: 2.5,
  },
  amountDate: {
    alignItems: "flex-end",
    paddingRight:"5%",
    gap: 3,
  },
});
