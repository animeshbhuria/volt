import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { CommandStatusCard } from '@/components/vehicle/CommandStatusCard';
import { StepUpOtpInputs, StepUpOtpDescription } from '@/components/auth/StepUpOtp';
import { getImmobilizationRequests, sendRemoteCommand } from '@/services/mockApi';
import { MOCK_OTP } from '@/constants/auth';
import type { ImmobilizationRequest, CommandResult } from '@/types/vehicle';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

export default function ImmobilizationReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [request, setRequest] = useState<ImmobilizationRequest | null>(null);
  const [stepUpVisible, setStepUpVisible] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [commandResult, setCommandResult] = useState<CommandResult | null>(null);
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    getImmobilizationRequests().then((reqs) => {
      setRequest(reqs.find((r) => r.id === id) ?? reqs[0] ?? null);
    });
  }, [id]);

  const handleAction = (type: 'approve' | 'reject') => {
    setAction(type);
    setStepUpVisible(true);
  };

  const handleConfirm = async () => {
    if (otp.join('') !== MOCK_OTP) {
      Alert.alert('Invalid OTP');
      return;
    }
    setStepUpVisible(false);
    setOtp(['', '', '', '']);

    if (action === 'approve') {
      const result = await sendRemoteCommand('IMMOBILIZE', request?.vin ?? '', 'mock');
      setCommandResult(result);
      Alert.alert('Approved', 'Immobilization command queued for execution.');
    } else {
      Alert.alert('Rejected', 'Immobilization request has been rejected.');
      router.back();
    }
    setAction(null);
  };

  if (!request) return null;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Review Request" fallbackPath="/(oem)/immobilization" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.reqId}>{request.id}</Text>

        <Text style={styles.label}>REQUESTER</Text>
        <Text style={styles.value}>{request.requester}</Text>

        <Text style={styles.label}>VEHICLE</Text>
        <Text style={styles.value}>{request.vin}</Text>

        <Text style={styles.label}>CUSTOMER</Text>
        <Text style={styles.value}>{request.customer}</Text>

        <Text style={styles.label}>REASON</Text>
        <Text style={styles.value}>{request.reason}</Text>

        <Text style={styles.label}>EVIDENCE</Text>
        <Text style={styles.evidence}>{request.evidence}</Text>

        <View style={styles.actions}>
          <Button
            title="Approve & Queue Command"
            onPress={() => handleAction('approve')}
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Reject Request"
            onPress={() => handleAction('reject')}
            variant="danger"
          />
        </View>

        {commandResult && (
          <CommandStatusCard commandName="Immobilize Vehicle" result={commandResult} />
        )}
      </ScrollView>

      <BottomSheet visible={stepUpVisible} onClose={() => setStepUpVisible(false)} title="Step-Up OTP">
        <StepUpOtpDescription />
        <StepUpOtpInputs
          otp={otp}
          onOtpChange={(i, v) => {
            const next = [...otp];
            next[i] = v;
            setOtp(next);
          }}
        />
        <Button title="Confirm" onPress={handleConfirm} />
      </BottomSheet>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 56, gap: 12 },
  title: { fontSize: 22, fontWeight: '700', color: theme.colors.text1 },
  content: { padding: 16, paddingBottom: 32 },
  reqId: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 14, color: theme.colors.teal, marginBottom: 24 },
  label: { fontSize: 11, color: theme.colors.text2, letterSpacing: 1, marginTop: 16, marginBottom: 4 },
  value: { fontSize: 16, color: theme.colors.text1 },
  evidence: { fontSize: 14, color: theme.colors.text2, lineHeight: 20 },
  actions: { marginTop: 32 },
});
