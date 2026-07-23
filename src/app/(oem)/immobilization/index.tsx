import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { getImmobilizationRequests } from '@/services/mockApi';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { ImmobilizationRequest } from '@/types/vehicle';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

export default function OemImmobilizationIndex() {
  const router = useRouter();
  const [requests, setRequests] = useState<ImmobilizationRequest[]>([]);
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    getImmobilizationRequests().then(setRequests);
  }, []);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Immobilization Review" />
      <ScrollView contentContainerStyle={styles.content}>
        {requests.map((r) => (
          <TouchableOpacity
            key={r.id}
            onPress={() => router.push(`/(oem)/immobilization/review/${r.id}`)}
          >
            <Card style={{ marginBottom: 8 }}>
              <Text style={styles.reqId}>{r.id}</Text>
              <Text style={styles.reqVin}>{r.vin}</Text>
              <Text style={styles.reqCustomer}>{r.customer}</Text>
              <Text style={styles.reqReason}>{r.reason}</Text>
              <Badge label={r.status} variant="amber" />
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  content: { padding: 16, paddingTop: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text1, marginBottom: 16 },
  reqId: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 11, color: theme.colors.text3 },
  reqVin: { fontSize: 14, fontWeight: '600', color: theme.colors.teal, marginTop: 4 },
  reqCustomer: { fontSize: 14, color: theme.colors.text1, marginTop: 2 },
  reqReason: { fontSize: 13, color: theme.colors.text2, marginTop: 4, marginBottom: 8 },
});
