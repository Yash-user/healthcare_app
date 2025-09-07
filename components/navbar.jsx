import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: "Home", icon: "home-outline", route: "/home" },
    { name: "Calendar", icon: "calendar-outline", route: "/Calendar" },
    { name: "Profile", icon: "person-outline", route: "/profile" },
  ];

  return (
    <View style={styles.navbar}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.route;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => router.push(tab.route)}
          >
            <Icon
              name={tab.icon}
              size={24}
              color={isActive ? "#007AFF" : "gray"}
            />
            <Text
              style={[styles.tabText, { color: isActive ? "#007AFF" : "gray" }]}
            >
              {tab.name}
            </Text>
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
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    flex: 1,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
});
