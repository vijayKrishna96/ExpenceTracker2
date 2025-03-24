import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import textRecognition from "@react-native-ml-kit/text-recognition";

const ScanText = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [scannedText, setScannedText] = useState<string | null>(null);

  // 📷 Open Camera to Capture Image
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "Camera access is required to scan text.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      recognizeText(result.assets[0].uri);
    }
  };

  // 📂 Pick an Image from Gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      recognizeText(result.assets[0].uri);
    }
  };

  // 🔍 Recognize Text from Image
  const recognizeText = async (uri: string) => {
    try {
      const result = await textRecognition.recognize(uri);
      setScannedText(result.text || "No text found.");
    } catch (error) {
      Alert.alert("Error", "Failed to recognize text. Please try again.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Your Bill</Text>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={openCamera}>
          <Text style={styles.buttonText}>📸 Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>📂 Pick Image</Text>
        </TouchableOpacity>
      </View>

      {scannedText && (
        <View style={styles.textContainer}>
          <Text style={styles.resultTitle}>Extracted Text:</Text>
          <Text style={styles.resultText}>{scannedText}</Text>
        </View>
      )}
    </View>
  );
};

export default ScanText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007AFF",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  textContainer: {
    marginTop: 20,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    width: "100%",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  resultText: {
    marginTop: 5,
    fontSize: 16,
  },
});
