// app/components/InfoItems.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * Props:
 * - items: optional array [{ key, value, fullWidth }]
 * - user: optional user object (if items not provided, component builds items from user)
 */
export default function InfoItems({ items, user }) {
  const builtItems = items ?? [
    { key: "Full name", value: user?.name },
    { key: "Age", value: user?.public?.age },
    { key: "Gender", value: user?.public?.gender },
    { key: "Height", value: user?.public?.heightCm ? `${user.public.heightCm} cm` : undefined },
    { key: "Weight", value: user?.public?.weightKg ? `${user.public.weightKg} kg` : undefined },
    { key: "BMI", value: user?.public?.bmi },
    { key: "Major conditions", value: (user?.public?.conditions || []).join(", ") || "—", fullWidth: true },
    { key: "Allergies", value: (user?.public?.allergies || []).join(", ") || "—", fullWidth: true },
    { key: "Food habits", value: user?.public?.foodHabits },
    { key: "Lifestyle", value: user?.public?.lifestyle },
    { key: "Sleep", value: user?.public?.sleepPattern },
  ];

  return (
    <View style={styles.infoGrid}>
      {builtItems.map((item, idx) => {
        const key = item.key ?? `info-${idx}`;
        return (
          <View key={key} style={[styles.card, item.fullWidth && styles.fullWidth]}>
            <Text style={styles.key}>{item.key}</Text>
            <Text style={styles.value} numberOfLines={2} ellipsizeMode="tail">
              {item.value ?? "—"}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
    minHeight: 64,
    justifyContent: "center",
  },
  fullWidth: { width: "100%" },
  key: { fontSize: 12, color: "#7e7e7e", marginBottom: 6 },
  value: { fontSize: 14, color: "#222", fontWeight: "600" },
});
