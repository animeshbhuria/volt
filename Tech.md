# VOLT Mobility Technical Skills Mapping

This document maps the technical skills used in the repository to the requested implementation areas. The analysis is based on the current codebase and the Expo SDK 56 documentation requirement for this project.

## Authentication Implementation

**Skill/Technology Used:**

- React Native form components: `TextInput`, `TouchableOpacity`, `KeyboardAvoidingView`, `ScrollView`
- React hooks: `useState`, `useRef`, `useEffect`
- Expo Router: `useRouter` for login redirects
- Zustand: global auth/session store
- TypeScript: `Role`, `MockUser`, and `UserProfile` types
- Expo Haptics: success feedback after OTP validation
- Mock OTP authentication: `MOCK_OTP` and phone-number-to-role mapping
- Device verification state: `deviceVerified` and `deviceFingerprint`
- Role-based access metadata: customer, dealer, financier, and OEM/VOLT roles

**Code Snippet:**

`src/constants/auth.ts`

```ts
export type Role = 'CUSTOMER' | 'DEALER' | 'FINANCIER' | 'VOLT';

export interface MockUser {
  phone: string;
  role: Role;
  name: string;
  vehicleVin?: string;
  dealerId?: string;
  portfolioId?: string;
}

export const MOCK_USERS: Record<string, MockUser> = {
  '9876543210': {
    phone: '9876543210',
    role: 'CUSTOMER',
    name: 'Ramesh Kumar',
    vehicleVin: 'VOLT1EV001234',
  },
  '9988776655': {
    phone: '9988776655',
    role: 'DEALER',
    name: 'Jaipur EV Motors',
    dealerId: 'D042',
  },
  '9111222333': {
    phone: '9111222333',
    role: 'FINANCIER',
    name: 'Rajasthan Finance Ltd',
    portfolioId: 'FIN-012',
  },
  '9000000001': {
    phone: '9000000001',
    role: 'VOLT',
    name: 'Operations Team',
  },
};

export const MOCK_OTP = '1234';
```

`src/app/(auth)/login.tsx`

```tsx
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
```

`src/store/authStore.ts`

```ts
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
```

**Explanation:**

Authentication is implemented as a simulated mobile OTP flow. The login screen collects a phone number, sends a mock OTP, accepts four numeric OTP digits, and checks the final code against `MOCK_OTP`. When the OTP is valid, the phone number is resolved against `MOCK_USERS`, which supplies the user's role and related metadata such as `vehicleVin`, `dealerId`, or `portfolioId`.

The authenticated session is stored in `useAuthStore`, a Zustand store that keeps `isAuthenticated`, `user`, `profile`, `deviceVerified`, and `deviceFingerprint` together. This makes authentication state available across the whole app. For the customer demo user, `deviceVerified` becomes `false`, forcing a second device-verification step before vehicle data is accessible. In a production implementation, this mock OTP and mock user mapping would be replaced with a backend OTP service, secure token storage, and server-registered device verification.

## State Management

**Skill/Technology Used:**

- Zustand: lightweight global stores
- TypeScript interfaces for store shape
- Async actions inside stores
- Immutable state updates with `set`
- Derived helper hooks: `useActiveSignals()` and `useActiveVehicle()`
- Local React state for temporary UI state
- Service-store separation: stores call functions from `src/services/mockApi.ts`

**Code Snippet:**

`src/store/vehicleStore.ts`

```ts
interface VehicleState {
  activeVin: string;
  vehicles: Vehicle[];
  signalsMap: Record<string, VehicleSignals>;
  status: VehicleStatus | null;
  loading: boolean;
  error: string | null;
  setActiveVin: (vin: string) => void;
  fetchStatus: () => Promise<void>;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  activeVin: MOCK_VEHICLE.vin,
  vehicles: [MOCK_VEHICLE, MOCK_VEHICLE_2],
  signalsMap: {
    [MOCK_VEHICLE.vin]: MOCK_SIGNALS,
    [MOCK_VEHICLE_2.vin]: MOCK_SIGNALS_2,
  },
  status: null,
  loading: false,
  error: null,
  setActiveVin: (vin) => set({ activeVin: vin }),
  fetchStatus: async () => {
    const vin = get().activeVin;
    set({ loading: true, error: null });
    try {
      const status = await getVehicleStatus(vin);
      set({ status, loading: false });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : 'Failed to load vehicle status',
      });
    }
  },
}));
```

`src/store/alertStore.ts`

```ts
export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  loading: false,
  error: null,
  fetchAlerts: async (userId, role) => {
    set({ loading: true, error: null });
    try {
      const alerts = await getAlerts(userId, role);
      set({ alerts, loading: false });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : 'Failed to load alerts',
      });
    }
  },
  dismissAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),
  markRead: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
    })),
}));
```

**Explanation:**

The repository uses Zustand to manage app-wide state without a large Redux-style setup. State is split by domain: `authStore` handles user/session/profile data, `vehicleStore` handles active vehicle and telemetry status, and `alertStore` handles alerts. Each store defines a typed interface, initial state, and specific actions that update only the relevant state.

Async state is handled directly inside store actions. For example, `fetchStatus()` reads the active VIN from the store, sets loading state, calls `getVehicleStatus()`, then updates either `status` or `error`. This pattern keeps screen components focused on rendering while stores coordinate domain state and service calls.

## Routing/Navigation

**Skill/Technology Used:**

- Expo Router: file-based routing
- Expo Router route groups: `(auth)`, `(customer)`, `(dealer)`, `(financier)`, `(oem)`
- Expo Router `Redirect`, `Stack`, `Tabs`, `useRouter`, and `useSegments`
- Role-based route guards
- Dynamic routes: `[id].tsx`
- Hidden tab routes using `options={{ href: null }}`
- Lucide React Native icons in tab bars
- Theme-aware tab styling through shared navigation constants
- Expo typed routes enabled in `app.json`

**Code Snippet:**

`src/app/index.tsx`

```tsx
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
```

`src/app/_layout.tsx`

```tsx
function NavigationGuard() {
  const segments = useSegments() as string[];
  const router = useRouter();
  const { isAuthenticated, deviceVerified, user } = useAuthStore();

  React.useEffect(() => {
    const rootSegment = segments[0];
    const isAuthGroup = rootSegment === '(auth)';
    const isProtectedArea =
      rootSegment === '(customer)' ||
      rootSegment === '(dealer)' ||
      rootSegment === '(financier)' ||
      rootSegment === '(oem)';

    if (!isAuthenticated) {
      if (isProtectedArea || rootSegment === undefined) {
        router.replace('/(auth)/login');
      }
    } else {
      if (!deviceVerified) {
        if (segments[1] !== 'device-verify') {
          router.replace('/(auth)/device-verify');
        }
      } else {
        if (isAuthGroup || rootSegment === undefined) {
          const role = user?.role;
          if (role === 'CUSTOMER') {
            router.replace('/(customer)');
          } else if (role === 'DEALER') {
            router.replace('/(dealer)');
          } else if (role === 'FINANCIER') {
            router.replace('/(financier)');
          } else if (role === 'VOLT') {
            router.replace('/(oem)');
          } else {
            router.replace('/(auth)/role-select');
          }
        }
      }
    }
  }, [isAuthenticated, deviceVerified, user, segments]);

  return null;
}
```

`src/app/(customer)/_layout.tsx`

```tsx
export default function CustomerLayout() {
  const { theme } = useTheme();
  return (
    <Tabs screenOptions={getTabBarOptions(theme)}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size - 2} color={color} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="vehicle"
        options={{
          title: 'Vehicle',
          tabBarIcon: ({ color, size }) => <Car size={size - 2} color={color} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen name="documents" options={{ href: null }} />
      <Tabs.Screen name="support" options={{ href: null }} />
    </Tabs>
  );
}
```

**Explanation:**

Routing is driven by Expo Router's file structure under `src/app`. The app separates authentication screens from role-specific portals using route groups. The root `index.tsx` performs the first redirect based on authentication, device verification, and role. The root layout also contains a `NavigationGuard` that watches route segments and uses `router.replace()` to keep users inside the correct area.

Each role portal defines its own tabs. For example, the customer portal exposes home, vehicle, service, alerts, and profile tabs, while auxiliary screens such as documents and support are present in the route tree but hidden from the tab bar with `href: null`. Nested stacks are used for deeper flows such as customer vehicle screens and service job cards.

## API/Service Layer

**Skill/Technology Used:**

- TypeScript service modules
- Async/await and Promise-based APIs
- Typed domain responses: `VehicleStatus`, `Trip`, `Alert`, `CommandResult`, `Document`, `ServiceJob`
- Mock data modules: `mockAlerts`, `mockSignals`, `mockTrips`
- Latency simulation with `setTimeout`
- Fault simulation with `simulateFault`
- Remote command lifecycle simulation: `QUEUED`, `SENT`, `ACKNOWLEDGED`
- Network state detection with `@react-native-community/netinfo`
- Context-based offline state provider

**Code Snippet:**

`src/services/mockApi.ts`

```ts
let simulateFault = false;
let findVehiclePingsToday = 2;

export function setSimulateFault(value: boolean) {
  simulateFault = value;
}

function delay(): Promise<void> {
  const ms = 300 + Math.random() * 600;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withDelay<T>(data: T): Promise<T> {
  await delay();
  if (simulateFault) {
    throw new Error('Simulated API fault — please retry.');
  }
  return data;
}

// TODO: replace with API call
export async function getVehicleStatus(vin: string): Promise<VehicleStatus> {
  const vehicle = vin === MOCK_VEHICLE_2.vin ? MOCK_VEHICLE_2 : MOCK_VEHICLE;
  const signals = vin === MOCK_VEHICLE_2.vin ? MOCK_SIGNALS_2 : MOCK_SIGNALS;
  return withDelay({
    vehicle: { ...vehicle, lastSeen: new Date(Date.now() - 2 * 60 * 1000) },
    signals: { ...signals },
    lastUpdated: new Date(),
  });
}
```

`src/services/mockApi.ts`

```ts
export async function sendRemoteCommand(
  command: CommandType,
  vin: string,
  _authToken: string,
): Promise<CommandResult> {
  void vin;
  void _authToken;
  await delay();

  const commandId = `CMD-${Date.now()}`;
  const result: CommandResult = {
    commandId,
    command,
    status: 'QUEUED',
    timestamps: { QUEUED: new Date() },
  };

  return new Promise((resolve, reject) => {
    if (simulateFault) {
      reject(new Error('Command failed to queue.'));
      return;
    }

    setTimeout(() => {
      result.status = 'SENT';
      result.timestamps.SENT = new Date();
    }, 1500);

    setTimeout(() => {
      result.status = 'ACKNOWLEDGED';
      result.timestamps.ACKNOWLEDGED = new Date();
      resolve(result);
    }, 2500);
  });
}
```

`src/providers/NetworkProvider.tsx`

```tsx
export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isOffline }}>
      {children}
    </NetworkContext.Provider>
  );
}
```

**Explanation:**

The service layer is centralized in `src/services/mockApi.ts`. Screens and stores call typed service functions such as `getVehicleStatus`, `getAlerts`, `getTripHistory`, `getDocuments`, and `sendRemoteCommand` instead of reading mock data directly. This makes the current prototype behave like a real networked app and leaves clear replacement points for future backend integration.

`withDelay()` and `delay()` simulate network latency, while `simulateFault` can force API-like failures. Remote commands are modeled with a lifecycle: the command starts as `QUEUED`, moves to `SENT`, and finishes as `ACKNOWLEDGED`. The app also uses a `NetworkProvider` with NetInfo so the UI can react to offline status.

## Theme System

**Skill/Technology Used:**

- React Context: `ThemeContext`
- React Native `Appearance` API
- `ColorSchemeName` typing
- AsyncStorage persistence with `@react-native-async-storage/async-storage`
- Centralized theme tokens
- Light and dark theme objects
- Theme-aware navigation styling
- React Native `StyleSheet`
- NativeWind and Tailwind CSS configuration
- Metro integration for NativeWind

**Code Snippet:**

`src/providers/ThemeProvider.tsx`

```tsx
type ThemeContextProps = {
  theme: Theme;
  scheme: ColorSchemeName;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceScheme = Appearance.getColorScheme() ?? 'light';
  const [scheme, setScheme] = useState<ColorSchemeName>(deviceScheme);

  // Load persisted theme on mount
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('themeScheme');
      if (saved === 'dark' || saved === 'light') setScheme(saved);
    })();
  }, []);

  const toggleTheme = () => {
    const newScheme = scheme === 'dark' ? 'light' : 'dark';
    setScheme(newScheme);
    AsyncStorage.setItem('themeScheme', newScheme);
  };

  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, scheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

`src/theme/tokens.ts`

```ts
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
```

`metro.config.js`

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

**Explanation:**

The app uses a theme provider to expose the active visual system to all screens. The provider reads the device color scheme with `Appearance.getColorScheme()`, loads a saved theme preference from AsyncStorage, and exposes `toggleTheme()` for profile/settings screens. Components then call `useTheme()` to access `theme`, `scheme`, and `toggleTheme`.

Theme values are centralized in `src/theme/tokens.ts`. Light theme values reuse the base constants, while the dark theme defines its own backgrounds, surfaces, text colors, borders, and tab bar styling. The project also includes NativeWind and Tailwind configuration for utility-based styling support, with Metro configured to process `global.css`.

## Internationalization

**Skill/Technology Used:**

- Custom TypeScript i18n module
- Locale union type: `'en' | 'hi'`
- Typed translation keys with `keyof typeof translations.en`
- `as const` translation dictionary
- Custom `useTranslation()` hook
- Zustand profile language as the locale source
- Hindi and English translation dictionaries
- Profile/settings language update through `updateProfile`

**Code Snippet:**

`src/i18n/index.ts`

```ts
export type Locale = 'en' | 'hi';

const translations = {
  en: {
    dashboard: 'Dashboard',
    vehicle: 'Vehicle',
    service: 'Service',
    alerts: 'Alerts',
    profile: 'Profile',
    live: 'Live',
    updatedAgo: 'Updated 2 min ago',
    stateOfCharge: 'State of Charge',
    estRange: 'est. range',
    packTemp: 'Pack temperature',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    vehicle: 'वाहन',
    service: 'सर्विस',
    alerts: 'अलर्ट',
    profile: 'प्रोफ़ाइल',
    live: 'लाइव',
    updatedAgo: '2 मिनट पहले अपडेट',
    stateOfCharge: 'चार्ज स्थिति',
    estRange: 'अनुमानित रेंज',
    packTemp: 'पैक तापमान',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] ?? translations.en[key];
}
```

`src/hooks/useTranslation.ts`

```ts
import { useAuthStore } from '@/store/authStore';
import { t, type TranslationKey, type Locale } from '@/i18n';

export function useTranslation() {
  const language = useAuthStore((s) => s.profile?.language ?? 'en') as Locale;
  return {
    locale: language,
    t: (key: TranslationKey) => t(language, key),
  };
}
```

`src/app/(customer)/settings.tsx`

```tsx
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
```

**Explanation:**

Internationalization is implemented as a small in-repository TypeScript system rather than through an external i18n library. The supported locale values are defined by the `Locale` union, and valid translation keys are derived from the English dictionary with `keyof typeof translations.en`. This gives compile-time protection against invalid translation keys.

The `useTranslation()` hook reads `profile.language` from the auth store and returns a localized `t()` function. Profile screens update the language by calling `updateProfile({ language: 'hi' })` or `updateProfile({ language: 'en' })`. Any screen using the translation hook can then render labels based on the selected language.

## Complete Skills Summary

- TypeScript
- TSX
- JavaScript
- JSON
- CSS
- Markdown documentation
- React 19.2.3
- React hooks: `useState`, `useEffect`, `useRef`, `useContext`
- React Context API
- React Native 0.85.3
- Expo SDK 56
- Expo Router 56.2.11
- Expo file-based routing
- Expo route groups
- Expo Stack navigation
- Expo Tabs navigation
- Expo Redirects
- Expo typed routes through `app.json`
- Expo StatusBar
- Expo SplashScreen
- Expo Font
- Expo Haptics
- Expo LinearGradient
- Expo Blur dependency
- Expo Constants dependency
- Expo Linking dependency
- Expo CLI scripts
- Zustand 5
- AsyncStorage
- NetInfo
- React Native Gesture Handler
- React Native Screens
- React Native Safe Area Context
- React Native Reanimated 4
- React Native Worklets
- React Native SVG
- React Native Gifted Charts
- Lucide React Native icons
- NativeWind
- Tailwind CSS
- Metro bundler configuration
- Babel
- `babel-preset-expo`
- Reanimated Babel plugin
- Strict TypeScript configuration
- TypeScript path aliasing with `@/*`
- Mock API/service architecture
- Promise-based async data fetching
- `async`/`await`
- `setTimeout` latency and command simulation
- Typed domain models for users, vehicles, alerts, trips, documents, service jobs, and commands
- Role-based access control
- OTP-style authentication flow
- Device verification flow
- Remote command lifecycle modeling
- Network/offline state provider
- Light/dark theme provider
- Design token system
- Persistent theme preference
- Custom typed internationalization
- English and Hindi translation dictionaries
- Profile-driven locale selection
- React Native `StyleSheet`
- React Native form handling
- React Native accessibility labels
- App assets for icons, logo, splash, and vehicle imagery
- npm package management and scripts
