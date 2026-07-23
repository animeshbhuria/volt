import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

interface SectionTitleProps {
  children: string;
  style?: TextStyle;
}

export function SectionTitle({ children, style }: SectionTitleProps) {
  const { theme } = useTheme();
  return <Text style={[styles.title, { color: theme.colors.text2 }, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    ...typography.label,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
});
