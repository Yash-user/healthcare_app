// app/components/StatCardRow.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * Props:
 * - stats: optional array [{id,label,value}], OR
 * - user: optional user object (will compute stats from user)
 */
export default function StatCardRow({ stats, user }) {
  const built = stats ?? [
    { id: "st1", label: "Appointments", value: user?.stats?.appointments ?? 0 },
    { id: "st2", label: "Lab Reports", value: user?.reports?.length ?? 0 },
    { id: "st3", label: "Active Treatments", value: user?.stats?.treatments ?? 0 },
  ];

  return (
    <View style={styles.row}>
      {built.map((s) => (
        <View key={s.id} style={styles.card}>
          <Text style={styles.value}>{s.value}</Text>
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between" },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 6,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  value: { fontSize: 20, fontWeight: "700", color: "#2e86de" },
  label: { fontSize: 12, color: "gray", marginTop: 6 },
});
