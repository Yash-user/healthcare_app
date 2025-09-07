// components/DoshaList.jsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function DoshaList({ title = "Dosha", items = [] }) {
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.q}>{item.q}</Text>
            <Text style={styles.a}>{item.a}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  row: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  q: { fontSize: 14, fontWeight: "600" },
  a: { fontSize: 13, color: "gray", marginTop: 6 },
});
