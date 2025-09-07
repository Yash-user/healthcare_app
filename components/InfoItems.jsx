// app/components/InfoItems.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function InfoItems({ items }) {
  return (
    <View style={styles.infoGrid}>
      {items.map((item, idx) => (
        <View key={idx} style={[styles.card, item.fullWidth && styles.fullWidth]}>
          <Text style={styles.key}>{item.key}</Text>
          <Text style={styles.value} numberOfLines={2} ellipsizeMode="tail">
            {item.value ?? "—"}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  card: {
    width: "48%", // default two-column layout
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
    minHeight: 64,
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%", // stretch across
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
});
