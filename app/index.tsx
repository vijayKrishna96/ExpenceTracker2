import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import * as Updates from "expo-updates";

const index = () => {
  const router = useRouter();

  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync(); // Restart app to apply update
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    }
    checkForUpdates();
  }, []);


  return (
    <View style={styles.container}>
      <Image
        styles = {styles.logo}
        resizeMode='contain'
        source={require("../assets/images/equilibrium.png")}
      />
      
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },

  logo: {
    height: "10%",
    aspectRatio: 1,
  },
  webview: {
    flex: 1,
},
});
