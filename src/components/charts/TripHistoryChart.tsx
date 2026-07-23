import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

interface TripHistoryChartProps {
  data: { date: string; value: number }[];
  unit?: string;
}

export function TripHistoryChart({ data, unit = 'km' }: TripHistoryChartProps) {
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const chartData = data.slice(-7).map((d) => ({
    value: d.value,
    label: d.date,
    frontColor: theme.colors.teal,
  }));

  return (
    <View style={styles.container}>
      <BarChart
        data={chartData}
        height={140}
        barWidth={22}
        spacing={18}
        roundedTop
        roundedBottom
        hideRules
        xAxisColor={theme.colors.border}
        yAxisColor={theme.colors.border}
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisText}
        noOfSections={4}
        isAnimated
      />
      <View style={styles.unitLabel}>
        <View style={styles.legendDot} />
      </View>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { marginVertical: 8 },
  axisText: { color: theme.colors.text2, fontSize: 10 },
  unitLabel: { display: 'none' },
  legendDot: { width: 0, height: 0 },
});
