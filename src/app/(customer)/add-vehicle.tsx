import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { QrCode, Bluetooth, Hash } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

type PairTab = 'vin' | 'qr' | 'ble';

export default function AddVehicleScreen() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const [tab, setTab] = useState<PairTab>('vin');
  const [vin, setVin] = useState('');
  const [otp, setOtp] = useState('');
  const [bleSearching, setBleSearching] = useState(false);
  const pulse = useState(new Animated.Value(1))[0];

  const tabs: { key: PairTab; label: string; icon: typeof Hash }[] = [
    { key: 'vin', label: 'VIN+OTP', icon: Hash },
    { key: 'qr', label: 'Scan QR', icon: QrCode },
    { key: 'ble', label: 'BLE', icon: Bluetooth },
  ];

  const startBleSearch = () => {
    setBleSearching(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]),
    ).start();
    setTimeout(() => {
      setBleSearching(false);
      Alert.alert('Vehicle Found', 'VOLT EV-1 nearby. Connected successfully!');
    }, 3000);
  };

  const handlePair = () => {
    Alert.alert('Pairing Success', 'Vehicle paired successfully!');
    router.back();
  };

  const handleQrScan = () => {
    Alert.alert('QR Scanned', 'VIN VOLT1EV001234 detected. Pairing...');
    setTimeout(handlePair, 1500);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Add Vehicle" fallbackPath="/(customer)" />

      <View style={styles.tabRow}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <t.icon size={16} color={tab === t.key ? theme.colors.midnight : theme.colors.text2} />
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {tab === 'vin' && (
          <>
            <Text style={styles.label}>VIN</Text>
            <TextInput
              style={styles.input}
              placeholder="VOLT1EV001234"
              placeholderTextColor={theme.colors.text3}
              value={vin}
              onChangeText={setVin}
              autoCapitalize="characters"
            />
            <Text style={styles.label}>PAIRING OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="From dealer SMS"
              placeholderTextColor={theme.colors.text3}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
            />
            <Button title="Pair Vehicle" onPress={handlePair} style={{ marginTop: 16 }} />
          </>
        )}

        {tab === 'qr' && (
          <View style={styles.qrArea}>
            <View style={styles.qrFrame}>
              <QrCode size={64} color={theme.colors.teal + '60'} />
            </View>
            <Text style={styles.qrHint}>Point camera at vehicle QR code on dashboard</Text>
            <Button title="Simulate Scan" onPress={handleQrScan} style={{ marginTop: 24 }} />
          </View>
        )}

        {tab === 'ble' && (
          <View style={styles.bleArea}>
            {bleSearching ? (
              <>
                <Animated.View style={[styles.radar, { transform: [{ scale: pulse }] }]} />
                <Text style={styles.bleText}>Searching for nearby VOLT vehicles...</Text>
              </>
            ) : (
              <>
                <Bluetooth size={48} color={theme.colors.teal} />
                <Text style={styles.bleText}>Enable Bluetooth to find nearby vehicles</Text>
                <Button title="Start Search" onPress={startBleSearch} style={{ marginTop: 24 }} />
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 24 },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabActive: { backgroundColor: theme.colors.teal, borderColor: theme.colors.teal },
  tabText: { fontSize: 12, color: theme.colors.text2 },
  tabTextActive: { color: theme.colors.midnight, fontWeight: '600' },
  content: { padding: 16 },
  label: { fontSize: 11, color: theme.colors.text2, letterSpacing: 1, marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: theme.colors.surface2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    color: theme.colors.text1,
    fontFamily: 'JetBrainsMono_400Regular',
  },
  qrArea: { alignItems: 'center', paddingTop: 32 },
  qrFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: theme.colors.teal,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  qrHint: { fontSize: 14, color: theme.colors.text2, marginTop: 16, textAlign: 'center' },
  bleArea: { alignItems: 'center', paddingTop: 48 },
  radar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: theme.colors.teal,
    backgroundColor: theme.colors.tealDim,
  },
  bleText: { fontSize: 14, color: theme.colors.text2, marginTop: 24, textAlign: 'center' },
});
