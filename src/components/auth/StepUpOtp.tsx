import React, { useRef } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface StepUpOtpSheetContentProps {
  otp: string[];
  onOtpChange: (index: number, value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function StepUpOtpInputs({
  otp,
  onOtpChange,
}: Pick<StepUpOtpSheetContentProps, 'otp' | 'onOtpChange'>) {
  const refs = useRef<(TextInput | null)[]>([]);
  const { theme } = useTheme();

  const handleChange = (index: number, value: string) => {
    // Only accept numbers
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (cleanValue.length <= 1) {
      onOtpChange(index, cleanValue);
      if (cleanValue && index < 3) {
        refs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      onOtpChange(index - 1, '');
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpRow}>
      {otp.map((digit, i) => (
        <TextInput
          key={i}
          ref={(r) => {
            refs.current[i] = r;
          }}
          style={[
            styles.otpBox,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface2,
              color: theme.colors.text1,
            },
            digit ? { borderColor: theme.colors.teal } : null,
          ]}
          value={digit}
          onChangeText={(v) => handleChange(i, v)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          accessibilityLabel={`OTP digit ${i + 1}`}
        />
      ))}
    </View>
  );
}

export function StepUpOtpDescription() {
  const { theme } = useTheme();
  return (
    <Text style={[styles.desc, { color: theme.colors.text2 }]}>
      Enter the 4-digit OTP sent to your registered mobile for security verification.
    </Text>
  );
}

const styles = StyleSheet.create({
  desc: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 20,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'JetBrainsMono_700Bold',
  },
});

