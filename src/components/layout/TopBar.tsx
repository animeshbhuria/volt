import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/providers/ThemeProvider';

interface TopBarProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

export function TopBar({ title, subtitle, rightElement }: TopBarProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  })();

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentRow}>
        <View style={styles.left}>
          <Text style={[styles.greeting, { color: theme.colors.primary }]}>{greeting}</Text>
          <Text style={[styles.title, { color: theme.colors.text1 }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: theme.colors.text2 }]}>{subtitle}</Text> : null}
        </View>
        {rightElement}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  logo: {
    width: 120,
    height: 50,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '600',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 6,
  },
});
