import React from "react";
import { View, TouchableOpacity, StyleSheet, ToastAndroid, Platform, Alert } from "react-native";
import { useRouter, usePathname } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"], // only images and PDFs
        multiple: false,
      });

      if (result.type === "success") {
        if (Platform.OS === "android") {
          ToastAndroid.show("Report uploaded", ToastAndroid.SHORT);
        } else {
          Alert.alert("Report uploaded");
        }
      }
    } catch (error) {
      console.log("Error picking document:", error);
    }
  };

  const tabs = [
    { icon: "home-outline", activeIcon: "home", route: "/home" },
    { icon: "calendar-outline", activeIcon: "calendar", route: "/Tracker" },
    {
      icon: "cloud-upload",
      activeIcon: "add-circle",
      route: "upload", // placeholder, won’t be used
    },
    { icon: "pie-chart-outline", activeIcon: "pie-chart", route: "/progress" },
    { icon: "person-outline", activeIcon: "person", route: "/profile" },
  ];

  return (
  <View style={styles.navbar}>
    {tabs.map((tab, index) => {
      const isActive = pathname === tab.route;

      // Special case for the 3rd icon (upload button)
      if (index === 2) {
        return (
          <View key={index} style={styles.tabItem}>
            {/* invisible placeholder to preserve spacing */}
            <View style={{ width: 40, height: 40 }} />

            {/* floating button */}
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickDocument}
            >
              <Icon name={tab.icon} size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        );
      }

      return (
        <TouchableOpacity
          key={index}
          style={styles.tabItem}
          onPress={() => router.replace(tab.route)}
        >
          <Icon
            name={isActive ? tab.activeIcon : tab.icon}
            size={26}
            color={isActive ? "#007bff" : "gray"}
          />
        </TouchableOpacity>
      );
    })}
  </View>
);

}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    flex: 1,
  },
  uploadButton: {
    position: "absolute",
    bottom: 10,         // makes it overflow above navbar
    alignSelf: "center",
    backgroundColor: "#007AFF",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,       // Android shadow
  },
});
