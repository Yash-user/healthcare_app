import React from "react";
import {  StyleSheet, Touchable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChatButton() {
  return (
    <Touchable>
      <Ionicons name="chatbubble-ellipses-outline" size={28} style={styles.icon} />
    </Touchable>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginTop: 6,
  }
});