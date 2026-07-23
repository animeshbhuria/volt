import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface NeumorphicSwitchProps {
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
}

export function NeumorphicSwitch({ value, onValueChange, disabled = false }: NeumorphicSwitchProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[
        styles.container,
        {
          borderColor: value ? theme.colors.teal : theme.colors.border,
          backgroundColor: value ? theme.colors.tealDim : theme.colors.surface2,
        },
        disabled && styles.disabled,
      ]}
    >
      <View
        style={[
          styles.thumb,
          value
            ? [styles.thumbActive, { backgroundColor: theme.colors.teal, shadowColor: theme.colors.teal }]
            : [styles.thumbInactive, { backgroundColor: theme.colors.text3, borderColor: theme.colors.border }],
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbActive: {
    alignSelf: 'flex-end',
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  thumbInactive: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.4,
  },
});
