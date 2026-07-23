import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { getDealerVehicles } from '@/services/mockApi';
import { StatusDot } from '@/components/ui/StatusDot';
import { Card } from '@/components/ui/Card';
import type { DealerVehicle } from '@/types/vehicle';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

const FILTER_OPTIONS = ['All', 'Online', 'Fault', 'Offline', 'In Service'] as const;
type FilterType = typeof FILTER_OPTIONS[number];

export default function DealerVehiclesScreen() {
  const [vehicles, setVehicles] = useState<DealerVehicle[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    getDealerVehicles().then(setVehicles);
  }, []);

  const filteredVehicles = vehicles.filter((v) => {
    if (selectedFilter === 'All') return true;
    return v.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <View style={styles.container}>
      <ScreenHeader title="Fleet Vehicles" />
      
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          {FILTER_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.filterPill,
                selectedFilter === opt && styles.filterPillActive,
              ]}
              onPress={() => setSelectedFilter(opt)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === opt && styles.filterTextActive,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filteredVehicles.map((v) => (
          <Card key={v.vin} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.vin}>{v.vin}</Text>
              <StatusDot
                status={
                  v.status === 'Online'
                    ? 'online'
                    : v.status === 'Fault'
                      ? 'fault'
                      : v.status === 'In Service'
                        ? 'charging'
                        : 'offline'
                }
              />
            </View>
            <Text style={styles.customer}>{v.customerName}</Text>
            <View style={styles.meta}>
              <Text style={styles.soc}>SOC {v.soc}%</Text>
              <Text style={styles.seen}>{v.lastSeen}</Text>
              <Text style={styles.status}>{v.status}</Text>
            </View>
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
  filterWrapper: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface2,
  },
  filterPillActive: {
    backgroundColor: theme.colors.tealDim,
    borderColor: theme.colors.teal,
  },
  filterText: {
    fontSize: 12,
    color: theme.colors.text2,
    fontWeight: '500',
  },
  filterTextActive: {
    color: theme.colors.teal,
    fontWeight: '700',
  },
  card: { marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vin: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: theme.colors.teal },
  customer: { fontSize: 16, fontWeight: '600', color: theme.colors.text1, marginTop: 4 },
  meta: { flexDirection: 'row', gap: 12, marginTop: 8 },
  soc: { fontSize: 13, color: theme.colors.text2 },
  seen: { fontSize: 13, color: theme.colors.text3 },
  status: { fontSize: 13, color: theme.colors.teal },
});
