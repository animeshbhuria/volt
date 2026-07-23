import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

interface SignalRowProps {
  name: string;
  value: string | number | null;
  unit?: string;
}

export function SignalRow({ name, value, unit }: SignalRowProps) {
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const displayValue = value === null || value === undefined ? '—' : String(value);

  return (
    <View style={styles.row}>
      <View style={styles.leftSection}>
        <View style={styles.indicator} />
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.valuePill}>
        <View style={styles.valueCol}>
          <Text style={styles.value}>{displayValue}</Text>
          {unit && displayValue !== '—' ? <Text style={styles.unit}>{unit}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
    marginRight: 10,
  },
  name: {
    fontSize: 13,
    color: theme.colors.text2,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  valuePill: {
    backgroundColor: theme.colors.surface2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  valueCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 16,
    color: theme.colors.text1,
  },
  unit: {
    fontSize: 11,
    color: theme.colors.text2,
    textTransform: 'uppercase',
  },
});
