import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

export default function CreateJobScreen() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const [vin, setVin] = useState('');
  const [issue, setIssue] = useState('');

  const handleCreate = () => {
    Alert.alert('Job Card Created', 'JC-2025-0015');
    router.back();
  };

  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');

  return (
    <View style={styles.container}>
      <ScreenHeader title="Create Job Card" fallbackPath="/(dealer)/service" />
      <View style={styles.content}>
        <Text style={styles.label}>VIN</Text>
        <TextInput style={styles.input} value={vin} onChangeText={setVin} placeholder="VOLT1EV..." placeholderTextColor={theme.colors.text3} />
        <Text style={styles.label}>ISSUE SUMMARY</Text>
        <TextInput style={styles.textarea} value={issue} onChangeText={setIssue} multiline placeholder="Describe issue..." placeholderTextColor={theme.colors.text3} />
        <Button title="Create Job Card" onPress={handleCreate} />
      </View>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  content: { padding: 16, paddingTop: 16 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text1, marginBottom: 24 },
  label: { fontSize: 11, color: theme.colors.text2, letterSpacing: 1, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: theme.colors.surface2, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, padding: 12, color: theme.colors.text1 },
  textarea: { backgroundColor: theme.colors.surface2, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, padding: 12, color: theme.colors.text1, minHeight: 100, textAlignVertical: 'top' },
});
