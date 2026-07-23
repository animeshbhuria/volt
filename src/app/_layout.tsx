import React from 'react';
import { Alert, Animated, View, Text, StyleSheet, Platform } from 'react-native';
import '../../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NetworkProvider } from '@/providers/NetworkProvider';
import { OfflineBanner } from '@/components/layout/OfflineBanner';
import { colors } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { ThemeProvider, useTheme } from '@/providers/ThemeProvider';

// Suppress React 19 + React Native Web console warning logs about unknown responder event properties
if (Platform.OS === 'web') {
  // Polyfill Alert.alert for web compatibility
  Alert.alert = (title, message, buttons) => {
    const text = message ? `${title}\n\n${message}` : String(title);
    if (buttons && buttons.length > 0) {
      const confirmButton = buttons.find(b => b.style !== 'cancel');
      const cancelButton = buttons.find(b => b.style === 'cancel');
      
      const confirmed = window.confirm(text);
      if (confirmed) {
        if (confirmButton && confirmButton.onPress) {
          confirmButton.onPress();
        }
      } else {
        if (cancelButton && cancelButton.onPress) {
          cancelButton.onPress();
        }
      }
    } else {
      window.alert(text);
    }
  };

  const originalError = console.error;
  console.error = (...args: any[]) => {
    const msg = args[0];
    if (
      typeof msg === 'string' &&
      (msg.includes('Unknown event handler property') ||
        msg.includes('onStartShouldSetResponder') ||
        msg.includes('onResponder') ||
        msg.includes('onPressOut'))
    ) {
      return;
    }
    originalError(...args);
  };

  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const msg = args[0];
    if (
      typeof msg === 'string' &&
      (msg.includes('"shadow*" style props') ||
        msg.includes('useNativeDriver') ||
        msg.includes('RCTAnimation'))
    ) {
      return;
    }
    originalWarn(...args);
  };
}

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
        } else {
          const role = user?.role;
          if (role === 'CUSTOMER' && rootSegment !== '(customer)') {
            router.replace('/(customer)');
          } else if (role === 'DEALER' && rootSegment !== '(dealer)') {
            router.replace('/(dealer)');
          } else if (role === 'FINANCIER' && rootSegment !== '(financier)') {
            router.replace('/(financier)');
          } else if (role === 'VOLT' && rootSegment !== '(oem)') {
            router.replace('/(oem)');
          }
        }
      }
    }
  }, [isAuthenticated, deviceVerified, user, segments]);

  return null;
}

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { scheme } = useTheme();
  return (
    <NetworkProvider>
      <OfflineBanner />
      <NavigationGuard />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="(dealer)" />
        <Stack.Screen name="(financier)" />
        <Stack.Screen name="(oem)" />
      </Stack>
    </NetworkProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  const splashScale = React.useRef(new Animated.Value(0.8)).current;
  const splashOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!fontsLoaded) return;
    Animated.parallel([
      Animated.timing(splashOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(splashScale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => SplashScreen.hideAsync(), 300);
    });
  }, [fontsLoaded, splashOpacity, splashScale]);

  if (!fontsLoaded) {
    return (
      <View style={splashStyles.container}>
        <Animated.View style={{ opacity: splashOpacity, transform: [{ scale: splashScale }] }}>
          <Text style={splashStyles.volt}>VOLT</Text>
          <Text style={splashStyles.mobility}>Mobility</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volt: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.text1,
    textAlign: 'center',
  },
  mobility: {
    fontSize: 16,
    color: colors.teal,
    textAlign: 'center',
    fontWeight: '600',
  },
});
