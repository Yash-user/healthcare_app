// components/InfoGrid.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function InfoGrid({ items = [] }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      {items.map((it, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.key} numberOfLines={1} ellipsizeMode="tail">
            {it.key}
          </Text>

          <Text style={styles.value} numberOfLines={2} ellipsizeMode="tail">
            {it.value ?? "—"}
          </Text>

          {/* optional small divider for visual separation */}
          <View style={styles.divider} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    width: "48%", // two columns with small gap
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    // subtle shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    // elevation for Android
    elevation: 1,
    minHeight: 64,
    justifyContent: "center",
  },
  key: {
    fontSize: 12,
    color: "#7e7e7e",
    marginBottom: 6,
  },
  value: {
    fontSize: 14,
    color: "#222",
    fontWeight: "600",
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "transparent", // keep for expansion if you want a visible divider
    marginTop: 8,
  },
});
