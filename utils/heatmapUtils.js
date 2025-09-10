// app/utils/heatmapUtils.js
// Helper to convert reports (with dates) into heatmap activities array

/**
 * reports: Array<{ id, title, date: string }>
 * returns: Array<{ date: 'YYYY-MM-DD', count: number, level: number }>
 */
export function getHeatmapActivities(reports = []) {
  const counts = {};
  (reports || []).forEach((r) => {
    // normalize to YYYY-MM-DD (UTC)
    const iso = new Date(r.date).toISOString().slice(0, 10);
    counts[iso] = (counts[iso] || 0) + 1;
  });

  return Object.keys(counts)
    .sort()
    .map((date) => {
      const count = counts[date];
      let level = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 5) level = 2;
      else if (count > 5 && count <= 8) level = 3;
      else if (count > 8) level = 4;
      return { date, count, level };
    });
}
