import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  withRepeat,
} from 'react-native-reanimated';
import { typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface SOCArcGaugeProps {
  soc: number;
  range?: number;
  isCharging?: boolean;
  size?: number;
}

const START_ANGLE = 200;
const SWEEP = 220;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  'worklet';
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  'worklet';
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function SOCArcGauge({ soc, range, isCharging = false, size = 240 }: SOCArcGaugeProps) {
  const { theme } = useTheme();
  const progress = useSharedValue(0);
  const pulse = useSharedValue(1);
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 28;
  const strokeWidth = 10;

  function getSocColor(socVal: number): string {
    if (socVal > 30) return theme.colors.teal;
    if (socVal >= 15) return theme.colors.amber;
    return theme.colors.red;
  }

  useEffect(() => {
    progress.value = withTiming(soc / 100, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [soc, progress]);

  useEffect(() => {
    if (isCharging) {
      pulse.value = withRepeat(withTiming(0.75, { duration: 900 }), -1, true);
    } else {
      pulse.value = 1;
    }
  }, [isCharging, pulse]);

  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const endAngle = START_ANGLE + SWEEP * progress.value;
    return {
      d: describeArc(cx, cy, radius, START_ANGLE, endAngle),
    };
  });

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  const bgPath = describeArc(cx, cy, radius, START_ANGLE, START_ANGLE + SWEEP);
  const socColor = getSocColor(soc);

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const angle = START_ANGLE + (SWEEP / 10) * i;
    const inner = polarToCartesian(cx, cy, radius - strokeWidth / 2 - 3, angle);
    const outer = polarToCartesian(cx, cy, radius + strokeWidth / 2 + 3, angle);
    return { inner, outer };
  });

  const scale = size / 240;
  const showTicks = size >= 160;

  const dynamicStyles = {
    centerContent: {
      position: 'absolute' as const,
      top: size * 0.28,
      left: 0,
      right: 0,
      alignItems: 'center' as const,
    },
    socValue: {
      fontSize: Math.max(22, Math.round(44 * scale)),
      color: theme.colors.text1,
      fontFamily: 'JetBrainsMono_700Bold',
      letterSpacing: -1,
    },
    socLabel: {
      fontSize: Math.max(8, Math.round(11 * scale)),
      color: theme.colors.text2,
      marginTop: Math.max(1, Math.round(2 * scale)),
    },
    rangeValue: {
      fontSize: Math.max(11, Math.round(15 * scale)),
      fontWeight: '600' as const,
      color: theme.colors.text1,
      marginTop: Math.max(4, Math.round(10 * scale)),
    },
    rangeUnit: {
      fontWeight: '400' as const,
      color: theme.colors.text2,
      fontSize: Math.max(9, Math.round(13 * scale)),
    },
    chargingLabel: {
      fontSize: Math.max(8, Math.round(11 * scale)),
      color: theme.colors.teal,
      marginTop: Math.max(2, Math.round(6 * scale)),
    },
  };

  return (
    <Animated.View style={[styles.container, pulseStyle, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Path
          d={bgPath}
          stroke={theme.colors.surface2}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        <AnimatedPath
          animatedProps={animatedProps}
          stroke={socColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {showTicks && ticks.map((t, i) => (
          <Line
            key={i}
            x1={t.inner.x}
            y1={t.inner.y}
            x2={t.outer.x}
            y2={t.outer.y}
            stroke={theme.colors.border}
            strokeWidth={1}
          />
        ))}
      </Svg>
      <View style={dynamicStyles.centerContent}>
        <Text style={dynamicStyles.socValue}>{Math.round(soc)}%</Text>
        <Text style={dynamicStyles.socLabel}>State of charge</Text>
        {range !== undefined && (
          <Text style={dynamicStyles.rangeValue}>
            {range} <Text style={dynamicStyles.rangeUnit}>km range</Text>
          </Text>
        )}
        {isCharging ? <Text style={dynamicStyles.chargingLabel}>Charging</Text> : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'relative',
    marginVertical: 8,
  },
});
