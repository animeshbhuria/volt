import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

interface FaultBannerProps {
  severity: 'warning' | 'critical';
  message: string;
  onDismiss?: () => void;
}

export function FaultBanner({ severity, message, onDismiss }: FaultBannerProps) {
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const accent = severity === 'critical' ? theme.colors.red : theme.colors.amber;

  return (
    <View style={[styles.banner, { borderColor: accent + '40' }]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={styles.message}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} hitSlop={8} accessibilityLabel="Dismiss alert">
          <X size={14} color={theme.colors.text3} strokeWidth={1.75} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
  },
  message: {
    ...theme.typography.caption,
    fontSize: 13,
    color: theme.colors.text1,
    flex: 1,
    lineHeight: 18,
  },
});
