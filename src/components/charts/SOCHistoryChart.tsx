import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

interface SOCHistoryChartProps {
  data: { date: string; value: number }[];
}

export function SOCHistoryChart({ data }: SOCHistoryChartProps) {
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const chartData = data.map((d) => ({
    value: d.value,
    label: d.date,
    dataPointText: `${d.value}%`,
  }));

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        height={150}
        color={theme.colors.teal}
        thickness={2}
        areaChart
        startFillColor={theme.colors.teal}
        endFillColor={theme.colors.tealDim || theme.colors.tealMuted || 'rgba(0, 91, 255, 0.2)'}
        startOpacity={0.25}
        endOpacity={0.02}
        hideRules
        maxValue={100}
        yAxisColor={theme.colors.border}
        xAxisColor={theme.colors.border}
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisText}
        noOfSections={4}
        spacing={data.length > 10 ? 24 : 36}
        initialSpacing={8}
        endSpacing={8}
      />
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { marginVertical: 8 },
  axisText: { color: theme.colors.text2, fontSize: 10 },
});
