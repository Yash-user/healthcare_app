// ActivityHeatmapMonth.jsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Tooltip } from './Tooltip';
import { getColor } from './utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Responsive cell size calculation
const getCellSize = () => {
  if (SCREEN_WIDTH >= 1920) return 40;
  if (SCREEN_WIDTH >= 768) return 25;
  return 15;
};

export const ActivityHeatmapMonth = ({
  cells,
  columnSizeInCells,
  cellColors,
  renderTooltip,
}) => {
  const cellSize = getCellSize();
  const gap = 2; // Equivalent to 0.125rem to 0.3rem

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.grid,
          {
            width: columnSizeInCells * cellSize + (columnSizeInCells - 1) * gap,
          },
        ]}
      >
        {cells.map((cell, i) => {
          if (cell === 'invisible') {
            return <View key={i} style={styles.cellInvisible} />;
          }
          return (
            <Tooltip
              key={i}
              content={
                renderTooltip
                  ? renderTooltip(cell)
                  : `${cell.count} ${cell.count === 1 ? 'activity' : 'activities'} on ${cell.date}`
              }
            >
              <View
                style={[
                  styles.cell,
                  {
                    backgroundColor: getColor(cell.level, cellColors),
                    width: cellSize,
                    height: cellSize,
                  },
                ]}
              />
            </Tooltip>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 1,
    gap: 2,
    rowGap: 2,
    flexShrink: 0,
  },
  cell: {
    borderRadius: 2,
  },
  cellInvisible: {
    backgroundColor: 'transparent',
  },
});