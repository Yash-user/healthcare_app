// components/ActivityHeatmap/ActivityHeatmap.jsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  startOfDay,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  differenceInDays,
  format,
  isWithinInterval,
} from "date-fns";
import { getMonthRanges, getColor } from "./utils";
import { Tooltip } from "./Tooltip";

const CELL_SIZE = 16;
const CELL_MARGIN = 4;
const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

// fallback colors if utils cellColors not used
const CELL_COLORS = {
  level0: "#e0e0e0",
  level1: "#c6e48b",
  level2: "#7bc96f",
  level3: "#239a3b",
  level4: "#196127",
};

const ActivityHeatmap = ({ activities = [], monthsBack = 12 }) => {
  const today = startOfDay(new Date());
  const oneYearAgo = addDays(today, -365); // default last 12 months

  // Build month ranges (using existing util)
  const monthRanges = useMemo(
    () => getMonthRanges(oneYearAgo, today).slice(-monthsBack),
    [oneYearAgo, today, monthsBack]
  );

  // Map activities by YYYY-MM-DD
  const activityMap = useMemo(() => {
    const m = {};
    activities.forEach((a) => {
      try {
        const d = startOfDay(new Date(a.date));
        const key = format(d, "yyyy-MM-dd");
        m[key] = a;
      } catch (e) {
        // ignore bad dates
      }
    });
    return m;
  }, [activities]);

  // helper to compute number of week-columns a month occupies
  function weeksForMonth(monthStart, monthEnd) {
    const startWeek = startOfWeek(startOfMonth(monthStart), { weekStartsOn: 0 });
    const endWeek = endOfWeek(endOfMonth(monthEnd), { weekStartsOn: 0 });
    const days = differenceInDays(endWeek, startWeek) + 1;
    return Math.ceil(days / 7);
  }

  // start-of-week base date for a month block
  function monthGridStart(monthStart) {
    return startOfWeek(startOfMonth(monthStart), { weekStartsOn: 0 });
  }

  // cell renderer for a given date
  // cell renderer for a given date
function renderCellForDate(d, keyIndex) {
  const key = format(d, "yyyy-MM-dd");
  const activity = activityMap[key];
  const level = activity ? activity.level ?? 0 : 0;

  // pick correct color (level0 gray if no activity)
  const color =
    getColor?.(level, CELL_COLORS) ?? CELL_COLORS[`level${level}`] ?? CELL_COLORS.level0;

  const displayDate = d.toLocaleDateString();

  return (
    <Tooltip
      key={keyIndex}
      content={`${displayDate}\n${activity ? `Count: ${activity.count ?? 0}` : "No activity"}`}
    >
      <TouchableOpacity activeOpacity={0.9} style={styles.cellTouchable}>
        <View
          style={[
            styles.cell,
            { backgroundColor: color },
          ]}
        />
      </TouchableOpacity>
    </Tooltip>
  );
}


  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Static weekday column on left */}
        <View style={styles.weekdayColumn}>
          <View style={{ height: 18 }} /> {/* spacer to align with month labels */}
          {WEEK_DAYS.map((d, i) => (
            <Text key={i} style={[styles.weekDayLabel, { height: CELL_SIZE + CELL_MARGIN }]}>
              {d}
            </Text>
          ))}
        </View>

        {/* Scrollable months (only this scrolls horizontally) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthsScroll}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            {monthRanges.map((month, mi) => {
              const mStart = startOfMonth(month.start);
              const mEnd = endOfMonth(month.end);
              const weeks = weeksForMonth(mStart, mEnd);
              const gridStart = monthGridStart(mStart);

              return (
                <View key={mi} style={styles.monthBlock}>
                  <Text style={styles.monthLabel}>{month.name}</Text>

                  {/* month grid: columns = weeks, rows = 7 days */}
                  <View style={{ flexDirection: "row" }}>
                    {Array.from({ length: weeks }).map((_, wi) => (
                      <View key={wi} style={{ marginRight: CELL_MARGIN }}>
                        {Array.from({ length: 7 }).map((__, di) => {
                          const day = addDays(gridStart, wi * 7 + di);
                          // show only days that belong to this month
                          const inThisMonth = isWithinInterval(day, { start: mStart, end: mEnd });
                          if (!inThisMonth) {
                            // render transparent/invisible cell so layout stays consistent
                            return <View key={di} style={[styles.cell, { backgroundColor: "transparent" }]} />;
                          }
                          return renderCellForDate(day, `${mi}-${wi}-${di}`);
                        })}
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Legend (unchanged) */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>None</Text>
        {[1, 2, 3, 4].map((lvl) => (
          <View key={lvl} style={[styles.legendCell, { backgroundColor: CELL_COLORS[`level${lvl}`] }]} />
        ))}
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
};

export default ActivityHeatmap;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  weekdayColumn: {
    width: 28,
    marginRight: 6,
    alignItems: "center",
  },
  weekDayLabel: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    width: 28,
  },
  monthsScroll: {
    paddingRight: 12,
  },
  monthBlock: {
    marginRight: 16,
    alignItems: "center",
  },
  monthLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  cellTouchable: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    marginBottom: CELL_MARGIN,
    borderRadius: 4,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 4,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
    marginHorizontal: 6,
  },
  legendCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 3,
    marginHorizontal: 2,
  },
});
