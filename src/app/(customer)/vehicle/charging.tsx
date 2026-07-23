import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Zap } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { SOCArcGauge } from '@/components/vehicle/SOCArcGauge';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { CommandStatusCard } from '@/components/vehicle/CommandStatusCard';
import { useActiveSignals } from '@/store/vehicleStore';
import { getChargeHistory, sendRemoteCommand } from '@/services/mockApi';
import { useVehicleStore } from '@/store/vehicleStore';
import type { ChargeSession, CommandResult } from '@/types/vehicle';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

export default function ChargingScreen() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const signals = useActiveSignals();
  const { activeVin } = useVehicleStore();
  const [history, setHistory] = useState<ChargeSession[]>([]);
  const [limitSheet, setLimitSheet] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState(signals.chargeLimit ?? 90);
  const [commandResult, setCommandResult] = useState<CommandResult | null>(null);
  const pulseAnim = useState(new Animated.Value(1))[0];

  const isCharging = signals.chargingState === 'CHARGING';

  useEffect(() => {
    getChargeHistory(activeVin).then(setHistory);
  }, [activeVin]);

  useEffect(() => {
    if (isCharging) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.6, duration: 750, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 750, useNativeDriver: true }),
        ]),
      ).start();
    }
  }, [isCharging, pulseAnim]);

  const handleSetLimit = async () => {
    setLimitSheet(false);
    const result = await sendRemoteCommand('CHARGE_LIMIT', activeVin, 'mock');
    setCommandResult(result);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Charging" fallbackPath="/(customer)/vehicle" />

      <ScrollView contentContainerStyle={styles.content}>
        {isCharging ? (
          <View style={styles.activeCard}>
            <SOCArcGauge soc={signals.soc} size={140} isCharging />
            <Animated.View style={{ opacity: pulseAnim }}>
              <Zap size={32} color={theme.colors.teal} style={styles.bolt} />
            </Animated.View>
            <Text style={styles.rate}>{signals.chargingRateKw ?? 4.2} kW</Text>
            <Text style={styles.ttf}>
              {Math.floor((signals.timeToFullMinutes ?? 0) / 60)}h {(signals.timeToFullMinutes ?? 0) % 60}m to full
            </Text>
            <View style={styles.chargerBadge}>
              <Text style={styles.chargerText}>AC Type-1</Text>
            </View>
          </View>
        ) : (
          <View style={styles.notCharging}>
            <Text style={styles.notChargingText}>Not currently charging</Text>
            <Text style={styles.lastCharge}>
              Last charge: {history[0]?.date ?? '—'} · +{history[0]?.energyAdded ?? 0} kWh
            </Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>CHARGE LIMIT</Text>
        <View style={styles.limitRow}>
          {[80, 90, 100].map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.limitPill, selectedLimit === l && styles.limitPillActive]}
              onPress={() => {
                setSelectedLimit(l);
                setLimitSheet(true);
              }}
            >
              <Text style={[styles.limitText, selectedLimit === l && styles.limitTextActive]}>
                {l}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {commandResult && (
          <CommandStatusCard commandName="Set Charge Limit" result={commandResult} />
        )}

        <Text style={styles.sectionLabel}>CHARGING HISTORY</Text>
        {history.map((session) => (
          <View key={session.id} style={styles.historyCard}>
            <View style={styles.historyRow}>
              <Text style={styles.historyDate}>{session.date}</Text>
              <Text style={styles.historyDuration}>{session.duration}</Text>
            </View>
            <Text style={styles.historyMeta}>
              +{session.energyAdded} kWh · {session.startSoc}% → {session.endSoc}%
            </Text>
            <Text style={styles.historyLocation}>{session.location}</Text>
          </View>
        ))}
      </ScrollView>

      <BottomSheet visible={limitSheet} onClose={() => setLimitSheet(false)} title="Confirm Charge Limit">
        <Text style={styles.confirmText}>
          Set charge limit to {selectedLimit}%? This helps protect battery health.
        </Text>
        <Button title="Confirm" onPress={handleSetLimit} />
        <Button title="Cancel" onPress={() => setLimitSheet(false)} variant="outline" style={{ marginTop: 8 }} />
      </BottomSheet>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  content: { padding: 16, paddingBottom: 32 },
  activeCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  bolt: { marginTop: -20, marginBottom: 8 },
  rate: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 32,
    color: theme.colors.teal,
  },
  ttf: { fontSize: 14, color: theme.colors.text2, marginTop: 4 },
  chargerBadge: {
    marginTop: 12,
    backgroundColor: theme.colors.tealDim,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  chargerText: { fontSize: 12, color: theme.colors.teal },
  notCharging: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  notChargingText: { fontSize: 16, color: theme.colors.text1 },
  lastCharge: { fontSize: 13, color: theme.colors.text2, marginTop: 8 },
  sectionLabel: {
    fontSize: 11,
    color: theme.colors.text2,
    letterSpacing: 1,
    marginBottom: 12,
  },
  limitRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  limitPill: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  limitPillActive: { borderColor: theme.colors.teal, backgroundColor: theme.colors.tealDim },
  limitText: { fontSize: 16, color: theme.colors.text2 },
  limitTextActive: { color: theme.colors.teal, fontWeight: '600' },
  historyCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between' },
  historyDate: { fontSize: 14, color: theme.colors.text1 },
  historyDuration: { fontSize: 12, color: theme.colors.text2 },
  historyMeta: {
    fontSize: 12,
    color: theme.colors.text2,
    fontFamily: 'JetBrainsMono_400Regular',
    marginTop: 4,
  },
  historyLocation: { fontSize: 11, color: theme.colors.text3, marginTop: 2 },
  confirmText: { color: theme.colors.text2, fontSize: 14, marginBottom: 16, lineHeight: 20 },
});
