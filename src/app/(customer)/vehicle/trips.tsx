import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Download, ChevronRight } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { EfficiencyTrendChart } from '@/components/charts/EfficiencyTrendChart';
import { TripHistoryChart } from '@/components/charts/TripHistoryChart';
import { formatTripDuration } from '@/services/mockTrips';
import { useTranslation } from '@/hooks/useTranslation';
import { MetricTile } from '@/components/ui/MetricTile';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { getTripHistory, getEfficiencyData } from '@/services/mockApi';
import { useVehicleStore } from '@/store/vehicleStore';
import type { Trip } from '@/types/vehicle';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

type Range = '7d' | '30d' | '90d';

export default function TripsScreen() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const { activeVin } = useVehicleStore();
  const [range, setRange] = useState<Range>('30d');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [efficiency, setEfficiency] = useState<{ date: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tripData, effData] = await Promise.all([
        getTripHistory(activeVin, range),
        getEfficiencyData(range),
      ]);
      setTrips(tripData);
      setEfficiency(effData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load trips');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [range, activeVin]);

  const totalDistance = trips.reduce((s, t) => s + t.distance, 0);
  const totalEnergy = trips.reduce((s, t) => s + t.energyUsed, 0);
  const avgEff =
    trips.length > 0
      ? trips.reduce((s, t) => s + t.efficiency, 0) / trips.length
      : 0;

  const grouped = trips.reduce<Record<string, Trip[]>>((acc, t) => {
    if (!acc[t.date]) acc[t.date] = [];
    acc[t.date].push(t);
    return acc;
  }, {});

  const dailyDistance = trips.reduce<Record<string, number>>((acc, trip) => {
    acc[trip.date] = (acc[trip.date] ?? 0) + trip.distance;
    return acc;
  }, {});
  const tripChartData = Object.entries(dailyDistance).map(([date, value]) => ({ date, value }));

  const handleExport = () => {
    Alert.alert('Export', 'Preparing report...', [{ text: 'OK' }]);
    setTimeout(() => Alert.alert('Success', 'Report ready for download (mock).'), 1500);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t('myTrips')}
        fallbackPath="/(customer)/vehicle"
        style={{ borderBottomWidth: 0 }}
        right={
          <TouchableOpacity onPress={handleExport} accessibilityLabel="Export trips">
            <Download size={22} color={theme.colors.teal} />
          </TouchableOpacity>
        }
      />

      <View style={styles.filterRow}>
        {(['7d', '30d', '90d'] as Range[]).map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.filterPill, range === r && styles.filterPillActive]}
            onPress={() => setRange(r)}
          >
            <Text style={[styles.filterText, range === r && styles.filterTextActive]}>
              {r === '7d' ? '7D' : r === '30d' ? '30D' : '90D'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading ? (
        <SkeletonCard />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <MetricTile label="Distance" value={totalDistance.toFixed(0)} unit="km" />
            <MetricTile label="Energy" value={totalEnergy.toFixed(1)} unit="kWh" />
            <MetricTile label="Efficiency" value={avgEff.toFixed(1)} unit="Wh/km" />
          </ScrollView>

          <Text style={styles.chartTitle}>DAILY DISTANCE</Text>
          <TripHistoryChart data={tripChartData} />

          <Text style={styles.chartTitle}>EFFICIENCY TREND</Text>
          <EfficiencyTrendChart data={efficiency} />

          {Object.entries(grouped).map(([date, dateTrips]) => (
            <View key={date}>
              <Text style={styles.dateHeader}>{date}</Text>
              {dateTrips.map((trip) => (
                <TouchableOpacity key={trip.id} style={styles.tripCard}>
                  <Text style={styles.tripTime}>
                    {trip.startTime} – {trip.endTime}
                  </Text>
                  <View style={styles.tripMain}>
                    <Text style={styles.tripDistance}>{trip.distance} km</Text>
                    <Text style={styles.tripDuration}>
                      {formatTripDuration(trip.startTime, trip.endTime)}
                    </Text>
                    <ChevronRight size={16} color={theme.colors.text2} />
                  </View>
                  <Text style={styles.tripMeta}>
                    {trip.energyUsed} kWh · ₹{trip.costEstimate.toFixed(2)} · {trip.efficiency} Wh/km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterPillActive: { backgroundColor: theme.colors.teal, borderColor: theme.colors.teal },
  filterText: { fontSize: 13, color: theme.colors.text2 },
  filterTextActive: { color: theme.colors.midnight, fontWeight: '600' },
  content: { padding: 16, paddingBottom: 32 },
  chartTitle: {
    fontSize: 11,
    color: theme.colors.text2,
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 4,
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text2,
    marginTop: 16,
    marginBottom: 8,
  },
  tripCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  tripTime: { fontSize: 12, color: theme.colors.text2 },
  tripMain: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  tripDistance: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 18,
    color: theme.colors.text1,
    flex: 1,
  },
  tripDuration: { fontSize: 13, color: theme.colors.text2 },
  tripMeta: {
    fontSize: 12,
    color: theme.colors.text2,
    fontFamily: 'JetBrainsMono_400Regular',
    marginTop: 4,
  },
});
