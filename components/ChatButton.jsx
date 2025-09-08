import React from "react";
import {  StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChatButton() {
  return (
    <TouchableOpacity>
      <Ionicons name="chatbubble-ellipses-outline" size={28} style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginTop: 6,
  }
});