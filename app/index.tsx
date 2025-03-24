import { Button, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import * as Updates from "expo-updates";
import Constants, { ExecutionEnvironment } from 'expo-constants';


const index = () => {
  const router = useRouter();
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          setUpdateAvailable(true);
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    }
    if (Constants.executionEnvironment !== ExecutionEnvironment.StoreClient) {
      checkForUpdates();
    }
  }, []);

  const applyUpdate = async () => {
    await Updates.reloadAsync();
  };


  return (
    <View style={styles.container}>
      <Image
        styles = {styles.logo}
        resizeMode='contain'
        source={require("../assets/images/equilibrium.png")}
      />
      {updateAvailable && (
        <Button 
          title="Update Available - Tap to Apply" 
          onPress={applyUpdate} 
        />
      )}
      
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
