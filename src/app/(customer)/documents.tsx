import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, Shield, Upload } from 'lucide-react-native';
import { getDocuments } from '@/services/mockApi';
import { useVehicleStore } from '@/store/vehicleStore';
import { Badge } from '@/components/ui/Badge';
import type { Document } from '@/types/vehicle';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';
import { ScreenHeader } from '@/components/layout/ScreenHeader';

const DOC_ICONS = ['RC', 'Invoice', 'Warranty', 'Insurance', 'Service', 'PUC', 'Finance'];

export default function DocumentsScreen() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const { activeVin } = useVehicleStore();
  const [docs, setDocs] = useState<Document[]>([]);

  useEffect(() => {
    getDocuments(activeVin, 'CUSTOMER').then(setDocs);
  }, [activeVin]);

  const insurance = docs.find((d) => d.type === 'Insurance');
  const warranty = docs.find((d) => d.type === 'Warranty');

  const isExpiringSoon = (date?: string) => {
    if (!date) return false;
    const diff = new Date(date).getTime() - Date.now();
    return diff < 30 * 24 * 60 * 60 * 1000 && diff > 0;
  };

  const handleView = (doc: Document) => {
    Alert.alert('Document Viewer', `Opening ${doc.name} (mock PDF viewer).`);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Documents" fallbackPath="/(customer)" />

      <ScrollView contentContainerStyle={styles.content}>
        {insurance && (
          <View style={styles.topCard}>
            <Shield size={24} color={theme.colors.teal} />
            <View style={styles.topCardContent}>
              <Text style={styles.topCardTitle}>Insurance</Text>
              <Text style={styles.topCardSub}>{insurance.name}</Text>
              <Text style={styles.topCardExpiry}>Expires: {insurance.expiryDate}</Text>
            </View>
            {isExpiringSoon(insurance.expiryDate) && (
              <Badge label="Renew Soon" variant="amber" />
            )}
          </View>
        )}

        {warranty && (
          <View style={styles.topCard}>
            <FileText size={24} color={theme.colors.teal} />
            <View style={styles.topCardContent}>
              <Text style={styles.topCardTitle}>Warranty</Text>
              <Text style={styles.topCardSub}>2 years / 80,000 km (whichever first)</Text>
              <Text style={styles.topCardExpiry}>Expires: {warranty.expiryDate}</Text>
            </View>
          </View>
        )}

        <View style={styles.grid}>
          {docs.map((doc) => (
            <TouchableOpacity key={doc.id} style={styles.gridItem} onPress={() => handleView(doc)}>
              <FileText size={28} color={theme.colors.text2} />
              <Text style={styles.gridLabel}>{doc.type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} accessibilityLabel="Upload document">
        <Upload size={22} color={theme.colors.midnight} />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  header: { padding: 16, paddingTop: 56 },
  back: { color: theme.colors.teal, fontSize: 14, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text1 },
  content: { padding: 16, paddingBottom: 80 },
  topCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
  },
  topCardContent: { flex: 1 },
  topCardTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text1 },
  topCardSub: { fontSize: 13, color: theme.colors.text2, marginTop: 2 },
  topCardExpiry: { fontSize: 12, color: theme.colors.text3, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  gridItem: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minWidth: 72,
  },
  gridLabel: { fontSize: 10, color: theme.colors.text2, textAlign: 'center' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
