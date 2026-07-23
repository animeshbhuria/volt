import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { radius, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const { theme } = useTheme();
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel ?? title}
      activeOpacity={0.7}
      style={[
        styles.button,
        size === 'sm' && styles.buttonSm,
        isPrimary && { backgroundColor: theme.colors.teal },
        variant === 'outline' && {
          backgroundColor: 'transparent',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.border,
        },
        isGhost && { backgroundColor: 'transparent' },
        isDanger && {
          backgroundColor: 'transparent',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.red,
        },
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : theme.colors.teal} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            size === 'sm' && styles.textSm,
            isPrimary && { color: '#FFFFFF' },
            (variant === 'outline' || isGhost) && { color: theme.colors.text1 },
            isDanger && { color: theme.colors.red },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonSm: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    minHeight: 36,
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
  },
  textSm: {
    fontSize: 13,
  },
});
