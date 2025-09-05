import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Cards from "../components/Cards";

export default function Home() {
  return (
    <View style={{ flex: 1 }}>
      {/* Main content */}
      <View style={styles.center}>
        <Text>Home Screen</Text>
      </View>
      {/* Cards Section at the bottom */}
      <Cards />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
