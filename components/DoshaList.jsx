// app/components/DoshaList.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

/** Non-virtualized: renders by mapping so it can live inside the FlatList header safely */
export default function DoshaList({ title = "Dosha / Assessment", items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <View style={{ marginTop: 6 }}>
      <Text style={styles.title}>{title}</Text>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.q}>{item.q}</Text>
          <Text style={styles.a}>{item.a}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  row: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  q: { fontSize: 14, fontWeight: "600" },
  a: { fontSize: 13, color: "gray", marginTop: 6 },
});
