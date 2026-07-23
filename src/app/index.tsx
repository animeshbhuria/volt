import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

const ROLE_ROUTES = {
  CUSTOMER: '/(customer)',
  DEALER: '/(dealer)',
  FINANCIER: '/(financier)',
  VOLT: '/(oem)',
} as const;

export default function Index() {
  const { isAuthenticated, user, deviceVerified } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!deviceVerified) {
    return <Redirect href="/(auth)/device-verify" />;
  }

  const destination = user?.role
    ? ROLE_ROUTES[user.role as keyof typeof ROLE_ROUTES]
    : undefined;

  return (
    <Redirect
      href={destination ?? '/(auth)/role-select'}
    />
  );
}
