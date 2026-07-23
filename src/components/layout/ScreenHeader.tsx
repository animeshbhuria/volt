import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, typography } from '@/constants/theme';
import { BackButton } from '../ui/BackButton';
import { useTheme } from '@/providers/ThemeProvider';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
  fallbackPath?: string;
  style?: ViewStyle;
}

export function ScreenHeader({ title, subtitle, right, onBack, fallbackPath, style }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + spacing.sm,
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.divider,
        },
        style,
      ]}
    >
      <View style={styles.headerContent}>
        {onBack || fallbackPath ? (
          <View style={styles.backRow}>
            <BackButton onPress={onBack} fallbackPath={fallbackPath} />
          </View>
        ) : null}
        <View style={styles.titleRow}>
          <View style={styles.textCol}>
            <Text style={[styles.title, { color: theme.colors.text1 }]}>{title}</Text>
            {subtitle ? <Text style={[styles.subtitle, { color: theme.colors.text2 }]}>{subtitle}</Text> : null}
          </View>
          {right}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerContent: {
    flexDirection: 'column',
    width: '100%',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  textCol: { flex: 1 },
  title: {
    ...typography.display,
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    ...typography.caption,
    marginTop: 3,
  },
});

