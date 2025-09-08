// app/components/Heatmap.jsx
import React, { useMemo } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import HeatmapMonth from "./HeatmapMonth";

/**
 * Renders last `monthsToShow` months horizontally (most recent first).
 * Does not render months earlier than user's registration date (if provided).
 *
 * props:
 *  - data: { 'YYYY-MM-DD': count } (activity map)
 *  - monthsToShow: number (default 4)
 *  - userRegisteredAt: ISO date string (optional)
 *  - cellSize, cellSpacing, startColor, endColor, emptyColor, onDayPress
 */
export default function Heatmap({
  data = {},
  monthsToShow = 4,
  userRegisteredAt,
  cellSize = 12,
  cellSpacing = 4,
  startColor = "#e6f4ea",
  endColor = "#1b8f3b",
  emptyColor = "#f3f3f3",
  onDayPress = () => {},
}) {
  const registeredDate = userRegisteredAt ? new Date(userRegisteredAt) : null;
  const today = new Date();

  // Build month list (most recent first) but stop if before registration
  const months = useMemo(() => {
    const list = [];
    for (let i = 0; i < monthsToShow; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      if (registeredDate) {
        // if the first day of this month is earlier than registration month, skip it
        if (d.getFullYear() < registeredDate.getFullYear()) break;
        if (
          d.getFullYear() === registeredDate.getFullYear() &&
          d.getMonth() < registeredDate.getMonth()
        )
          break;
      }
      list.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
    }
    return list;
  }, [today, monthsToShow, registeredDate]);

  // If no months (e.g., registered this very month), at least show current month
  if (months.length === 0) {
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4, alignItems: "flex-start" }}
      >
        {months.map((m, idx) => (
          <View key={`${m.year}-${m.month}`} style={{ marginRight: 12 }}>
            <HeatmapMonth
              year={m.year}
              month={m.month}
              data={data}
              startColor={startColor}
              endColor={endColor}
              emptyColor={emptyColor}
              cellSize={cellSize}
              cellSpacing={cellSpacing}
              onDayPress={onDayPress}
            />
          </View>
        ))}
      </ScrollView>
      {/* Optional: legend can be added here if you want */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 6 },
});
