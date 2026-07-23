import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

type MetricStatus = 'normal' | 'warning' | 'critical' | 'offline';

interface MetricTileProps {
  label: string;
  value: string;
  unit?: string;
  status?: MetricStatus;
  subLabel?: string;
}

export function MetricTile({ label, value, unit, status = 'normal', subLabel }: MetricTileProps) {
  const { theme } = useTheme();

  const statusColors: Record<MetricStatus, string> = {
    normal: theme.colors.text1,
    warning: theme.colors.amber,
    critical: theme.colors.red,
    offline: theme.colors.text3,
  };

  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text style={[styles.label, { color: theme.colors.text2 }]}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: statusColors[status] }]}>{value}</Text>
        {unit ? <Text style={[styles.unit, { color: theme.colors.text3 }]}>{unit}</Text> : null}
      </View>
      {subLabel ? <Text style={[styles.subLabel, { color: theme.colors.green }]}>{subLabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 140,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.micro,
    marginBottom: spacing.xs,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 18,
    ...typography.monoBold,
  },
  unit: {
    ...typography.micro,
  },
  subLabel: {
    ...typography.micro,
    marginTop: spacing.xs,
  },
});
