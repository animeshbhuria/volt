import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

export default function DeviceVerifyScreen() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const { deviceFingerprint, setDeviceVerified } = useAuthStore();

  const handleVerify = () => {
    setDeviceVerified(true);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify This Device</Text>
      <Text style={styles.sub}>
        For your security, please verify this new device before accessing your vehicle data.
      </Text>
      <View style={styles.fingerprintCard}>
        <Text style={styles.label}>DEVICE FINGERPRINT</Text>
        <Text style={styles.fingerprint}>{deviceFingerprint}</Text>
      </View>
      <Text style={styles.info}>
        This device will be registered for secure remote commands and alerts.
      </Text>
      <Button title="Verify Device" onPress={handleVerify} accessibilityLabel="Verify device" />
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.midnight,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text1,
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: theme.colors.text2,
    marginBottom: 32,
    lineHeight: 20,
  },
  fingerprintCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    color: theme.colors.text2,
    letterSpacing: 1,
    marginBottom: 8,
  },
  fingerprint: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 18,
    color: theme.colors.teal,
  },
  info: {
    fontSize: 13,
    color: theme.colors.text2,
    marginBottom: 32,
    lineHeight: 18,
  },
});
