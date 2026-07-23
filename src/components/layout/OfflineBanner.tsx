import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetwork } from '@/providers/NetworkProvider';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/providers/ThemeProvider';

export function OfflineBanner() {
  const { isOffline } = useNetwork();
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (!isOffline) return null;

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.colors.amber + '20',
          borderBottomColor: theme.colors.amber,
        },
      ]}
      accessibilityLabel="Offline banner"
    >
      <Text style={[styles.text, { color: theme.colors.amber }]}>{t('offlineBanner')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
});
