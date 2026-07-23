import React, { useState, useEffect } from 'react';
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
  Wrench,
  Lock,
  ChevronDown,
  Check,
  Moon,
  Sun,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/authStore';
import { getDealerVehicles } from '@/services/mockApi';
import { NeumorphicSwitch } from '@/components/ui/NeumorphicSwitch';
import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';
import { radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

export default function DealerProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, logout, user } = useAuthStore();
  const { t } = useTranslation();
  const { theme, scheme, toggleTheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activeInput, setActiveInput] = useState<'email' | null>(null);

  // Stats State
  const [stats, setStats] = useState({ linkedCount: 0, activeServices: 0, appointmentsToday: 3 });

  useEffect(() => {
    getDealerVehicles().then((vehicles) => {
      const activeCount = vehicles.filter(v => v.status === 'In Service').length;
      setStats({
        linkedCount: vehicles.length,
        activeServices: activeCount || 1, // Fallback
        appointmentsToday: 3,
      });
    }).catch(() => {
      setStats({ linkedCount: 47, activeServices: 8, appointmentsToday: 3 });
    });
  }, []);

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

  const nameInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'DL';

  return (
    <View style={styles.container}>
      <ScreenHeader title="Dealer Profile" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Dealer Header Section */}
      <View style={styles.headerBlock}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{nameInitials}</Text>
          </View>
        </View>
        <Text style={styles.userName}>{user?.name || 'Jaipur EV Motors'}</Text>
        <Text style={styles.userSub}>{profile.email || 'jaipur.ev@voltmobility.com'}</Text>
      </View>

      {/* Linked Stats with Dynamic Theme Gradient */}
      <LinearGradient
        colors={scheme === 'dark' ? [theme.colors.surface, theme.colors.surface2] : ['#FFFFFF', '#E9ECF0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsRow}
      >
        <View style={styles.statTile}>
          <Text style={styles.statVal}>{stats.linkedCount}</Text>
          <Text style={styles.statLbl}>VEHICLES LINKED</Text>
        </View>
        <View style={[styles.statTile, styles.statTileBorder]}>
          <Text style={styles.statVal}>{stats.activeServices}</Text>
          <Text style={styles.statLbl}>ACTIVE SERVICES</Text>
        </View>
        <View style={styles.statTile}>
          <Text style={styles.statVal}>{stats.appointmentsToday}</Text>
          <Text style={styles.statLbl}>TODAY'S APPT</Text>
        </View>
      </LinearGradient>

      {/* Dealership Details */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <UserIcon size={16} color={theme.colors.teal} />
          <Text style={styles.sectionTitle}>Dealership Information</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>DEALER NAME</Text>
          <View style={[styles.inputWrapper, styles.inputWrapperDisabled]}>
            <UserIcon size={16} color={theme.colors.text3} style={styles.inputIcon} />
            <TextInput
              style={[styles.formInput, styles.formInputDisabled]}
              value={user?.name}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>DEALER PARTNER EMAIL</Text>
          <View style={[
            styles.inputWrapper,
            activeInput === 'email' && styles.inputWrapperFocused
          ]}>
            <Mail size={16} color={activeInput === 'email' ? theme.colors.teal : theme.colors.text3} style={styles.inputIcon} />
            <TextInput
              style={styles.formInput}
              value={profile.email || 'jaipur.ev@voltmobility.com'}
              onChangeText={(v) => updateProfile({ email: v })}
              keyboardType="email-address"
              placeholder="dealer.email@example.com"
              placeholderTextColor={theme.colors.text3}
              autoCapitalize="none"
              onFocus={() => setActiveInput('email')}
              onBlur={() => setActiveInput(null)}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>CONTACT NUMBER</Text>
          <View style={[styles.inputWrapper, styles.inputWrapperDisabled]}>
            <Phone size={16} color={theme.colors.text3} style={styles.inputIcon} />
            <TextInput
              style={[styles.formInput, styles.formInputDisabled]}
              value={user?.phone}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>DEALER CODE</Text>
          <View style={[styles.inputWrapper, styles.inputWrapperDisabled]}>
            <Lock size={16} color={theme.colors.text3} style={styles.inputIcon} />
            <TextInput
              style={[styles.formInput, styles.formInputDisabled]}
              value={user?.dealerId || 'D042'}
              editable={false}
            />
          </View>
        </View>
      </Card>

      {/* Dealer Preferences (Dropdown) */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Globe size={16} color={theme.colors.teal} />
          <Text style={styles.sectionTitle}>{t('language')}</Text>
        </View>
        
        {/* Custom Dropdown Trigger */}
        <TouchableOpacity
          style={[styles.dropdownTrigger, langDropdownOpen && styles.dropdownTriggerActive]}
          onPress={() => setLangDropdownOpen(!langDropdownOpen)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropdownText}>
            {profile.language === 'hi' ? 'हिंदी (Hindi)' : 'English (EN)'}
          </Text>
          <ChevronDown size={16} color={theme.colors.text2} />
        </TouchableOpacity>

        {/* Absolute-like Dropdown overlay inside layout flow */}
        {langDropdownOpen && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={[
                styles.dropdownItem,
                profile.language === 'en' && styles.dropdownItemActive
              ]}
              onPress={() => {
                updateProfile({ language: 'en' });
                setLangDropdownOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dropdownItemText,
                profile.language === 'en' && styles.dropdownItemTextActive
              ]}>
                English (EN)
              </Text>
              {profile.language === 'en' && <Check size={16} color={theme.colors.teal} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dropdownItem,
                profile.language === 'hi' && styles.dropdownItemActive
              ]}
              onPress={() => {
                updateProfile({ language: 'hi' });
                setLangDropdownOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dropdownItemText,
                profile.language === 'hi' && styles.dropdownItemTextActive
              ]}>
                हिंदी (Hindi)
              </Text>
              {profile.language === 'hi' && <Check size={16} color={theme.colors.teal} />}
            </TouchableOpacity>
          </View>
        )}
      </Card>

      {/* Dealer Notifications */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Bell size={16} color={theme.colors.teal} />
          <Text style={styles.sectionTitle}>Dealer Notifications</Text>
        </View>
        
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>Service Appointments</Text>
            <Text style={styles.switchDesc}>Get alerts when customers book routine service slots.</Text>
          </View>
          <NeumorphicSwitch
            value={profile.notificationPrefs.service}
            onValueChange={(v) =>
              updateProfile({
                notificationPrefs: { ...profile.notificationPrefs, service: v },
              })
            }
          />
        </View>

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>Critical Breakdowns</Text>
            <Text style={styles.switchDesc}>Receive instant notifications for RSA roadside emergencies in your area.</Text>
          </View>
          <NeumorphicSwitch
            value={profile.notificationPrefs.critical}
            onValueChange={(v) =>
              updateProfile({
                notificationPrefs: { ...profile.notificationPrefs, critical: v },
              })
            }
          />
        </View>
      </Card>

      {/* DPDP Compliance Data Protection */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Shield size={16} color={theme.colors.teal} />
          <Text style={styles.sectionTitle}>DPDP Dealer Compliance</Text>
        </View>
        <View style={[styles.switchRow, styles.switchRowLast]}>
          <View style={{ flex: 1, paddingRight: spacing.md }}>
            <Text style={styles.switchLabel}>DPDP Data Lock</Text>
            <Text style={styles.switchDesc}>
              Restricts access to customer diagnostic and telemetry logs except when a vehicle is under active job card.
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
      </Card>

      {/* Theme Preference Settings */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Moon size={16} color={theme.colors.teal} />
          <Text style={styles.sectionTitle}>Appearance Settings</Text>
        </View>
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
      </Card>

      {/* System Specifications */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Shield size={16} color={theme.colors.teal} />
          <Text style={styles.sectionTitle}>Developer & Compliance</Text>
        </View>
        <TouchableOpacity
          style={styles.specificationsBtn}
          onPress={() => router.push('/specifications')}
          activeOpacity={0.7}
        >
          <Text style={styles.specificationsBtnText}>
            System Specifications & Requirements Matrix
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Logout Action */}
      <Button
        title="LOGOUT"
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutBtn}
      />
      <Text style={styles.roleHint}>
        Dealer System ID: {user?.phone} · Region: Jaipur-North
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
  statsRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  statTile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTileBorder: {
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  statVal: {
    fontSize: 16,
    color: theme.colors.text1,
    ...theme.typography.monoBold,
  },
  statLbl: {
    fontSize: 9,
    color: theme.colors.text2,
    letterSpacing: 0.8,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: radius.md,
    backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text1,
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
    fontSize: 14,
    color: theme.colors.text1,
    fontWeight: '500',
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
    marginTop: spacing.xs,
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
    marginTop: spacing.xs,
  },
  specificationsBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.teal,
    textAlign: 'center',
  },
});
