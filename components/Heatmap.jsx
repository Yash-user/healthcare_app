import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Heatmap({
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1,
  data = {},
  startColor = "#e6f4ea", // pale
  endColor = "#1b8f3b",   // deep green
  emptyColor = "#f3f3f3",
  cellSize = 2,           // reduced size
  cellSpacing = 1.5,
  onDayPress = () => {},
}) {
  const monthData = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstWeekday = firstDay.getDay();

    const totalSlots = firstWeekday + daysInMonth;
    const weeks = Math.ceil(totalSlots / 7);

    const cells = [];
    let max = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = new Date(year, month - 1, d).toISOString().slice(0, 10);
      const count = Number(data[iso] || 0);
      max = Math.max(max, count);
      cells.push({ day: d, iso, count });
    }

    const padded = Array(firstWeekday).fill(null).concat(cells);
    while (padded.length % 7 !== 0) padded.push(null);

    const grid = [];
    for (let w = 0; w < padded.length / 7; w++) {
      grid.push(padded.slice(w * 7, w * 7 + 7));
    }

    return { grid, max };
  }, [year, month, data]);

  const hexToRgb = (hex) => {
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };
  const rgbToHex = (r, g, b) => {
    const toHex = (n) => n.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  const lerp = (a, b, t) => Math.round(a + (b - a) * t);

  const getColorForCount = (count) => {
    if (!count) return emptyColor;
    const t = monthData.max === 0 ? 1 : count / monthData.max;
    const [r1, g1, b1] = hexToRgb(startColor);
    const [r2, g2, b2] = hexToRgb(endColor);
    return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Progress — ${month}/${year}`}</Text>

      <View style={[styles.grid, { marginTop: 6 }]}>
        {/* Weekday labels */}
        <View style={{ marginRight: 6 }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <Text
              key={d}
              style={[
                styles.weekdayLabel,
                { height: cellSize, lineHeight: cellSize },
              ]}
            >
              {d[0]}
            </Text>
          ))}
        </View>

        {/* Weeks */}
        <View style={{ flexDirection: "row" }}>
          {monthData.grid.map((week, wi) => (
            <View key={wi} style={{ marginRight: cellSpacing }}>
              {week.map((cell, di) => {
                if (!cell) {
                  return (
                    <View
                      key={di}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        borderRadius: 2,
                        backgroundColor: "transparent",
                        marginBottom: cellSpacing,
                      }}
                    />
                  );
                }
                const color = getColorForCount(cell.count);
                return (
                  <TouchableOpacity
                    key={di}
                    activeOpacity={0.8}
                    onPress={() => onDayPress(cell.iso, cell.count)}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      borderRadius: 2,
                      backgroundColor: color,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: cellSpacing,
                    }}
                  >
                    {cell.count > 0 ? (
                      <Text style={styles.cellText}>{cell.count}</Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <Text style={styles.legendLabel}>Less</Text>
        <View style={styles.legendSwatches}>
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
            const [r1, g1, b1] = hexToRgb(startColor);
            const [r2, g2, b2] = hexToRgb(endColor);
            const color =
              t === 0
                ? emptyColor
                : rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
            return (
              <View
                key={i}
                style={{
                  width: 16,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: color,
                  marginLeft: 4,
                }}
              />
            );
          })}
        </View>
        <Text style={styles.legendLabel}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  title: { fontSize: 14, fontWeight: "700", color: "#222" },
  grid: { flexDirection: "row", alignItems: "flex-start" },
  weekdayLabel: { fontSize: 8, color: "#666", width: 12, textAlign: "center" },
  cellText: { fontSize: 6, color: "#fff", fontWeight: "700" },
  legendRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  legendLabel: { fontSize: 10, color: "#666" },
  legendSwatches: {
    flexDirection: "row",
    marginHorizontal: 6,
    alignItems: "center",
  },
});
