import React, { useEffect } from 'react';
import { View, StyleSheet, Animated as RNAnimated } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: object;
}

export function Skeleton({ width = '100%', height = 16, style }: SkeletonProps) {
  const opacity = new RNAnimated.Value(0.3);
  const { theme } = useTheme();

  useEffect(() => {
    const anim = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(opacity, { toValue: 0.7, duration: 600, useNativeDriver: true }),
        RNAnimated.timing(opacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <RNAnimated.View
      style={[
        styles.skeleton,
        { width, height, opacity, backgroundColor: theme.colors.surface2 },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Skeleton width="60%" height={12} />
      <Skeleton width="40%" height={24} style={{ marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 4,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
});
