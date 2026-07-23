import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { MOCK_OTP, MOCK_USERS } from '@/constants/auth';
import { useAuthStore } from '@/store/authStore';
import { colors, radius, spacing, typography } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleSendOtp = async () => {
    if (phone.length < 10) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 850));
    setSending(false);
    setOtpSent(true);
    setTimer(60);
    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (cleanValue.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);
    
    // Auto-advance
    if (cleanValue && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }

    const code = newOtp.join('');
    if (code.length === 4 && code === MOCK_OTP) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const user = MOCK_USERS[phone];
      if (user) {
        login(user);
        router.replace('/');
      } else {
        router.push('/(auth)/role-select');
      }
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      otpRefs.current[index - 1]?.focus();
    }
  };

  const formatTimer = `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Container */}
        <View style={styles.brandContainer}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.taglineRow}>
            <View style={styles.taglineLine} />
            <Text style={styles.taglineText}>MOBILITY</Text>
            <View style={styles.taglineLine} />
          </View>
        </View>

        {/* Headlines */}
        <View style={styles.headlineContainer}>
          <Text style={styles.headline}>Your vehicle,{'\n'}in your hands</Text>
          <Text style={styles.sub}>Log in to manage your VOLT EV</Text>
        </View>

        {/* Input Form */}
        <View style={styles.formContainer}>
          <Text style={styles.fieldLabel}>MOBILE NUMBER</Text>
          
          <View style={[styles.phoneInputRow, isFocused && styles.phoneInputRowFocused]}>
            <View style={styles.prefixContainer}>
              <Text style={styles.prefixText}>+91</Text>
              <Svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={styles.chevronIcon}>
                <Path d="M1 1L5 5L9 1" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            
            <View style={styles.verticalDivider} />
            
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              accessibilityLabel="Mobile number"
            />
          </View>
        </View>

        {/* OTP Verification Block */}
        {otpSent && (
          <View style={styles.otpBlock}>
            <Text style={styles.fieldLabel}>VERIFICATION CODE</Text>
            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(r) => { otpRefs.current[i] = r; }}
                  style={[
                    styles.otpBox, 
                    digit ? styles.otpBoxActive : null,
                    focusedIndex === i ? styles.otpBoxFocused : null
                  ]}
                  value={digit}
                  onChangeText={(v) => handleOtpChange(i, v)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
                  onFocus={() => setFocusedIndex(i)}
                  onBlur={() => setFocusedIndex(null)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  accessibilityLabel={`OTP digit ${i + 1}`}
                />
              ))}
            </View>
            <View style={styles.timerRow}>
              <Text style={styles.timer}>
                {timer > 0 ? `Resend in ${formatTimer}` : 'You can resend the code'}
              </Text>
              {timer === 0 && (
                <TouchableOpacity onPress={handleSendOtp} activeOpacity={0.7}>
                  <Text style={styles.resendLink}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Primary Action Button */}
        {!otpSent && (
          <TouchableOpacity
            style={[styles.primaryBtn, phone.length < 10 && styles.primaryBtnDisabled]}
            onPress={handleSendOtp}
            disabled={phone.length < 10 || sending}
            activeOpacity={0.8}
            accessibilityLabel="Send OTP"
          >
            {sending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.primaryBtnText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Footer Disclaimer Help Card */}
        <View style={styles.helpCard}>
          <Svg width="20" height="22" viewBox="0 0 20 22" fill="none" style={styles.shieldIcon}>
            <Path d="M10 1L2 4.5V10.5C2 15.65 5.42 20.44 10 21C14.58 20.44 18 15.65 18 10.5V4.5L10 1Z" fill={colors.teal} stroke={colors.teal} strokeWidth="2" strokeLinejoin="round" />
            <Path d="M6.5 10.5L9 13L13.5 8.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          
          <View style={styles.helpTextCol}>
            <Text style={styles.helpTitle}>First time here?</Text>
            <Text style={styles.helpSubtitle}>Your dealer will pair your vehicle at delivery.</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 40,
    justifyContent: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 44,
  },
  logo: {
    width: 350,
    height: 350,
    marginVertical: -140,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    width: 200,
  },
  taglineLine: {
    height: 1,
    backgroundColor: '#F1F5F9',
    flex: 1,
  },
  taglineText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.teal,
    letterSpacing: 6,
    marginHorizontal: 12,
  },
  headlineContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    height: 52,
  },
  phoneInputRowFocused: {
    borderColor: colors.teal,
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
  },
  prefixText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  chevronIcon: {
    marginLeft: 6,
    marginTop: 1,
  },
  verticalDivider: {
    width: 1,
    height: '40%',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingHorizontal: 10,
    height: '100%',
    fontWeight: '500',
  },
  primaryBtn: {
    backgroundColor: colors.teal,
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  otpBlock: {
    marginTop: 8,
    marginBottom: 16,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  otpBox: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontSize: 20,
    color: '#0F172A',
    fontWeight: '700',
  },
  otpBoxActive: {
    borderColor: colors.teal,
  },
  otpBoxFocused: {
    borderColor: colors.teal,
    borderWidth: 1.5,
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  timer: {
    fontSize: 12,
    color: '#64748B',
  },
  resendLink: {
    fontSize: 12,
    color: colors.teal,
    fontWeight: '600',
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginTop: 36,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shieldIcon: {
    marginRight: 12,
  },
  helpTextCol: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  helpSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
});
