import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/providers/ThemeProvider';

interface SafeScrollViewProps {
  children: React.ReactNode;
  contentContainerStyle?: object;
}

export function SafeScrollView({ children, contentContainerStyle }: SafeScrollViewProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[
        {
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: insets.bottom + 40,
          minHeight: '100%',
        },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    gap: 20,
  },
});
