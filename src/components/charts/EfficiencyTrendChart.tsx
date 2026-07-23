import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

interface EfficiencyTrendChartProps {
  data: { date: string; value: number }[];
}

export function EfficiencyTrendChart({ data }: EfficiencyTrendChartProps) {
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const chartData = data.map((d) => ({
    value: d.value,
    label: d.date,
    dataPointText: d.value.toFixed(1),
  }));

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        height={160}
        color={theme.colors.teal}
        thickness={2}
        areaChart
        startFillColor={theme.colors.teal}
        endFillColor={theme.colors.tealDim || theme.colors.tealMuted || 'rgba(0, 91, 255, 0.2)'}
        startOpacity={0.3}
        endOpacity={0.05}
        hideRules
        yAxisColor={theme.colors.border}
        xAxisColor={theme.colors.border}
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisText}
        noOfSections={4}
        spacing={data.length > 14 ? 28 : 40}
        initialSpacing={10}
        endSpacing={10}
        yAxisTextNumberOfLines={1}
      />
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingLeft: -8,
  },
  axisText: {
    color: theme.colors.text2,
    fontSize: 10,
  },
});
