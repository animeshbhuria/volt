import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { radius } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  children: React.ReactNode;
}

export function GlassCard({
  children,
  intensity = 40,
  style,
  ...props
}: GlassCardProps) {
  const { scheme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.02)',
          borderColor: scheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
        },
        style,
      ]}
      {...props}
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.05)',
          zIndex: 10,
        }}
      />
      <View style={styles.blur}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 20,
  },
  blur: {
    padding: 22,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
});

export default GlassCard;