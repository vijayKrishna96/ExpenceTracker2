import { View, Platform, TouchableOpacity, StyleSheet } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { colors, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { vector } from "firebase/firestore";

export default function CustomTabs({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const tabbarIcons: any = {
    index: (isFocused: boolean) => (
      <AntDesign
        name="home"
        size={24}
        color={isFocused ? colors.primary : "white"}
      />
    ),

    statistics: (isFocused: boolean) => (
      <AntDesign
        name="linechart"
        size={24}
        color={isFocused ? colors.primary : "white"}
      />
    ),

    wallet: (isFocused: boolean) => (
      <Entypo
        name="wallet"
        size={24}
        color={isFocused ? colors.primary : "white"}
      />
    ),

    profile: (isFocused: boolean) => (
      <FontAwesome
        name="user"
        size={24}
        color={isFocused ? colors.primary : "white"}
      />
    ),
  };

  return (
    <View style={styles.tabBar}>
      {state.routes
        .slice() // Create a copy of the routes to prevent modifying the original array
        .sort((a, b) => {
          const order = Object.keys(tabbarIcons);
          return order.indexOf(a.name) - order.indexOf(b.name);
        })
        .map((route) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          // Find the original index in state.routes
          const isFocused =
            state.index ===
            state.routes.findIndex((r) => r.name === route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabbarItem}
              key={route.key}
            >
              {tabbarIcons[route.name]?.(isFocused)}
            </TouchableOpacity>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    width: "100%",
    height: Platform.OS == "ios" ? verticalScale(73) : verticalScale(69),
    backgroundColor: colors.neutral800,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
  },
  tabbarItem: {
    marginBottom: Platform.OS == "ios" ? spacingY._10 : spacingY._5,
    justifyContent: "center",
    alignItems: "center",
  },
});
