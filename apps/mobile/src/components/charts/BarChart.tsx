import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';

interface BarData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
  maxVal?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 200, maxVal }) => {
  const maximum = maxVal || Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.chartArea}>
        {data.map((item, index) => {
          const barHeight = (item.value / maximum) * 100;
          
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barBackground}>
                <View 
                  style={[
                    styles.barFill, 
                    { height: `${barHeight}%`, backgroundColor: item.color }
                  ]} 
                />
              </View>
              <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: spacing.sm,
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  barContainer: {
    alignItems: 'center',
    width: 40,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barBackground: {
    width: 24,
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  barFill: {
    width: '100%',
    borderRadius: borderRadius.sm,
  },
  label: {
    fontFamily: typography.body,
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
