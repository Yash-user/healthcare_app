// components/ReportsList.jsx
import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

export default function ReportsList({ title = "Reports", reports = [] }) {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={reports}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.rTitle}>{item.title}</Text>
              <Text style={styles.rDate}>{item.date}</Text>
            </View>
            <TouchableOpacity style={styles.viewBtn}>
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "700", marginVertical: 8 },
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
