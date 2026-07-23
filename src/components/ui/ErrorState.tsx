import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: theme.colors.text2 }]}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={[styles.retry, { borderColor: theme.colors.teal }]}
        >
          <Text style={[styles.retryText, { color: theme.colors.teal }]}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  retry: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  retryText: {
    fontWeight: '600',
  },
});
