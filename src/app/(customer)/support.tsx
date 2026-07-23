import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Phone, Camera } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getSupportTickets } from '@/services/mockApi';
import type { SupportTicket } from '@/types/vehicle';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';
import { ScreenHeader } from '@/components/layout/ScreenHeader';

const CATEGORIES = ['Breakdown', 'Charging Issue', 'Service Complaint', 'Billing', 'Other'];

export default function SupportScreen() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getSupportTickets().then(setTickets);
  }, []);

  const handleRSA = () => {
    Alert.alert(
      'Share Location',
      'Share your live location with support team?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Share & Request',
          onPress: () => {
            Alert.alert(
              'Assistance Requested',
              'Help is on the way. Ticket #RSA-2025-00421',
            );
          },
        },
      ],
    );
  };

  const handleSubmitTicket = () => {
    Alert.alert('Ticket Created', 'TKT-2025-00848 — We will update you shortly.');
    setShowForm(false);
    setDescription('');
  };

  const statusVariant = (status: string) => {
    if (status === 'Resolved') return 'green';
    if (status === 'In Progress') return 'amber';
    return 'teal';
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Support" fallbackPath="/(customer)" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.rsaCard}>
          <Phone size={32} color={theme.colors.amber} />
          <Text style={styles.rsaTitle}>Need help on the road?</Text>
          <Text style={styles.rsaSub}>24/7 Roadside Assistance</Text>
          <Button title="One-Tap RSA" onPress={handleRSA} style={{ marginTop: 16 }} />
        </View>

        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={styles.sectionTitle}>Raise a Ticket</Text>
        </TouchableOpacity>

        {showForm && (
          <View style={styles.form}>
            <Text style={styles.label}>CATEGORY</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.catPill, category === c && styles.catPillActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.catText, category === c && styles.catTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.label}>DESCRIPTION</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Describe your issue..."
              placeholderTextColor={theme.colors.text3}
              multiline
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity style={styles.photoBtn}>
              <Camera size={18} color={theme.colors.text2} />
              <Text style={styles.photoText}>Add Photo (mock)</Text>
            </TouchableOpacity>
            <Button title="Submit Ticket" onPress={handleSubmitTicket} />
          </View>
        )}

        <Text style={styles.sectionTitle}>My Tickets</Text>
        {tickets.map((ticket) => (
          <View key={ticket.id} style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketId}>{ticket.id}</Text>
              <Badge label={ticket.status} variant={statusVariant(ticket.status)} />
            </View>
            <Text style={styles.ticketCat}>{ticket.category}</Text>
            <Text style={styles.ticketDesc}>{ticket.description}</Text>
            <Text style={styles.ticketTime}>
              Updated {ticket.lastUpdate.toLocaleDateString('en-IN')}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  header: { padding: 16, paddingTop: 56 },
  back: { color: theme.colors.teal, fontSize: 14, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text1 },
  content: { padding: 16, paddingBottom: 32 },
  rsaCard: {
    backgroundColor: theme.colors.amber + '15',
    borderWidth: 1,
    borderColor: theme.colors.amber + '40',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  rsaTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text1, marginTop: 12 },
  rsaSub: { fontSize: 13, color: theme.colors.text2, marginTop: 4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text1,
    marginBottom: 12,
    marginTop: 8,
  },
  form: { marginBottom: 24 },
  label: { fontSize: 11, color: theme.colors.text2, letterSpacing: 1, marginBottom: 8, marginTop: 8 },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 8,
  },
  catPillActive: { backgroundColor: theme.colors.teal, borderColor: theme.colors.teal },
  catText: { fontSize: 12, color: theme.colors.text2 },
  catTextActive: { color: theme.colors.midnight, fontWeight: '600' },
  textarea: {
    backgroundColor: theme.colors.surface2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    color: theme.colors.text1,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    marginBottom: 12,
  },
  photoText: { fontSize: 13, color: theme.colors.text2 },
  ticketCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketId: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 13, color: theme.colors.teal },
  ticketCat: { fontSize: 14, fontWeight: '600', color: theme.colors.text1, marginTop: 8 },
  ticketDesc: { fontSize: 13, color: theme.colors.text2, marginTop: 4 },
  ticketTime: { fontSize: 11, color: theme.colors.text3, marginTop: 8 },
});
