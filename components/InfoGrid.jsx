// app/components/InfoGrid.jsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

/** Small tiles grid for quick links. Props:
 * - items: [{ id, key, value }] (if not provided, pass user.quickLinks)
 */
export default function InfoGrid({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      {items.map((it) => (
        <TouchableOpacity key={it.id} style={styles.card} onPress={() => console.log("Press", it.key)}>
          <Text style={styles.k}>{it.key}</Text>
          {it.value ? <Text style={styles.v}>{it.value}</Text> : null}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "flex-start",
    elevation: 1,
  },
  k: { fontSize: 13, color: "#666", marginBottom: 6 },
  v: { fontSize: 14, fontWeight: "700", color: "#222" },
});
