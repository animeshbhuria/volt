import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { MetricTile } from '@/components/ui/MetricTile';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { getImmobilizationRequests } from '@/services/mockApi';
import type { ImmobilizationRequest } from '@/types/vehicle';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

export default function FinancierDashboard() {
  const [requests, setRequests] = useState<ImmobilizationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getImmobilizationRequests();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Portfolio Dashboard" subtitle="Rajasthan Finance Ltd" />
      <ScrollView contentContainerStyle={styles.content}>
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.metrics}
          contentContainerStyle={styles.metricsContent}
        >
          <MetricTile label="Financed" value="124" unit="vehicles" />
          <MetricTile label="Active" value="98" status="normal" />
          <MetricTile label="Inactive >7d" value="11" status="warning" />
          <MetricTile label="Default Risk" value="3" status="critical" />
        </ScrollView>

        <Text style={styles.section}>DEFAULT RISK VEHICLES</Text>
        <Card accentColor={theme.colors.red}>
          <Text style={styles.riskVin}>VOLT1EV007821</Text>
          <Text style={styles.riskCustomer}>Priya Sharma · Inactive 12 days</Text>
          <Badge label="Payment Default" variant="red" />
        </Card>
        <Card accentColor={theme.colors.amber}>
          <Text style={styles.riskVin}>VOLT1EV004455</Text>
          <Text style={styles.riskCustomer}>Deepak Verma · Low utilization</Text>
          <Badge label="Monitoring" variant="amber" />
        </Card>

        <Text style={styles.section}>IMMOBILIZATION REQUESTS</Text>
        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : loading ? (
          <SkeletonCard />
        ) : (
          requests.map((r) => (
            <Card key={r.id} style={{ marginBottom: 8 }}>
              <Text style={styles.reqId}>{r.id}</Text>
              <Text style={styles.reqVin}>{r.vin}</Text>
              <Text style={styles.reqReason}>{r.reason}</Text>
              <Badge label={r.status} variant={r.status === 'Under Review' ? 'amber' : 'teal'} />
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  content: { padding: 16, paddingTop: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text1 },
  sub: { fontSize: 14, color: theme.colors.text2, marginBottom: 16 },
  metrics: { marginBottom: 16 },
  metricsContent: { gap: 12, paddingRight: 20 },
  section: { fontSize: 11, color: theme.colors.text2, letterSpacing: 1, marginTop: 16, marginBottom: 12 },
  riskVin: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: theme.colors.teal },
  riskCustomer: { fontSize: 14, color: theme.colors.text1, marginTop: 4, marginBottom: 8 },
  reqId: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 11, color: theme.colors.text3 },
  reqVin: { fontSize: 14, fontWeight: '600', color: theme.colors.text1, marginTop: 4 },
  reqReason: { fontSize: 13, color: theme.colors.text2, marginTop: 4, marginBottom: 8 },
});
