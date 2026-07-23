import { colors as lightColors, spacing, radius, typography, tabBar as lightTabBar } from '@/constants/theme';

export const lightTheme = {
  colors: lightColors,
  spacing,
  radius,
  typography,
  tabBar: lightTabBar,
};

export const darkTheme = {
  colors: {
    background: '#0B0D12',
    midnight: '#0B0D12',
    surface: '#1A1E2A',
    surface2: '#262B38',
    elevated: '#2A2E3C',
    primary: '#FFFFFF',
    teal: '#005BFF',
    tealDim: 'rgba(0, 91, 255, 0.2)',
    tealMuted: 'rgba(0, 91, 255, 0.1)',
    amber: '#D97706',
    red: '#DC2626',
    green: '#16A34A',
    blueSoft: '#005BFF',
    text1: '#F3F4F6',
    text2: '#D1D5DB',
    text3: '#9CA3AF',
    border: '#374151',
    borderSubtle: '#1F2937',
    divider: '#374151',
  },
  spacing,
  radius,
  typography,
  tabBar: {
    ...lightTabBar,
    backgroundColor: '#1A1E2A',
    borderColor: '#374151',
    activeTint: '#FFFFFF',
    inactiveTint: '#9CA3AF',
  },
};

export type Theme = typeof lightTheme;
