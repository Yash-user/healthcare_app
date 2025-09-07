// app/components/ReportsListItem.jsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ReportsListItem({ report }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.rTitle}>{report.title}</Text>
        <Text style={styles.rDate}>{report.date}</Text>
      </View>
      <TouchableOpacity style={styles.viewBtn} onPress={() => console.log("Open report", report.id)}>
        <Text style={styles.viewText}>View</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 1,
  },
  rTitle: { fontSize: 14, fontWeight: "600" },
  rDate: { fontSize: 12, color: "gray", marginTop: 4 },
  viewBtn: { alignSelf: "center", paddingHorizontal: 10, paddingVertical: 6 },
  viewText: { color: "#2e86de", fontWeight: "700" },
});
