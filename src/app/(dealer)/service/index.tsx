import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

export default function DealerServiceScreen() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');

  return (
    <View style={styles.container}>
      <ScreenHeader title="Service" />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push('/(dealer)/service/create-job')}
        >
          <Text style={styles.createBtnText}>+ Create Job Card</Text>
        </TouchableOpacity>

        <Card style={{ marginTop: 16 }}>
          <Text style={styles.jobId}>JC-2025-0012</Text>
          <Text style={styles.jobCustomer}>Ramesh Kumar · RJ14EV0042</Text>
          <Text style={styles.jobIssue}>Charging issue at home</Text>
          <Badge label="In Progress" variant="amber" />
        </Card>

        <Card style={{ marginTop: 8 }}>
          <Text style={styles.jobId}>JC-2025-0008</Text>
          <Text style={styles.jobCustomer}>Amit Jain · RJ14EV0912</Text>
          <Text style={styles.jobIssue}>BMS fault — thermal warning</Text>
          <Badge label="Received" variant="teal" />
        </Card>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  content: { padding: 16, paddingTop: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text1, marginBottom: 16 },
  createBtn: {
    backgroundColor: theme.colors.teal,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  createBtnText: { fontSize: 15, fontWeight: '600', color: theme.colors.midnight },
  jobId: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: theme.colors.teal },
  jobCustomer: { fontSize: 15, fontWeight: '600', color: theme.colors.text1, marginTop: 4 },
  jobIssue: { fontSize: 13, color: theme.colors.text2, marginTop: 4, marginBottom: 8 },
});
