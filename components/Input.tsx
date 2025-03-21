import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { InputProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import { colors, radius, spacingX } from '@/constants/theme'

const Input = (props: InputProps) => {
  return (
    <View style={[styles.container , props.containerStyle && props.containerStyle]}>
      <TextInput
        style = {[styles.input , props.inputStyle && props.inputStyle]}
        ref = {props.inputRef}
        placeholderTextColor={colors.neutral400}
        {...props}
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(54),
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15
  },
  input:{
    flex: 1,
    color: colors.white,
    fontSize: verticalScale(14)
  }
})