import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { radius, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

type BadgeVariant = 'teal' | 'amber' | 'red' | 'grey' | 'green';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export function Badge({ label, variant = 'grey' }: BadgeProps) {
  const { theme } = useTheme();

  const getBadgeColors = (): { bg: string; text: string } => {
    switch (variant) {
      case 'teal':
        return { bg: theme.colors.tealMuted, text: theme.colors.teal };
      case 'amber':
        return { bg: 'rgba(217, 119, 6, 0.15)', text: theme.colors.amber };
      case 'red':
        return { bg: 'rgba(220, 38, 38, 0.15)', text: theme.colors.red };
      case 'green':
        return { bg: 'rgba(22, 163, 74, 0.15)', text: theme.colors.green };
      case 'grey':
      default:
        return { bg: theme.colors.surface2, text: theme.colors.text2 };
    }
  };

  const s = getBadgeColors();

  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.text, { color: s.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  text: {
    ...typography.micro,
    fontWeight: '500',
  },
});
