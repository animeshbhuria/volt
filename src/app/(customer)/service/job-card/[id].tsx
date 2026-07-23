import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { getServiceJobs } from '@/services/mockApi';
import { useVehicleStore } from '@/store/vehicleStore';
import { useEffect, useState } from 'react';
import type { ServiceJob } from '@/types/vehicle';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

export default function JobCardDetail() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activeVin } = useVehicleStore();
  const [job, setJob] = useState<ServiceJob | null>(null);

  useEffect(() => {
    getServiceJobs(activeVin).then((jobs) => {
      setJob(jobs.find((j) => j.id === id) ?? null);
    });
  }, [id, activeVin]);

  if (!job) return null;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Job Card" fallbackPath="/(customer)/service" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.id}>{job.id}</Text>
        <Text style={styles.status}>{job.status}</Text>
        <Text style={styles.label}>DEALER</Text>
        <Text style={styles.value}>{job.dealer}</Text>
        <Text style={styles.label}>ADVISOR</Text>
        <Text style={styles.value}>{job.advisor ?? '—'}</Text>
        <Text style={styles.label}>SERVICE TYPE</Text>
        <Text style={styles.value}>{job.serviceType}</Text>
        <Text style={styles.label}>KM AT SERVICE</Text>
        <Text style={styles.value}>{job.kmAtService.toLocaleString()} km</Text>
        {job.description && (
          <>
            <Text style={styles.label}>NOTES</Text>
            <Text style={styles.value}>{job.description}</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  content: { padding: 16 },
  id: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 14, color: theme.colors.teal },
  status: { fontSize: 20, fontWeight: '700', color: theme.colors.text1, marginBottom: 24 },
  label: { fontSize: 11, color: theme.colors.text2, letterSpacing: 1, marginTop: 16, marginBottom: 4 },
  value: { fontSize: 16, color: theme.colors.text1 },
});
