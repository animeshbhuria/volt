import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { useAlertStore } from '@/store/alertStore';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

export default function OemAlertsScreen() {
  const { alerts, fetchAlerts } = useAlertStore();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    fetchAlerts('oem', 'VOLT');
  }, [fetchAlerts]);

  const critical = alerts.filter((a) => a.severity === 'critical' || a.severity === 'warning');

  return (
    <View style={styles.container}>
      <ScreenHeader title="Fleet Alerts" />
      <ScrollView contentContainerStyle={styles.content}>
        {critical.map((a) => (
          <Card
            key={a.id}
            accentColor={a.severity === 'critical' ? theme.colors.red : theme.colors.amber}
            style={{ marginBottom: 8 }}
          >
            <Text style={styles.alertTitle}>{a.title}</Text>
            <Text style={styles.alertDesc}>{a.description}</Text>
            {a.vin && <Text style={styles.vin}>{a.vin}</Text>}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  content: { padding: 16, paddingTop: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text1, marginBottom: 16 },
  alertTitle: { fontSize: 15, fontWeight: '600', color: theme.colors.text1 },
  alertDesc: { fontSize: 13, color: theme.colors.text2, marginTop: 4 },
  vin: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 11, color: theme.colors.teal, marginTop: 8 },
});
