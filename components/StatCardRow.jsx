// components/StatCardRow.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StatCardRow({ stats = [] }) {
  return (
    <View style={styles.row}>
      {stats.map((s) => (
        <View key={s.id} style={styles.card}>
          <Text style={styles.value}>{s.value}</Text>
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    elevation: 2,
  },
  value: { fontSize: 18, fontWeight: "700", color: "#2e86de" },
  label: { fontSize: 12, color: "gray", marginTop: 6 },
});
