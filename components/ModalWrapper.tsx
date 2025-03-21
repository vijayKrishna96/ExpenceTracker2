import { Platform, StyleSheet, View } from 'react-native'
import React from 'react'
import { ModalWrapperProps } from '@/types'
import { colors, spacingY } from '@/constants/theme'

const ModalWrapper = ({
    style,
    children,
    bg = colors.neutral800
}: ModalWrapperProps) => {
  return (
    <View style={StyleSheet.flatten([
      styles.container, 
      { backgroundColor: bg }, 
      style
    ])}>
      {children}
    </View>
  )
}

export default ModalWrapper

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,  // Added horizontal padding for spacing
    paddingTop: Platform.select({
      ios: spacingY._15,
      android: 50
    }),
    paddingBottom: Platform.select({
      ios: spacingY._20,
      android: spacingY._10
    }),
  }
})
