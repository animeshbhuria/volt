import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Download, CheckCircle, Clock } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { getOtaUpdates } from '@/services/mockApi';
import type { OtaUpdate } from '@/services/mockTrips';
import { useTranslation } from '@/hooks/useTranslation';
import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

const statusVariant = (status: OtaUpdate['status']) => {
  if (status === 'Installed') return 'green' as const;
  if (status === 'Available') return 'teal' as const;
  return 'amber' as const;
};

export default function OtaScreen() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const { t } = useTranslation();
  const [updates, setUpdates] = useState<OtaUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOtaUpdates('').then((data) => {
      setUpdates(data);
      setLoading(false);
    });
  }, []);

  const handleInstall = (update: OtaUpdate) => {
    Alert.alert(
      'OTA Update',
      `Install ${update.version}? Vehicle must be parked and charging. This is view-only in the demo — no execution.`,
      [{ text: 'OK' }],
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t('softwareUpdates')}
        fallbackPath="/(customer)/vehicle"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.note}>
          OTA updates are view-only per SOR. Installation requires vehicle parked + consent.
        </Text>

        {loading ? (
          <SkeletonCard />
        ) : (
          updates.map((update) => (
            <Card key={update.id} style={styles.card}>
              <View style={styles.header}>
                <Download size={20} color={theme.colors.teal} />
                <Text style={styles.version}>{update.version}</Text>
                <Badge label={update.status} variant={statusVariant(update.status)} />
              </View>
              <Text style={styles.date}>Released {update.releaseDate} · {update.sizeMb} MB</Text>
              <Text style={styles.desc}>{update.description}</Text>
              {update.status === 'Available' && (
                <Button
                  title="Schedule Install"
                  size="sm"
                  variant="outline"
                  onPress={() => handleInstall(update)}
                  style={{ marginTop: spacing.sm }}
                />
              )}
              {update.status === 'Installed' && (
                <View style={styles.installedRow}>
                  <CheckCircle size={14} color={theme.colors.green} />
                  <Text style={styles.installedText}>Installed on this vehicle</Text>
                </View>
              )}
              {update.status === 'Downloading' && (
                <View style={styles.installedRow}>
                  <Clock size={14} color={theme.colors.amber} />
                  <Text style={styles.installedText}>Download in progress...</Text>
                </View>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  note: {
    ...typography.caption,
    color: theme.colors.text2,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  card: { marginBottom: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 4 },
  version: { ...typography.body, fontWeight: '600', color: theme.colors.text1, flex: 1 },
  date: { ...typography.micro, color: theme.colors.text3, marginBottom: spacing.sm },
  desc: { ...typography.caption, color: theme.colors.text2, lineHeight: 18 },
  installedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
  installedText: { ...typography.micro, color: theme.colors.green },
});
