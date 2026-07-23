import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useActiveVehicle } from '@/store/vehicleStore';
import { useTranslation } from '@/hooks/useTranslation';
import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

type Step = 'release' | 'confirm' | 'done';

export default function TransferOwnershipScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const vehicle = useActiveVehicle();
  const [step, setStep] = useState<Step>('release');
  const [newOwnerPhone, setNewOwnerPhone] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');

  const handleRelease = () => {
    const proceed = () => setStep('confirm');

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('This will remove your access to this vehicle. Continue?');
      if (confirmed) proceed();
    } else {
      Alert.alert(
        'Release Vehicle',
        'This will remove your access to this vehicle. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Release', style: 'destructive', onPress: proceed },
        ],
      );
    }
  };

  const handleTransfer = () => {
    if (newOwnerPhone.length < 10 || !newOwnerName.trim()) {
      if (Platform.OS === 'web') {
        alert('Enter new owner name and phone number.');
      } else {
        Alert.alert('Missing info', 'Enter new owner name and phone number.');
      }
      return;
    }
    setStep('done');
  };

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('release');
    } else if (step === 'done') {
      router.replace('/(customer)/vehicle');
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(customer)/vehicle');
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t('ownershipTransfer')}
        onBack={handleBack}
        fallbackPath="/(customer)/vehicle"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.label}>VEHICLE</Text>
          <Text style={styles.value}>{vehicle.model}</Text>
          <Text style={styles.meta}>{vehicle.regNumber} · {vehicle.vin}</Text>
        </Card>

        {step === 'release' && (
          <>
            <Text style={styles.info}>
              Transfer ownership to a new user. You must release the vehicle first, then the new owner can claim it with VIN + OTP.
            </Text>
            <Button title="Release My Ownership" variant="danger" onPress={handleRelease} />
          </>
        )}

        {step === 'confirm' && (
          <>
            <Text style={styles.info}>
              Enter new owner details. They will receive an OTP to claim the vehicle.
            </Text>
            <Text style={styles.fieldLabel}>NEW OWNER NAME</Text>
            <TextInput
              style={styles.input}
              value={newOwnerName}
              onChangeText={setNewOwnerName}
              placeholder="Full name"
              placeholderTextColor={theme.colors.text3}
            />
            <Text style={styles.fieldLabel}>NEW OWNER PHONE</Text>
            <TextInput
              style={styles.input}
              value={newOwnerPhone}
              onChangeText={setNewOwnerPhone}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="10-digit mobile"
              placeholderTextColor={theme.colors.text3}
            />
            <Button title="Initiate Transfer" onPress={handleTransfer} style={{ marginTop: spacing.md }} />
          </>
        )}

        {step === 'done' && (
          <Card style={styles.successCard}>
            <Text style={styles.successTitle}>Transfer Initiated</Text>
            <Text style={styles.successText}>
              OTP sent to {newOwnerPhone}. {newOwnerName} can claim {vehicle.regNumber} via Add Vehicle → VIN+OTP.
            </Text>
            <Button title="Done" onPress={() => router.replace('/(customer)/vehicle')} style={{ marginTop: spacing.md }} />
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  label: { ...typography.micro, color: theme.colors.text2, marginBottom: 4 },
  value: { ...typography.title, fontSize: 18, color: theme.colors.text1 },
  meta: { ...typography.micro, color: theme.colors.text3, marginTop: 4, fontFamily: 'JetBrainsMono_400Regular' },
  info: { ...typography.caption, color: theme.colors.text2, lineHeight: 20, marginVertical: spacing.md },
  fieldLabel: { ...typography.micro, color: theme.colors.text2, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: {
    backgroundColor: theme.colors.surface2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: spacing.md,
    color: theme.colors.text1,
    fontSize: 15,
  },
  successCard: { marginTop: spacing.md, borderColor: theme.colors.teal },
  successTitle: { ...typography.headline, color: theme.colors.teal, marginBottom: spacing.sm },
  successText: { ...typography.caption, color: theme.colors.text2, lineHeight: 20 },
});
