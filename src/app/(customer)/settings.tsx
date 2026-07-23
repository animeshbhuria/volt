import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User as UserIcon,
  Mail,
  Phone,
  Globe,
  Bell,
  Shield,
  ChevronRight,
  ChevronDown,
  Check,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useActiveSignals } from '@/store/vehicleStore';
import { useAlertStore } from '@/store/alertStore';
import { NeumorphicSwitch } from '@/components/ui/NeumorphicSwitch';
import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';
import { radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, updateProfile, logout, user } = useAuthStore();
  const { t } = useTranslation();
  const signals = useActiveSignals();
  const { alerts } = useAlertStore();
  const { theme, scheme, toggleTheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activeInput, setActiveInput] = useState<'name' | 'email' | null>(null);
  const [formExpanded, setFormExpanded] = useState(false);

  if (!profile) return null;

  const handleLogout = () => {
    const performLogout = () => {
      logout();
      router.replace('/(auth)/login');
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure about logging out?');
      if (confirmed) {
        performLogout();
      }
    } else {
      Alert.alert(
        'Are you sure about logging out?',
        '',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'LOGOUT',
            style: 'destructive',
            onPress: performLogout,
          },
        ]
      );
    }
  };

  const nameInitials = profile.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <View style={styles.container}>
      <ScreenHeader title="Profile" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* User Profile Card */}
        <View style={styles.headerBlock}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{nameInitials}</Text>
            </View>
          </View>
          <Text style={styles.userName}>USER: {profile.name} (Male)</Text>
          <Text style={styles.userSub}>Fleet Role: Personal Owner / Driver</Text>
        </View>

        {/* Recent Alerts Section */}
        <Text style={styles.sectionTitle}>RECENT ALERTS</Text>
        <View style={styles.alertsContainer}>
          {alerts.length === 0 ? (
            <View style={[styles.alertRow, styles.alertRowInfo]}>
              <CheckCircle2 size={18} color="#16A34A" />
              <Text style={[styles.alertText, { color: '#16A34A' }]}>
                No critical alerts. Software is up to date.
              </Text>
            </View>
          ) : (
            alerts.slice(0, 3).map((alert) => {
              const isCritical = alert.severity === 'critical';
              let rowStyle = styles.alertRowWarning;
              let textColor = '#B45309';
              let AlertIcon = AlertTriangle;

              if (isCritical) {
                rowStyle = styles.alertRowCritical;
                textColor = '#B91C1C';
                AlertIcon = XCircle;
              } else if (alert.severity === 'info') {
                rowStyle = styles.alertRowSuccess;
                textColor = '#047857';
                AlertIcon = CheckCircle2;
              }

              return (
                <View key={alert.id} style={[styles.alertRow, rowStyle]}>
                  <AlertIcon size={18} color={textColor} />
                  <Text style={[styles.alertText, { color: textColor }]}>
                    {alert.description}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        {/* Schedule Service Action Button */}
        <TouchableOpacity
          style={styles.scheduleBtn}
          onPress={() => router.push('/(customer)/service')}
          activeOpacity={0.8}
        >
          <Text style={styles.scheduleBtnText}>SCHEDULE VEHICLE SERVICE  →</Text>
        </TouchableOpacity>

        {/* Collapsible Form Card */}
        <Card style={styles.collapsibleCard} padded={false}>
          <TouchableOpacity
            style={styles.collapsibleHeader}
            onPress={() => setFormExpanded(!formExpanded)}
            activeOpacity={0.8}
          >
            <View style={styles.collapsibleTitleRow}>
              <UserIcon size={16} color={theme.colors.primary} />
              <Text style={styles.collapsibleTitle}>Manage Profile Settings</Text>
            </View>
            <ChevronDown
              size={18}
              color={theme.colors.text2}
              style={{ transform: [{ rotate: formExpanded ? '180deg' : '0deg' }] }}
            />
          </TouchableOpacity>

          {formExpanded && (
            <View style={styles.formContainer}>
              {/* Account Form */}
              <Text style={styles.formSectionTitle}>Account Information</Text>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>NAME</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    activeInput === 'name' && styles.inputWrapperFocused,
                  ]}
                >
                  <UserIcon
                    size={16}
                    color={activeInput === 'name' ? theme.colors.teal : theme.colors.text3}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.formInput}
                    value={profile.name}
                    onChangeText={(v) => updateProfile({ name: v })}
                    placeholder="Your Name"
                    placeholderTextColor={theme.colors.text3}
                    onFocus={() => setActiveInput('name')}
                    onBlur={() => setActiveInput(null)}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>EMAIL ADDRESS</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    activeInput === 'email' && styles.inputWrapperFocused,
                  ]}
                >
                  <Mail
                    size={16}
                    color={activeInput === 'email' ? theme.colors.teal : theme.colors.text3}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.formInput}
                    value={profile.email}
                    onChangeText={(v) => updateProfile({ email: v })}
                    keyboardType="email-address"
                    placeholder="email@example.com"
                    placeholderTextColor={theme.colors.text3}
                    autoCapitalize="none"
                    onFocus={() => setActiveInput('email')}
                    onBlur={() => setActiveInput(null)}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>PHONE NUMBER (READ-ONLY)</Text>
                <View style={[styles.inputWrapper, styles.inputWrapperDisabled]}>
                  <Phone size={16} color={theme.colors.text3} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.formInput, styles.formInputDisabled]}
                    value={profile.phone}
                    editable={false}
                  />
                </View>
              </View>

              {/* Language Selection */}
              <Text style={[styles.formSectionTitle, { marginTop: spacing.md }]}>
                {t('language')}
              </Text>
              <TouchableOpacity
                style={[
                  styles.dropdownTrigger,
                  langDropdownOpen && styles.dropdownTriggerActive,
                ]}
                onPress={() => setLangDropdownOpen(!langDropdownOpen)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownText}>
                  {profile.language === 'hi' ? 'हिंदी (Hindi)' : 'English (EN)'}
                </Text>
                <ChevronDown size={16} color={theme.colors.text2} />
              </TouchableOpacity>

              {langDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      profile.language === 'en' && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      updateProfile({ language: 'en' });
                      setLangDropdownOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        profile.language === 'en' && styles.dropdownItemTextActive,
                      ]}
                    >
                      English (EN)
                    </Text>
                    {profile.language === 'en' && <Check size={16} color={theme.colors.teal} />}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      profile.language === 'hi' && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      updateProfile({ language: 'hi' });
                      setLangDropdownOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        profile.language === 'hi' && styles.dropdownItemTextActive,
                      ]}
                    >
                      हिंदी (Hindi)
                    </Text>
                    {profile.language === 'hi' && <Check size={16} color={theme.colors.teal} />}
                  </TouchableOpacity>
                </View>
              )}

              {/* Theme Selector */}
              <Text style={[styles.formSectionTitle, { marginTop: spacing.md }]}>
                Theme
              </Text>
              <View style={styles.themeSelectorContainer}>
                <TouchableOpacity
                  style={[styles.themeOption, scheme !== 'dark' && styles.themeOptionActive]}
                  onPress={() => { if (scheme === 'dark') toggleTheme(); }}
                  activeOpacity={0.7}
                >
                  <Sun size={16} color={scheme !== 'dark' ? theme.colors.teal : theme.colors.text3} />
                  <Text style={[styles.themeOptionText, scheme !== 'dark' && styles.themeOptionTextActive]}>
                    Light
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.themeOption, scheme === 'dark' && styles.themeOptionActive]}
                  onPress={() => { if (scheme !== 'dark') toggleTheme(); }}
                  activeOpacity={0.7}
                >
                  <Moon size={16} color={scheme === 'dark' ? '#FFFFFF' : theme.colors.text3} />
                  <Text style={[styles.themeOptionText, scheme === 'dark' && styles.themeOptionTextActive]}>
                    Dark
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Notification Toggles */}
              <Text style={[styles.formSectionTitle, { marginTop: spacing.md }]}>
                {t('notifications')}
              </Text>
              {Object.entries(profile.notificationPrefs).map(([key, value], idx, arr) => (
                <View
                  key={key}
                  style={[
                    styles.switchRow,
                    idx === arr.length - 1 && styles.switchRowLast,
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.switchLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1)} Alerts
                    </Text>
                    {key === 'critical' && (
                      <Text style={styles.switchDesc}>
                        Critical vehicle health events cannot be disabled
                      </Text>
                    )}
                  </View>
                  <NeumorphicSwitch
                    value={value}
                    onValueChange={(v) =>
                      updateProfile({
                        notificationPrefs: { ...profile.notificationPrefs, [key]: v },
                      })
                    }
                    disabled={key === 'critical'}
                  />
                </View>
              ))}

              {/* Privacy/DPDP switches */}
              <Text style={[styles.formSectionTitle, { marginTop: spacing.md }]}>
                Privacy & Data Protection (DPDP)
              </Text>
              <View style={styles.switchRow}>
                <View style={{ flex: 1, paddingRight: spacing.md }}>
                  <Text style={styles.switchLabel}>Location Tracking</Text>
                  <Text style={styles.switchDesc}>
                    Allows live vehicle positioning on maps for RSA assistance.
                  </Text>
                </View>
                <NeumorphicSwitch
                  value={profile.privacyConsents.locationTracking}
                  onValueChange={(v) =>
                    updateProfile({
                      privacyConsents: {
                        ...profile.privacyConsents,
                        locationTracking: v,
                      },
                    })
                  }
                />
              </View>

              <View style={[styles.switchRow, styles.switchRowLast]}>
                <View style={{ flex: 1, paddingRight: spacing.md }}>
                  <Text style={styles.switchLabel}>Share Diagnostic Logs</Text>
                  <Text style={styles.switchDesc}>
                    Allows sharing diagnostic telemetry with the dealer for pro-active repair.
                  </Text>
                </View>
                <NeumorphicSwitch
                  value={profile.privacyConsents.dataSharing}
                  onValueChange={(v) =>
                    updateProfile({
                      privacyConsents: { ...profile.privacyConsents, dataSharing: v },
                    })
                  }
                />
              </View>

              {/* System Specifications */}
              <Text style={[styles.formSectionTitle, { marginTop: spacing.md }]}>
                Developer & Compliance
              </Text>
              <TouchableOpacity
                style={styles.specificationsBtn}
                onPress={() => router.push('/specifications')}
                activeOpacity={0.7}
              >
                <Text style={styles.specificationsBtnText}>
                  System Specifications & Requirements Matrix
                </Text>
              </TouchableOpacity>

              {/* Logout Action */}
              <Button
                title="LOGOUT"
                onPress={handleLogout}
                variant="outline"
                style={styles.logoutBtn}
              />
            </View>
          )}
        </Card>

        {/* Footer info details */}
        <Text style={styles.roleHint}>
          System Id: {user?.phone}
        </Text>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 48,
  },
  headerBlock: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  avatarContainer: {
    marginBottom: spacing.sm,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 3,
    borderColor: scheme === 'dark' ? theme.colors.border : '#FFFFFF',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: scheme === 'dark' ? theme.colors.background : '#FFFFFF',
    letterSpacing: -0.5,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text1,
    letterSpacing: -0.3,
  },
  userSub: {
    fontSize: 12,
    color: theme.colors.text2,
    marginTop: 4,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.micro,
    color: theme.colors.text2,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  alertsContainer: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  alertRowCritical: {
    backgroundColor: scheme === 'dark' ? 'rgba(220, 38, 38, 0.15)' : '#FEF2F2',
    borderColor: scheme === 'dark' ? 'rgba(220, 38, 38, 0.4)' : '#FCA5A5',
  },
  alertRowWarning: {
    backgroundColor: scheme === 'dark' ? 'rgba(217, 119, 6, 0.15)' : '#FFFBEB',
    borderColor: scheme === 'dark' ? 'rgba(217, 119, 6, 0.4)' : '#FCD34D',
  },
  alertRowSuccess: {
    backgroundColor: scheme === 'dark' ? 'rgba(22, 163, 74, 0.15)' : '#ECFDF5',
    borderColor: scheme === 'dark' ? 'rgba(22, 163, 74, 0.4)' : '#A7F3D0',
  },
  alertRowInfo: {
    backgroundColor: scheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F9FAFB',
    borderColor: theme.colors.border,
  },
  alertText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  scheduleBtn: {
    backgroundColor: theme.colors.teal,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scheduleBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  collapsibleCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: theme.colors.surface,
  },
  collapsibleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  collapsibleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text1,
  },
  formContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  formSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text2,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  formLabel: {
    fontSize: 9,
    color: theme.colors.text2,
    letterSpacing: 0.8,
    marginBottom: 6,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.teal,
  },
  inputWrapperDisabled: {
    backgroundColor: theme.colors.surface2,
    borderColor: theme.colors.border,
  },
  inputIcon: {
    marginRight: 8,
  },
  formInput: {
    flex: 1,
    height: 40,
    color: theme.colors.text1,
    fontSize: 14,
    fontWeight: '500',
  },
  formInputDisabled: {
    color: theme.colors.text3,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownTriggerActive: {
    borderColor: theme.colors.teal,
  },
  dropdownText: {
    fontSize: 14,
    color: theme.colors.text1,
    fontWeight: '500',
  },
  dropdownMenu: {
    marginTop: 4,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: spacing.md,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownItemActive: {
    backgroundColor: theme.colors.tealMuted,
  },
  dropdownItemText: {
    fontSize: 13,
    color: theme.colors.text2,
  },
  dropdownItemTextActive: {
    color: theme.colors.teal,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  switchRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  switchLabel: {
    fontSize: 13,
    color: theme.colors.text1,
    fontWeight: '600',
  },
  switchDesc: {
    fontSize: 11,
    color: theme.colors.text2,
    marginTop: 4,
    lineHeight: 14,
  },
  logoutBtn: {
    borderColor: theme.colors.red,
    borderWidth: 1.5,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.sm,
  },
  roleHint: {
    fontSize: 10,
    color: theme.colors.text3,
    textAlign: 'center',
    marginTop: spacing.md,
    fontFamily: 'JetBrainsMono_400Regular',
  },
  themeSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.radius.md,
    padding: 4,
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
    borderRadius: theme.radius.sm,
  },
  themeOptionActive: {
    backgroundColor: scheme === 'dark' ? theme.colors.surface : '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  themeOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text3,
  },
  themeOptionTextActive: {
    color: theme.colors.text1,
  },
  specificationsBtn: {
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface2,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  specificationsBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.teal,
  },
});
