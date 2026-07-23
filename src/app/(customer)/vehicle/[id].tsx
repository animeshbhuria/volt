import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { SignalRow } from '@/components/vehicle/SignalRow';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useActiveSignals, useActiveVehicle } from '@/store/vehicleStore';
import { BMS_FAULTS, POWERTRAIN_FAULTS } from '@/services/mockSignals';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';
import { SpecificationService } from '@/services/specificationService';

const signalsDb = SpecificationService.getSignals();

type Tab = 'Battery' | 'Powertrain' | 'Vehicle' | 'All Signals';

export default function VehicleStatusScreen() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const { id } = useLocalSearchParams<{ id: string }>();
  const signals = useActiveSignals();
  const vehicle = useActiveVehicle();
  const [tab, setTab] = useState<Tab>('Battery');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: Tab[] = ['Battery', 'Powertrain', 'Vehicle', 'All Signals'];

  const getLiveValue = (sig: typeof signalsDb[0]) => {
    if (sig.id === 'SIG-048') return signals.batteryVoltage;
    if (sig.id === 'SIG-051') return signals.packTempMin;
    if (sig.id === 'SIG-052') return signals.packTempMax;
    if (sig.id === 'SIG-053') return signals.packTempMean;
    if (sig.id === 'SIG-046') return signals.estimatedRange;
    if (sig.id === 'SIG-013') return signals.vcuLowSOC ? '1 (FAULT)' : '0 (OK)';
    if (sig.id === 'SIG-015') return signals.aux12vVoltage < 11.5 ? '1 (WARNING)' : '0 (OK)';
    if (sig.id === 'SIG-044') return signals.batteryFault ? '1 (FAULT)' : '0 (OK)';
    if (sig.id === 'SIG-001') return signals.mcuTempCutoff ? '1 (CUTOFF)' : '0 (OK)';
    if (sig.id === 'SIG-003') return signals.motorTempWarning ? '1 (WARNING)' : '0 (OK)';
    if (sig.id === 'SIG-025') return signals.batteryOverVoltage ? '1 (FAULT)' : '0 (OK)';
    if (sig.id === 'SIG-038') return signals.batteryUnderVoltage ? '1 (FAULT)' : '0 (OK)';
    if (sig.id === 'SIG-027') return signals.deepDischarge ? '1 (FAULT)' : '0 (OK)';
    if (sig.id === 'SIG-028') return signals.cellImbalance ? '1 (FAULT)' : '0 (OK)';
    if (sig.id === 'SIG-029') return signals.thermalRunaway ? '1 (FAULT)' : '0 (OK)';
    if (sig.id === 'SIG-022') return signals.mcuTempCutoff ? '1 (FAULT)' : '0 (OK)';
    if (sig.id === 'SIG-082') return signals.driveMode;
    if (sig.id === 'SIG-022' && sig.name === 'Odometer_Reading') return signals.odometer;

    // Parse enum notes (e.g. "Enum: 0=NO_FAULT; 1=FAULT")
    if (sig.notes && sig.notes.toLowerCase().includes('enum:')) {
      try {
        const enumPart = sig.notes.split('|')[0].replace(/Enum:\s*/i, '').trim();
        const parts = enumPart.split(';');
        const mappings: Record<string, string> = {};
        for (const p of parts) {
          const cleanP = p.trim();
          if (!cleanP) continue;
          const [val, label] = cleanP.split('=').map(s => s.trim());
          if (val !== undefined && label !== undefined) {
            mappings[val] = label;
          }
        }
        
        const charCodeSum = sig.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const keys = Object.keys(mappings);
        if (keys.length > 0) {
          // Deterministically select a key, bias towards 0 (default/normal)
          const chosenKey = (charCodeSum % 15 === 0) && keys.length > 1 ? keys[1] : keys[0];
          return `${chosenKey} (${mappings[chosenKey]})`;
        }
      } catch (e) {
        // Fallback
      }
      return '0 (OK)';
    }

    if (sig.notes.toLowerCase().includes('enum')) {
      return '0 (OK)';
    }

    if (sig.min === 0 && sig.max === 1) {
      return '0 (OK)';
    }

    if (sig.max > sig.min) {
      const charCodeSum = sig.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const factor = (charCodeSum % 10) / 10;
      const mockVal = sig.min + factor * (sig.max - sig.min);
      return mockVal.toFixed(1);
    }

    return '0';
  };

  const filteredDbSignals = signalsDb.filter((sig) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      sig.name.toLowerCase().includes(q) ||
      sig.id.toLowerCase().includes(q) ||
      sig.description.toLowerCase().includes(q) ||
      sig.ecu.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Vehicle Status"
        subtitle={vehicle.regNumber}
        fallbackPath="/(customer)/vehicle"
        right={
          <Text style={styles.timestamp}>
            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        }
      />

      <View style={styles.tabRowWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabRow}
        >
          {tabs.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'Battery' && (
          <>
            <Text style={styles.bigSoc}>{signals.soc}%</Text>
            <Text style={styles.range}>{signals.estimatedRange} km est. range</Text>
            <SignalRow name="Pack Voltage" value={signals.batteryVoltage} unit="V" />
            <SignalRow name="Cell Temp Min" value={signals.packTempMin} unit="°C" />
            <SignalRow name="Cell Temp Max" value={signals.packTempMax} unit="°C" />
            <SignalRow name="Cell Temp Mean" value={signals.packTempMean} unit="°C" />
            <SignalRow name="SOH" value={signals.soh} unit="%" />
            <SignalRow
              name="Charging State"
              value={signals.chargingState.replace('_', ' ')}
            />
            <Text style={styles.faultTitle}>BMS FAULT SUMMARY</Text>
            {BMS_FAULTS.map((f) => (
              <View key={f.id} style={styles.faultRow}>
                <Text style={styles.faultName}>{f.name}</Text>
                {f.active ? (
                  <X size={18} color={theme.colors.red} />
                ) : (
                  <Check size={18} color={theme.colors.green} />
                )}
              </View>
            ))}
          </>
        )}

        {tab === 'Powertrain' && (
          <>
            <View style={styles.driveModes}>
              {(['ECO', 'NORMAL', 'SPORT'] as const).map((mode) => (
                <View
                  key={mode}
                  style={[
                    styles.driveMode,
                    signals.driveMode === mode && styles.driveModeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.driveModeText,
                      signals.driveMode === mode && styles.driveModeTextActive,
                    ]}
                  >
                    {mode}
                  </Text>
                </View>
              ))}
            </View>
            <SignalRow name="MCU Temp" value={signals.mcuTemp ?? null} unit="°C" />
            <SignalRow name="Motor Temp" value={signals.motorTemp ?? null} unit="°C" />
            <Text style={styles.faultTitle}>FAULT LIST</Text>
            {POWERTRAIN_FAULTS.map((f) => (
              <View key={f.id} style={styles.faultRow}>
                <View style={[styles.faultDot, f.active ? styles.faultDotRed : styles.faultDotGreen]} />
                <Text style={styles.faultName}>{f.name}</Text>
                <Text style={styles.faultId}>{f.id}</Text>
              </View>
            ))}
          </>
        )}

        {tab === 'Vehicle' && (
          <>
            <SignalRow name="Odometer" value={signals.odometer.toLocaleString()} unit="km" />
            <SignalRow name="Speed" value={signals.speed} unit="km/h" />
            <SignalRow name="Ignition" value={signals.ignitionState} />
            <SignalRow name="12V Aux" value={signals.aux12vVoltage} unit="V" />
            <View
              style={[
                styles.immobBanner,
                signals.immobilizationStatus === 'ACTIVE'
                  ? styles.immobActive
                  : styles.immobInactive,
              ]}
            >
              <Text style={styles.immobText}>
                {signals.immobilizationStatus === 'ACTIVE' ? 'Vehicle Active' : 'Immobilized'}
              </Text>
            </View>
            <View style={styles.tcuRow}>
              <Text style={styles.tcuLabel}>TCU STATUS</Text>
              <Badge
                label={vehicle.tcuStatus}
                variant={vehicle.tcuStatus === 'ONLINE' ? 'teal' : 'grey'}
              />
            </View>
            <Text style={styles.vinText}>VIN: {id ?? vehicle.vin}</Text>
          </>
        )}

        {tab === 'All Signals' && (
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search 100+ CAN Signals..."
              placeholderTextColor={theme.colors.text3}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
            {filteredDbSignals.map((sig) => {
              const liveValue = getLiveValue(sig);
              return (
                <Card key={sig.id} style={styles.signalCard} padded={false}>
                  <View style={styles.signalCardHeader}>
                    <Text style={styles.signalId}>{sig.id}</Text>
                    <Text style={styles.signalEcu}>{sig.ecu} · {sig.messageName}</Text>
                  </View>
                  <Text style={styles.signalName}>{sig.name.replace(/_/g, ' ')}</Text>
                  <Text style={styles.signalDesc}>{sig.description}</Text>
                  <View style={styles.signalCardFooter}>
                    <Text style={styles.signalValue}>
                      {liveValue} {sig.unit}
                    </Text>
                    <Text style={styles.signalMeta}>
                      CAN ID: {sig.canId} · Start: {sig.startBit} · Len: {sig.length}
                    </Text>
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  timestamp: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 11, color: theme.colors.text2 },
  tabRowWrapper: {
    height: 48,
    marginBottom: 8,
  },
  tabScroll: {
    flexGrow: 0,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabActive: { backgroundColor: theme.colors.teal, borderColor: theme.colors.teal },
  tabText: { fontSize: 13, color: theme.colors.text2 },
  tabTextActive: { color: scheme === 'dark' ? '#0D1117' : '#FFFFFF', fontWeight: '600' },
  content: { padding: 16, paddingBottom: 32 },
  bigSoc: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 56,
    color: theme.colors.text1,
    textAlign: 'center',
  },
  range: { textAlign: 'center', color: theme.colors.teal, fontSize: 16, marginBottom: 24 },
  faultTitle: {
    fontSize: 11,
    color: theme.colors.text2,
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
  },
  faultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  faultName: { flex: 1, fontSize: 14, color: theme.colors.text1 },
  faultId: { fontSize: 11, color: theme.colors.text3, fontFamily: 'JetBrainsMono_400Regular' },
  faultDot: { width: 8, height: 8, borderRadius: 4 },
  faultDotGreen: { backgroundColor: theme.colors.green },
  faultDotRed: { backgroundColor: theme.colors.red },
  driveModes: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  driveMode: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  driveModeActive: { borderColor: theme.colors.teal, backgroundColor: theme.colors.tealDim },
  driveModeText: { fontSize: 13, color: theme.colors.text2 },
  driveModeTextActive: { color: theme.colors.teal, fontWeight: '600' },
  immobBanner: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  immobActive: { backgroundColor: theme.colors.green + '20' },
  immobInactive: { backgroundColor: theme.colors.red + '20' },
  immobText: { fontSize: 18, fontWeight: '700', color: theme.colors.text1 },
  tcuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  tcuLabel: { fontSize: 12, color: theme.colors.text2 },
  vinText: {
    fontSize: 11,
    color: theme.colors.text3,
    marginTop: 16,
    fontFamily: 'JetBrainsMono_400Regular',
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: theme.colors.text1,
    backgroundColor: theme.colors.surface2,
    marginBottom: 16,
    fontSize: 14,
  },
  signalCard: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 12,
  },
  signalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  signalId: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 11,
    color: theme.colors.teal,
  },
  signalEcu: {
    fontSize: 11,
    color: theme.colors.text3,
  },
  signalName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text1,
    marginBottom: 4,
  },
  signalDesc: {
    fontSize: 13,
    color: theme.colors.text2,
    lineHeight: 18,
    marginBottom: 10,
  },
  signalCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    paddingTop: 8,
  },
  signalValue: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 14,
    color: theme.colors.text1,
  },
  signalMeta: {
    fontSize: 10,
    color: theme.colors.text3,
    fontFamily: 'JetBrainsMono_400Regular',
  },
});
