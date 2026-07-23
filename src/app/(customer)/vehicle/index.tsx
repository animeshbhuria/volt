import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, Route, Zap, Download, ArrowRightLeft } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { SOCArcGauge } from '@/components/vehicle/SOCArcGauge';
import { SOCHistoryChart } from '@/components/charts/SOCHistoryChart';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useActiveSignals, useActiveVehicle, useVehicleStore } from '@/store/vehicleStore';
import { getSocHistoryData } from '@/services/mockApi';
import { useTranslation } from '@/hooks/useTranslation';
import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

export default function VehicleHubScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const vehicle = useActiveVehicle();
  const signals = useActiveSignals();
  const { activeVin, loading, fetchStatus } = useVehicleStore();
  const [socHistory, setSocHistory] = useState<{ date: string; value: number }[]>([]);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    fetchStatus();
    getSocHistoryData('7d').then(setSocHistory);
  }, [fetchStatus, activeVin]);

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('vehicleHub')} subtitle={vehicle.regNumber} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <SkeletonCard />
        ) : (
          <View style={styles.gaugeWrap}>
            <SOCArcGauge soc={signals.soc} range={signals.estimatedRange} size={200} />
          </View>
        )}

        <Text style={styles.section}>SOC TREND (7D)</Text>
        <Card padded={false} style={styles.chartCard}>
          <View style={styles.chartInner}>
            <SOCHistoryChart data={socHistory} />
          </View>
        </Card>

        <Text style={styles.section}>EXPLORE</Text>
        <Card padded={false}>
          <ListRow
            icon={Activity}
            label={t('liveStatus')}
            description={`SOC ${signals.soc}% · ${signals.estimatedRange} km`}
            onPress={() => router.push(`/(customer)/vehicle/${activeVin}`)}
          />
          <ListRow
            icon={Route}
            label={t('tripAnalytics')}
            description={`${signals.totalDistanceLast30Days.toLocaleString()} km last 30 days`}
            onPress={() => router.push('/(customer)/vehicle/trips')}
          />
          <ListRow
            icon={Zap}
            label={t('chargingStatus')}
            description={signals.chargingState === 'CHARGING' ? t('charging') : t('notCharging')}
            onPress={() => router.push('/(customer)/vehicle/charging')}
          />
          <ListRow
            icon={Download}
            label={t('softwareUpdates')}
            description="v2.5.0 available"
            onPress={() => router.push('/(customer)/vehicle/ota')}
          />
          <ListRow
            icon={ArrowRightLeft}
            label={t('ownershipTransfer')}
            onPress={() => router.push('/(customer)/transfer-ownership')}
            style={styles.lastRow}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  gaugeWrap: { alignItems: 'center', marginBottom: spacing.sm },
  section: {
    ...typography.micro,
    color: theme.colors.text2,
    letterSpacing: 1,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  chartCard: { overflow: 'hidden', marginBottom: spacing.sm },
  chartInner: { padding: spacing.sm },
  lastRow: { borderBottomWidth: 0 },
});
