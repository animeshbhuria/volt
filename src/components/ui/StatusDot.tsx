import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/providers/ThemeProvider';

interface StatusDotProps {
  status: 'online' | 'offline' | 'charging' | 'fault';
  pulse?: boolean;
}

export function StatusDot({ status, pulse = false }: StatusDotProps) {
  const { theme } = useTheme();
  const opacity = useSharedValue(1);

  const dotColors = {
    online: theme.colors.teal,
    offline: theme.colors.text3,
    charging: theme.colors.teal,
    fault: theme.colors.red,
  };

  useEffect(() => {
    if (pulse && status === 'online') {
      opacity.value = withRepeat(withTiming(0.4, { duration: 1000 }), -1, true);
    }
  }, [pulse, status, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse ? opacity.value : 1,
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: dotColors[status] },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
