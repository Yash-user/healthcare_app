// components/ActivityHeatmap/utils.js

export function getMonthRanges(startDate, endDate) {
  if (startDate > endDate) {
    throw new Error("startDate must be before endDate");
  }

  const result = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const year = current.getFullYear();
    const month = current.getMonth();
    const monthName = current.toLocaleString("default", { month: "long" });

    const rangeStart =
      result.length === 0 ? new Date(startDate) : new Date(year, month, 1);

    const isLastMonth =
      year === endDate.getFullYear() && month === endDate.getMonth();
    const rangeEnd = isLastMonth
      ? new Date(endDate)
      : new Date(year, month + 1, 0);

    result.push({
      name: monthName,
      start: rangeStart,
      end: rangeEnd,
    });

    current.setFullYear(year, month + 1, 1);
  }

  return result;
}

export function getHeatmapMonthCells(activities, startDate, endDate) {
  if (
    startDate.getFullYear() !== endDate.getFullYear() ||
    startDate.getMonth() !== endDate.getMonth()
  ) {
    throw new Error("startDate and endDate must be in the same month");
  }

  if (startDate > endDate) {
    throw new Error("startDate must be before endDate");
  }

  const result = [];
  const activityMap = {};
  activities.forEach((a) => (activityMap[a.date] = a));

  function addInvisibleCells(count) {
    for (let i = 0; i < count; i++) {
      result.push("invisible");
    }
  }

  function formatKey(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function formatDisplay(date) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const current = new Date(startDate);
  addInvisibleCells(current.getDay());

  while (current <= endDate) {
    const key = formatKey(current);
    const displayDate = formatDisplay(current);

    if (key in activityMap) {
      result.push({
        ...activityMap[key],
        date: displayDate,
      });
    } else {
      result.push({
        date: displayDate,
        count: 0,
        level: 0,
      });
    }

    current.setDate(current.getDate() + 1);
  }

  if (current.getDay() !== 0) {
    addInvisibleCells(7 - current.getDay());
  }

  return result;
}

export const getColor = (level, cellColors) => {
  switch (level) {
    case 0:
      return cellColors.level0;
    case 1:
      return cellColors.level1;
    case 2:
      return cellColors.level2;
    case 3:
      return cellColors.level3;
    case 4:
      return cellColors.level4;
    default:
      return "transparent";
  }
};
