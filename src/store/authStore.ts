import { create } from 'zustand';
import type { Role } from '@/constants/auth';
import type { MockUser } from '@/constants/auth';
import type { UserProfile } from '@/types/user';

interface AuthState {
  isAuthenticated: boolean;
  user: MockUser | null;
  profile: UserProfile | null;
  deviceVerified: boolean;
  deviceFingerprint: string;
  login: (user: MockUser) => void;
  logout: () => void;
  setDeviceVerified: (verified: boolean) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const defaultProfile: UserProfile = {
  name: 'Ramesh Kumar',
  phone: '9876543210',
  email: 'ramesh.kumar@email.com',
  language: 'en',
  notificationPrefs: {
    service: true,
    trips: true,
    documents: true,
    critical: true,
  },
  privacyConsents: {
    locationTracking: true,
    dataSharing: false,
    marketing: false,
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  profile: null,
  deviceVerified: true,
  deviceFingerprint: 'VOLT-DEV-A1B2C3D4',
  login: (user) =>
    set({
      isAuthenticated: true,
      user,
      profile: { ...defaultProfile, name: user.name, phone: user.phone },
      deviceVerified: user.phone !== '9876543210',
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      profile: null,
      deviceVerified: true,
    }),
  setDeviceVerified: (verified) => set({ deviceVerified: verified }),
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),
}));

export function getRoleLabel(role: Role): string {
  switch (role) {
    case 'CUSTOMER':
      return 'End Customer';
    case 'DEALER':
      return 'Dealer';
    case 'FINANCIER':
      return 'Financier';
    case 'VOLT':
      return 'VOLT Mobility';
    default:
      return role;
  }
}
