export const colors = {
  background: '#F4F5F7',
  midnight: '#F4F5F7',
  surface: '#FFFFFF',
  surface2: '#E9ECF0',
  elevated: '#FFFFFF',

  primary: '#1A2536', // Navy blue for buttons and primary elements
  teal: '#005BFF', // Vibrant VOLT brand blue
  tealDim: 'rgba(0, 91, 255, 0.1)',
  tealMuted: 'rgba(0, 91, 255, 0.05)',

  amber: '#D97706',
  red: '#DC2626',
  green: '#16A34A',
  blueSoft: '#005BFF',

  text1: '#111827', // Charcoal black for high contrast
  text2: '#6B7280', // Slate grey
  text3: '#9CA3AF', // Muted grey

  border: '#E5E7EB',
  borderSubtle: '#F3F4F6',
  divider: '#E5E7EB',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const typography = {
  display: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  title: { fontSize: 20, fontWeight: '600' as const, letterSpacing: -0.3 },
  headline: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  label: { fontSize: 12, fontWeight: '500' as const },
  micro: { fontSize: 11, fontWeight: '400' as const },
  mono: { fontFamily: 'JetBrainsMono_400Regular' },
  monoBold: { fontFamily: 'JetBrainsMono_700Bold' },
};

export const tabBar = {
  height: 56,
  backgroundColor: colors.surface,
  borderColor: colors.border,
  activeTint: colors.primary,
  inactiveTint: colors.text3,
};
