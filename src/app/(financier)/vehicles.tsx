import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { getDealerVehicles } from '@/services/mockApi';
import { Card } from '@/components/ui/Card';
import type { DealerVehicle } from '@/types/vehicle';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

type FilterType = 'online' | 'fault' | 'offline' | 'in service' | 'all';
const filters: FilterType[] = ['all', 'online', 'fault', 'offline', 'in service'];

export default function FinancierVehiclesScreen() {
  const [vehicles, setVehicles] = useState<DealerVehicle[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    getDealerVehicles().then(setVehicles);
  }, []);

  const filteredVehicles = vehicles.filter((v) => {
    if (selectedFilter === 'all') return true;
    return v.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <View style={styles.container}>
      <ScreenHeader title="Financed Vehicles" />
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Status Filter buttons */}
        <ScrollView 
          horizontal 
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false} 
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterButton,
                selectedFilter === f && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === f && styles.filterTextActive
              ]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredVehicles.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No vehicles with status "{selectedFilter}"</Text>
          </Card>
        ) : (
          filteredVehicles.map((v) => (
            <Card key={v.vin} style={styles.card}>
              <Text style={styles.vin}>{v.vin}</Text>
              <Text style={styles.customer}>{v.customerName}</Text>
              <Text style={styles.meta}>SOC {v.soc}% · {v.lastSeen} · {v.status}</Text>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  content: { padding: 16, paddingTop: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text1, marginBottom: 16 },
  filterContainer: {
    marginBottom: 16,
    flexGrow: 0,
  },
  filterContent: {
    gap: 8,
    paddingRight: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.teal,
    borderColor: theme.colors.teal,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text2,
    textTransform: 'capitalize',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  card: { marginBottom: 8 },
  vin: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: theme.colors.teal },
  customer: { fontSize: 16, fontWeight: '600', color: theme.colors.text1, marginTop: 4 },
  meta: { fontSize: 13, color: theme.colors.text2, marginTop: 4 },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text2,
  },
});
