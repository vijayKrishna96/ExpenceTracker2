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

const PrivacyModal = () => {
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
          title="Privacy Policy"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
      </View>

        <ScrollView
          style={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          
          <ButtonSetting
            title="What Data We Collect"
            onPress={() => console.log("Select category")}
            icon="chevron-forward"
            description={``}
            destructive={false}
          />

          <ToggleSetting
            title="Third-Party Services"
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

          <ButtonSetting
            title="Request Data Deletion"
            onPress={() => console.log("Change password")}
            icon="hourglass"
            description="clear your data"
            destructive={false}
          />

        
          <ButtonSetting
            title="Download My Data"
            onPress={() => console.log("Set logout time")}
            icon="download"
            description="Currently set to 15 minutes"
            destructive={false}
          />

          <ButtonSetting
            title="Manage Data Permissions"
            onPress={handleResetData}
            icon="users-rays"
            description=""
            destructive={false}
          />
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default PrivacyModal;

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
