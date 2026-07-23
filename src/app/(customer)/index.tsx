import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Wrench,
  MapPin,
  Phone,
  FolderOpen,
  Plug,
  ShieldCheck,
} from 'lucide-react-native';
import { SOCArcGauge } from '@/components/vehicle/SOCArcGauge';
import { MetricTile } from '@/components/ui/MetricTile';
import { FaultBanner } from '@/components/vehicle/FaultBanner';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ListRow } from '@/components/ui/ListRow';
import { SectionTitle } from '@/components/layout/SectionTitle';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { StatusDot } from '@/components/ui/StatusDot';
import { useVehicleStore, useActiveSignals, useActiveVehicle } from '@/store/vehicleStore';
import { useAlertStore } from '@/store/alertStore';
import { useAuthStore } from '@/store/authStore';
import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';
import { sendRemoteCommand, getFindVehiclePingCount, incrementFindVehiclePing, getLastTripSummary } from '@/services/mockApi';
import { formatTripDuration } from '@/services/mockTrips';
import { useTranslation } from '@/hooks/useTranslation';
import { StepUpOtpInputs, StepUpOtpDescription } from '@/components/auth/StepUpOtp';
import { CommandStatusCard } from '@/components/vehicle/CommandStatusCard';
import { Button } from '@/components/ui/Button';
import { MOCK_OTP } from '@/constants/auth';
import type { CommandResult } from '@/types/vehicle';

export default function CustomerDashboard() {
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const vehicle = useActiveVehicle();
  const signals = useActiveSignals();
  const { loading, error, fetchStatus, vehicles, activeVin, setActiveVin } = useVehicleStore();
  const { alerts, fetchAlerts } = useAlertStore();
  const user = useAuthStore((s) => s.user);

  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [vehicleSheet, setVehicleSheet] = useState(false);
  const [stepUpVisible, setStepUpVisible] = useState(false);
  const [stepUpOtp, setStepUpOtp] = useState(['', '', '', '']);
  const [commandResult, setCommandResult] = useState<CommandResult | null>(null);
  const [commandLoading, setCommandLoading] = useState(false);
  const { t } = useTranslation();
  const [lastTrip, setLastTrip] = useState<Awaited<ReturnType<typeof getLastTripSummary>> | null>(null);
  const [pendingAction, setPendingAction] = useState<'find' | null>(null);

  useEffect(() => {
    fetchStatus();
    if (user) fetchAlerts(user.phone, 'CUSTOMER');
    getLastTripSummary(activeVin).then(setLastTrip);
  }, [fetchStatus, fetchAlerts, user, activeVin]);

  const activeAlerts = alerts
    .filter((a) => !dismissedAlerts.includes(a.id) && a.severity !== 'info')
    .slice(0, 2);

  const isCharging = signals.chargingState === 'CHARGING';
  const isOnline = vehicle.tcuStatus === 'ONLINE';
  const hasFault =
    signals.batteryFault ||
    signals.mcuTempCutoff ||
    signals.motorTempWarning ||
    signals.vcuLowSOC;

  const handleFindVehicle = () => {
    const { used, limit } = getFindVehiclePingCount();
    if (used >= limit) {
      Alert.alert('Rate limit', `You've used ${used} of ${limit} Find My Vehicle pings today.`);
      return;
    }
    setPendingAction('find');
    setStepUpVisible(true);
  };

  const handleStepUpConfirm = async () => {
    if (stepUpOtp.join('') !== MOCK_OTP) {
      Alert.alert('Invalid OTP', 'Please enter the correct OTP.');
      return;
    }
    setStepUpVisible(false);
    setStepUpOtp(['', '', '', '']);

    if (pendingAction === 'find') {
      setCommandLoading(true);
      try {
        const result = await sendRemoteCommand('FIND_VEHICLE', activeVin, 'mock-token');
        setCommandResult(result);
        incrementFindVehiclePing();
      } catch {
        Alert.alert('Error', 'Failed to send command.');
      }
      setCommandLoading(false);
    }
    setPendingAction(null);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorState message={error} onRetry={fetchStatus} />
      </View>
    );
  }

  const statusLabel = hasFault
    ? t('faultDetected')
    : signals.ignitionState === 'ON'
      ? t('ignitionOn')
      : t('readyToDrive');

  const tripDescription = lastTrip
    ? `${lastTrip.date} · ${lastTrip.distance} km · ₹${lastTrip.costEstimate.toFixed(2)}`
    : '—';
  const tripDuration = lastTrip ? formatTripDuration(lastTrip.startTime, lastTrip.endTime) : '—';

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t('dashboard')}
        subtitle={vehicle.regNumber}
        right={
          <TouchableOpacity
            style={styles.statusChip}
            onPress={() => vehicles.length > 1 && setVehicleSheet(true)}
          >
            <StatusDot status={isOnline ? 'online' : 'offline'} pulse={isOnline} />
            <Text style={styles.statusChipText}>{isOnline ? t('live') : t('updatedAgo')}</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => vehicles.length > 1 && setVehicleSheet(true)}
        >
          <Text style={styles.vehicleName}>{vehicle.model}</Text>
          <Text style={styles.vehicleMeta}>{vehicle.dealerName}</Text>
        </TouchableOpacity>

        {loading ? (
          <SkeletonCard />
        ) : (
          <SOCArcGauge
            soc={signals.soc}
            range={signals.estimatedRange}
            isCharging={isCharging}
          />
        )}

        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.metrics}
          contentContainerStyle={styles.metricsContent}
        >
          <MetricTile
            label={t('packTemp')}
            value={`${signals.packTempMean.toFixed(0)}°`}
            status={signals.packTempMean > 40 ? 'warning' : 'normal'}
          />
          <MetricTile
            label={t('odometer')}
            value={signals.odometer.toLocaleString()}
            unit="km"
          />
          <MetricTile
            label={t('efficiency')}
            value={signals.whPerKm.toFixed(1)}
            unit="Wh/km"
          />
          <MetricTile
            label={t('auxBattery')}
            value={`${signals.aux12vVoltage}`}
            unit="V"
            subLabel={t('healthy')}
          />
        </ScrollView>

        <View style={styles.statusPair}>
          <Card style={styles.statusItem} padded>
            <Plug size={16} color={isCharging ? theme.colors.teal : theme.colors.text3} strokeWidth={1.75} />
            <View style={styles.statusTextCol}>
              <Text style={styles.statusLabel}>{t('charging')}</Text>
              <Text style={styles.statusValue}>
                {isCharging
                  ? `${signals.soc}% · ${Math.floor((signals.timeToFullMinutes ?? 0) / 60)}h ${(signals.timeToFullMinutes ?? 0) % 60}m`
                  : t('notCharging')}
              </Text>
            </View>
          </Card>
          <Card style={styles.statusItem} padded>
            <ShieldCheck
              size={16}
              color={hasFault ? theme.colors.red : theme.colors.green}
              strokeWidth={1.75}
            />
            <View style={styles.statusTextCol}>
              <Text style={styles.statusLabel}>{t('vehicle')}</Text>
              <Text style={[styles.statusValue, hasFault && { color: theme.colors.red }]}>
                {statusLabel}
              </Text>
            </View>
          </Card>
        </View>

        <Card variant="subtle" style={styles.tripCard}>
          <ListRow
            label={t('lastTrip')}
            description={tripDescription}
            rightText={tripDuration}
            onPress={() => router.push('/(customer)/vehicle/trips')}
          />
        </Card>

        {activeAlerts.map((a) => (
          <FaultBanner
            key={a.id}
            severity={a.severity === 'critical' ? 'critical' : 'warning'}
            message={a.description}
            onDismiss={() => setDismissedAlerts((prev) => [...prev, a.id])}
          />
        ))}

        {commandResult && (
          <CommandStatusCard
            commandName="Find My Vehicle"
            result={commandResult}
            loading={commandLoading}
          />
        )}

        <SectionTitle>{t('quickActions')}</SectionTitle>
        <Card style={styles.actionsCard} padded={false}>
          <ListRow
            icon={Wrench}
            label={t('bookService')}
            onPress={() => router.push('/(customer)/service')}
          />
          <ListRow icon={MapPin} label={t('findVehicle')} onPress={handleFindVehicle} />
          <ListRow icon={Phone} label={t('roadsideHelp')} onPress={() => router.push('/(customer)/support')} />
          <ListRow
            icon={FolderOpen}
            label={t('documents')}
            onPress={() => router.push('/(customer)/documents')}
            style={styles.lastRow}
          />
        </Card>
      </ScrollView>

      <BottomSheet visible={vehicleSheet} onClose={() => setVehicleSheet(false)} title={t('switchVehicle')}>
        {vehicles.map((v) => (
          <TouchableOpacity
            key={v.vin}
            style={[styles.vehicleOption, v.vin === activeVin && styles.vehicleOptionActive]}
            onPress={() => {
              setActiveVin(v.vin);
              setVehicleSheet(false);
            }}
          >
            <Text style={styles.vehicleOptionName}>{v.model}</Text>
            <Text style={styles.vehicleOptionReg}>{v.regNumber}</Text>
            {v.vin === activeVin && <Badge label={t('active')} variant="teal" />}
          </TouchableOpacity>
        ))}
      </BottomSheet>

      <BottomSheet visible={stepUpVisible} onClose={() => setStepUpVisible(false)} title={t('verifyIdentity')}>
        <StepUpOtpDescription />
        <StepUpOtpInputs
          otp={stepUpOtp}
          onOtpChange={(i, v) => {
            const next = [...stepUpOtp];
            next[i] = v;
            setStepUpOtp(next);
          }}
        />
        <Button title="Confirm" onPress={handleStepUpConfirm} />
        <Button title="Cancel" onPress={() => setStepUpVisible(false)} variant="ghost" style={{ marginTop: 4 }} />
      </BottomSheet>
    </View>
  );
}

const getStyles = (theme: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.surface2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  statusChipText: {
    ...typography.micro,
    color: theme.colors.text2,
  },
  vehicleName: {
    ...typography.title,
    color: theme.colors.text1,
    marginBottom: 2,
  },
  vehicleMeta: {
    ...typography.caption,
    fontSize: 13,
    color: theme.colors.text2,
    marginBottom: spacing.sm,
  },
  metrics: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  metricsContent: {
    gap: 12,
    paddingRight: 20,
  },
  statusPair: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  statusItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  statusTextCol: { flex: 1 },
  statusLabel: {
    ...typography.micro,
    color: theme.colors.text2,
    marginBottom: 2,
  },
  statusValue: {
    ...typography.caption,
    fontSize: 13,
    color: theme.colors.text1,
  },
  tripCard: {
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  actionsCard: {
    overflow: 'hidden',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  vehicleOption: {
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginBottom: spacing.sm,
    backgroundColor: theme.colors.surface2,
  },
  vehicleOptionActive: { borderColor: theme.colors.teal },
  vehicleOptionName: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text1,
  },
  vehicleOptionReg: {
    ...typography.micro,
    color: theme.colors.text2,
    marginTop: 2,
    marginBottom: 6,
  },
});
