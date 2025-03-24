import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { Ionicons } from "@expo/vector-icons";
import { spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";

const SettingsModal = () => {
  // State for toggles and selections
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [defaultCategory, setDefaultCategory] = useState("Food");

  // Handler functions
  const handleLogout = () => {
    // Implement logout functionality
    console.log("Logging out...");
  };

  const handleResetData = () => {
    // Implement data reset with confirmation
    console.log("Reset data...");
  };

  // Render a section header
  const SectionHeader = ({ title }: any) => (
    <View style={styles.sectionHeader}>
      <Typo style={styles.sectionTitle}>{title}</Typo>
    </View>
  );

  // Render a toggle setting item
  const ToggleSetting = ({ title, value, onValueChange, description }: any) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Typo style={styles.settingTitle}>{title}</Typo>
        {description && (
          <Typo style={styles.settingDescription}>{description}</Typo>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#767577", true: "#4CAF50" }}
        thumbColor={value ? "#fff" : "#f4f3f4"}
      />
    </View>
  );

  // Render a button setting item
  const ButtonSetting = ({
    title,
    onPress,
    icon,
    description,
    destructive,
  }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingTextContainer}>
        <Typo
          style={[styles.settingTitle, destructive && styles.destructiveText]}
        >
          {title}
        </Typo>
        {description && (
          <Typo style={styles.settingDescription}>{description}</Typo>
        )}
      </View>
      <Ionicons
        name={icon}
        size={22}
        color={destructive ? "#FF3B30" : "#007AFF"}
      />
    </TouchableOpacity>
  );

  return (
    <ModalWrapper>
      <View style={styles.container}>
      <View >
        <Header
          title="Update Profile"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
      </View>

        <ScrollView
          style={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* General Settings Section */}
          <SectionHeader title="✅ General Settings" />

          <ToggleSetting
            title="App Theme: Dark Mode"
            value={darkMode}
            onValueChange={setDarkMode}
            description="Toggle between light and dark theme"
          />

          <ButtonSetting
            title="Default Expense Category"
            onPress={() => console.log("Select category")}
            icon="chevron-forward"
            description={`Current: ${defaultCategory}`}
            destructive={false}
          />

          <ToggleSetting
            title="Notification Preferences"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            description="Enable or disable notifications"
          />

          <ButtonSetting
            title="Backup & Restore Data"
            onPress={() => console.log("Backup")}
            icon="cloud-upload-outline"
            description="Sync with cloud storage"
            destructive={false}
          />

          {/* Security & Privacy Section */}
          <SectionHeader title="✅ Security & Privacy" />

          <ButtonSetting
            title="Change PIN/Password"
            onPress={() => console.log("Change password")}
            icon="key-outline"
            description="Change your login password"
            destructive={false}
          />

          <ToggleSetting
            title="Enable Biometric Authentication"
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            description="Use fingerprint or face ID for login"
          />

          <ButtonSetting
            title="Set Auto Logout Time"
            onPress={() => console.log("Set logout time")}
            icon="time-outline"
            description="Currently set to 15 minutes"
            destructive={false}
          />

          <ButtonSetting
            title="Reset App Data"
            onPress={handleResetData}
            icon="trash-outline"
            description="Wipe all transactions"
            destructive={true}
          />
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default SettingsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: spacingY._10,
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionHeader: {
    backgroundColor: "#f8f8f8",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#666",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 0,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: "#888",
  },
  destructiveText: {
    color: "#FF3B30",
  },
});
