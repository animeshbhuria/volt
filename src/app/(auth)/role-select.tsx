import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ROLE_ROUTES, MOCK_USERS } from '@/constants/auth';
import { useAuthStore, getRoleLabel } from '@/store/authStore';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';
import type { Role } from '@/constants/auth';

const roles: Role[] = ['CUSTOMER', 'DEALER', 'FINANCIER', 'VOLT'];

export default function RoleSelectScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');

  const handleSelect = (role: Role) => {
    const user = Object.values(MOCK_USERS).find((u) => u.role === role);
    if (user) {
      login(user);
      router.replace(ROLE_ROUTES[role] as '/(customer)');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Role</Text>
      <Text style={styles.sub}>Choose your role to continue (demo mode)</Text>
      {roles.map((role) => (
        <TouchableOpacity
          key={role}
          style={styles.roleCard}
          onPress={() => handleSelect(role)}
          accessibilityLabel={`Select ${getRoleLabel(role)} role`}
        >
          <Text style={styles.roleName}>{getRoleLabel(role)}</Text>
          <Text style={styles.rolePhone}>
            {Object.values(MOCK_USERS).find((u) => u.role === role)?.phone}
          </Text>
        </TouchableOpacity>
      ))}
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
  },
  roleCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  roleName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text1,
  },
  rolePhone: {
    fontSize: 13,
    color: theme.colors.text2,
    marginTop: 4,
    fontFamily: 'JetBrainsMono_400Regular',
  },
});
