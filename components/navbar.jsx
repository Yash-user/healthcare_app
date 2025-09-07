import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { icon: "home-outline", activeIcon: "home", route: "/home" },
    { icon: "calendar-outline", activeIcon: "calendar", route: "/Calendar" },
    { icon: "add-circle-outline", activeIcon: "add-circle", route: "/reportUpload" },
    { icon: "pie-chart-outline", activeIcon: "pie-chart", route: "/progress" },
    { icon: "person-outline", activeIcon: "person", route: "/profile" },
  ];

  return (
    <View style={styles.navbar}>
      {tabs.map((tab, index) => {
        const isActive = pathname === tab.route;
        return (
          <TouchableOpacity
            key={index}
            style={styles.tabItem}
            onPress={() => router.push(tab.route)}
          >
            <Icon
              name={isActive ? tab.activeIcon : tab.icon}
              size={30}
              color={isActive ? "#007AFF" : "gray"}
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
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    flex: 1,
  },
});
