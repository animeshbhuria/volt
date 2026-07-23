import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { MetricTile } from '@/components/ui/MetricTile';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { getImmobilizationRequests, getAlerts } from '@/services/mockApi';
import type { ImmobilizationRequest } from '@/types/vehicle';
import type { Alert as AlertType } from '@/types/alerts';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

export default function OemDashboard() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');

  const [requests, setRequests] = useState<ImmobilizationRequest[]>([]);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reqData, alertData] = await Promise.all([
        getImmobilizationRequests(),
        getAlerts('oem-admin', 'VOLT'),
      ]);
      setRequests(reqData);
      setAlerts(alertData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fleet overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <ScreenHeader title="VOLT Fleet Overview" />
      <ScrollView contentContainerStyle={styles.content}>
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.metrics}
          contentContainerStyle={styles.metricsContent}
        >
          <MetricTile label="Total" value="312" unit="vehicles" />
          <MetricTile label="Online" value="247" status="normal" />
          <MetricTile label="Charging" value="38" />
          <MetricTile label="Faults" value={loading ? '...' : String(alerts.filter(a => a.severity === 'critical').length || 7)} status="critical" />
          <MetricTile label="Immobilized" value="4" status="warning" />
        </ScrollView>

        <Text style={styles.section}>DEALER BREAKDOWN</Text>
        <Card>
          <Text style={styles.dealerName}>Jaipur EV Motors</Text>
          <Text style={styles.dealerMeta}>47 vehicles · 5 faults · 2 service cases</Text>
        </Card>
        <Card style={{ marginTop: 8 }}>
          <Text style={styles.dealerName}>Pink City Auto</Text>
          <Text style={styles.dealerMeta}>32 vehicles · 1 fault · 0 service cases</Text>
        </Card>

        <Text style={styles.section}>LIVE CRITICAL ALERTS</Text>
        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : loading ? (
          <SkeletonCard />
        ) : alerts.length === 0 ? (
          <Card>
            <Text style={{ color: theme.colors.text2, fontSize: 13, textAlign: 'center', padding: 8 }}>No active alerts</Text>
          </Card>
        ) : (
          alerts.map((a, idx) => {
            const isCritical = a.severity === 'critical';
            return (
              <Card
                key={a.id || String(idx)}
                style={{ marginTop: idx > 0 ? 8 : 0 }}
                accentColor={isCritical ? theme.colors.red : theme.colors.amber}
              >
                <View style={styles.alertRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.alertVin}>{a.vin || 'VOLT1EV009912'}</Text>
                    <Text style={styles.alertType}>{a.description}</Text>
                    <Text style={styles.alertTime}>{a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : '30 min ago'}</Text>
                  </View>
                  {isCritical ? (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => router.push(`/(oem)/immobilization/review/${requests[0]?.id || 'IMR-2025-003'}`)}
                    >
                      <Text style={styles.actionText}>View</Text>
                    </TouchableOpacity>
                  ) : (
                    <Badge label="Warning" variant="amber" />
                  )}
                </View>
              </Card>
            );
          })
        )}

        <TouchableOpacity
          style={styles.reviewLink}
          onPress={() => router.push('/(oem)/immobilization/review/IMR-2025-003')}
        >
          <Text style={styles.reviewLinkText}>Review Immobilization Request IMR-2025-003 →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingTop: 16, paddingBottom: 32 },
  metrics: { marginBottom: 16 },
  metricsContent: { gap: 12, paddingRight: 20 },
  section: { fontSize: 11, color: theme.colors.text2, letterSpacing: 1, marginTop: 16, marginBottom: 12 },
  dealerName: { fontSize: 15, fontWeight: '600', color: theme.colors.text1 },
  dealerMeta: { fontSize: 13, color: theme.colors.text2, marginTop: 4 },
  alertRow: { flexDirection: 'row', alignItems: 'center' },
  alertVin: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: theme.colors.teal },
  alertType: { fontSize: 14, color: theme.colors.text1, marginTop: 4 },
  alertTime: { fontSize: 11, color: theme.colors.text3, marginTop: 4 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: theme.colors.teal, borderRadius: 6 },
  actionText: { color: theme.colors.teal, fontSize: 12 },
  reviewLink: { marginTop: 24, padding: 16, backgroundColor: theme.colors.tealMuted, borderRadius: 8 },
  reviewLinkText: { color: theme.colors.teal, fontSize: 14, fontWeight: '600' },
});
