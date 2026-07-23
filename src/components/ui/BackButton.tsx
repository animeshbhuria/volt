import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';

interface BackButtonProps {
  onPress?: () => void;
  fallbackPath?: string;
  size?: number;
  style?: any;
}

export function BackButton({ onPress, fallbackPath, size = 18, style }: BackButtonProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else if (fallbackPath) {
        router.replace(fallbackPath as any);
      } else {
        router.replace('/');
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.btn,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      accessibilityLabel="Go back"
      activeOpacity={0.7}
    >
      <ArrowLeft size={size} color={theme.colors.text1} strokeWidth={2.5} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      default: {
        // Fallback or web
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
    }),
  },
});
