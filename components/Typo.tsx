import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '@/constants/theme'; // Assuming colors is defined in your theme
import { TypoProps } from '@/types'; // Ensure TypoProps is correctly defined

const Typo = ({
  size,
  color = colors.text,
  fontWeight = "400",
  children,
  style,
  textProps = {},
}: TypoProps) => {
  return (
    <Text
      style={[
        { fontSize: size, color: color, fontWeight: fontWeight },
        style, // This allows for additional styles to be passed in
      ]}
      {...textProps}
    >
      {children}
    </Text>
  );
};

export default Typo;

const styles = StyleSheet.create({});
