// app/components/HeatmapMonth.jsx
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

/**
 * HeatmapMonth - single month column-of-weeks heatmap (GitHub-like)
 *
 * Props:
 *  - year, month
 *  - data: { 'YYYY-MM-DD': count }
 *  - cellSize: number (width/height of each square)
 *  - cellSpacing: number (gap between squares)
 *  - startColor, endColor, emptyColor
 *  - onDayPress
 */
export default function HeatmapMonth({
  year,
  month,
  data = {},
  startColor = "#e6f4ea",
  endColor = "#1b8f3b",
  emptyColor = "#f3f3f3",
  cellSize = 12,
  cellSpacing = 4,
  onDayPress = () => {},
}) {
  // compute grid and max
  const monthGrid = useMemo(() => {
    const firstOfMonth = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstWeekday = firstOfMonth.getDay();

    const days = [];
    let max = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = new Date(year, month - 1, d).toISOString().slice(0, 10);
      const count = Number(data[iso] || 0);
      max = Math.max(max, count);
      days.push({ day: d, iso, count });
    }

    const totalSlots = firstWeekday + daysInMonth;
    const weeks = Math.ceil(totalSlots / 7);

    const grid = Array.from({ length: weeks }, () => Array(7).fill(null));
    days.forEach((dObj, idx) => {
      const absoluteIndex = firstWeekday + idx;
      const weekIndex = Math.floor(absoluteIndex / 7);
      const weekdayIndex = absoluteIndex % 7;
      grid[weekIndex][weekdayIndex] = dObj;
    });

    return { grid, max };
  }, [year, month, data]);

  // color helpers
  const hexToRgb = (hex) => {
    const c = hex.replace("#", "");
    const n = parseInt(c, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const rgbToHex = (r, g, b) =>
    `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
      .toString(16)
      .padStart(2, "0")}`;
  const lerp = (a, b, t) => Math.round(a + (b - a) * t);

  const getColorForCount = (count) => {
    if (!count) return emptyColor;
    const t = monthGrid.max === 0 ? 1 : Math.min(1, count / monthGrid.max);
    const [r1, g1, b1] = hexToRgb(startColor);
    const [r2, g2, b2] = hexToRgb(endColor);
    return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
  };

  // label sizing derived from cellSize so alignment stays consistent
  const labelHeight = cellSize + 1; // extra space so text doesn't overlap
  const labelFontSize = Math.max(10, Math.round(cellSize * 0.85));
  const labelWidth = Math.max(14, Math.round(cellSize + 4));

  return (
    <View style={styles.container}>
      <Text style={styles.monthTitle}>
        {new Date(year, month - 1).toLocaleString("default", {
          month: "short",
          year: "numeric",
        })}
      </Text>

      <View style={styles.row}>
        {/* Weekday labels (vertical) */}
        <View style={{ marginRight: 8 }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <Text
              key={d + i}
              style={[
                styles.weekdayLabel,
                {
                  width: labelWidth,
                  height: labelHeight,
                  lineHeight: labelHeight,
                  marginBottom: cellSpacing - 1,
                  fontSize: labelFontSize,
                },
              ]}
            >
              {d}
            </Text>
          ))}
        </View>

        {/* Weeks (columns) */}
        <View style={{ flexDirection: "row" }}>
          {monthGrid.grid.map((week, wi) => (
            <View key={wi} style={{ marginRight: cellSpacing }}>
              {week.map((cell, di) => {
                const bg = cell ? getColorForCount(cell.count) : "transparent";
                return cell ? (
                  <TouchableOpacity
                    key={di}
                    activeOpacity={0.85}
                    onPress={() => onDayPress(cell.iso, cell.count)}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      borderRadius: 3,
                      backgroundColor: bg,
                      marginBottom: cellSpacing,
                    }}
                  />
                ) : (
                  <View
                    key={di}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      borderRadius: 3,
                      backgroundColor: "transparent",
                      marginBottom: cellSpacing,
                    }}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 6 },
  monthTitle: { fontSize: 13, fontWeight: "700", marginBottom: 6, color: "#111" },
  row: { flexDirection: "row", alignItems: "flex-start" },
  weekdayLabel: { color: "#666", textAlign: "center" },
});
