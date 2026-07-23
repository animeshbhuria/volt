import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { radius, spacing } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  variant?: 'default' | 'subtle';
  accentColor?: string;
}

export function Card({ children, style, padded = true, variant = 'default', accentColor }: CardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: variant === 'subtle' ? theme.colors.surface2 : theme.colors.surface,
          borderColor: theme.colors.border,
        },
        padded && styles.padded,
        accentColor ? { borderLeftWidth: 3, borderLeftColor: accentColor } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  padded: {
    padding: spacing.md,
  },
});
