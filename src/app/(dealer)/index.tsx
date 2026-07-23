import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { MetricTile } from '@/components/ui/MetricTile';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusDot } from '@/components/ui/StatusDot';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { getDealerVehicles } from '@/services/mockApi';
import type { DealerVehicle } from '@/types/vehicle';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

export default function DealerDashboard() {
  const [vehicles, setVehicles] = useState<DealerVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDealerVehicles();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dealer fleet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const statusDot = (status: string) => {
    if (status === 'Online') return 'online';
    if (status === 'Fault') return 'fault';
    if (status === 'In Service') return 'charging';
    return 'offline';
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Dealer Dashboard" subtitle="Jaipur EV Motors" />
      <ScrollView contentContainerStyle={styles.content}>
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.metrics}
          contentContainerStyle={styles.metricsContent}
        >
          <MetricTile label="Vehicles" value="47" />
          <MetricTile label="Service Open" value="8" status="warning" />
          <MetricTile label="Today" value="3" unit="appts" />
          <MetricTile label="Warranty" value="2" unit="cases" />
        </ScrollView>

        <Text style={styles.section}>VEHICLE HEALTH</Text>
        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : loading ? (
          <SkeletonCard />
        ) : (
          vehicles.map((v) => (
            <Card key={v.vin} style={styles.vehicleRow}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vin}>{v.vin.slice(-8)}</Text>
                <Text style={styles.customer}>{v.customerName}</Text>
              </View>
              <Text style={styles.soc}>{v.soc}%</Text>
              <View style={styles.statusCol}>
                <StatusDot status={statusDot(v.status)} />
                <Text style={styles.lastSeen}>{v.lastSeen}</Text>
              </View>
            </Card>
          ))
        )}

        <Text style={styles.section}>OPEN JOB CARDS</Text>
        <Card>
          <Text style={styles.jobCustomer}>Ramesh Kumar · VOLT EV-1</Text>
          <Text style={styles.jobIssue}>Charging issue — slow home charge</Text>
          <Text style={styles.jobAdvisor}>Advisor: Priya Sharma</Text>
          <Badge label="In Progress" variant="amber" />
        </Card>

        <Text style={styles.section}>ALERTS</Text>
        <Card accentColor={theme.colors.amber}>
          <Text style={styles.alertText}>Service due — Suresh Meena (VOLT1EV005678)</Text>
        </Card>
        <Card accentColor={theme.colors.red}>
          <Text style={styles.alertText}>Breakdown reported — Tonk Road, Jaipur</Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingTop: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text1 },
  sub: { fontSize: 14, color: theme.colors.text2, marginBottom: 16 },
  metrics: { marginBottom: 16 },
  metricsContent: { gap: 12, paddingRight: 20 },
  section: {
    fontSize: 11,
    color: theme.colors.text2,
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 12,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 12,
  },
  vehicleInfo: { flex: 1 },
  vin: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: theme.colors.teal },
  customer: { fontSize: 14, color: theme.colors.text1 },
  soc: { fontFamily: 'JetBrainsMono_700Bold', fontSize: 16, color: theme.colors.text1, marginRight: 12 },
  statusCol: { alignItems: 'center', gap: 4 },
  lastSeen: { fontSize: 10, color: theme.colors.text3 },
  jobCustomer: { fontSize: 14, fontWeight: '600', color: theme.colors.text1 },
  jobIssue: { fontSize: 13, color: theme.colors.text2, marginTop: 4 },
  jobAdvisor: { fontSize: 12, color: theme.colors.text3, marginTop: 4, marginBottom: 8 },
  alertText: { fontSize: 13, color: theme.colors.text1 },
});
