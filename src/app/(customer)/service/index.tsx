import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { getServiceJobs, submitServiceRequest, MOCK_DEALERS, getAppointmentSlots } from '@/services/mockApi';
import { useVehicleStore } from '@/store/vehicleStore';
import type { ServiceJob } from '@/types/vehicle';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';
import { useAuthStore } from '@/store/authStore';
import { Check, ChevronRight } from 'lucide-react-native';

const STEPS = ['Received', 'In Progress', 'Ready', 'Delivered'];

export default function ServiceScreen() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const { activeVin } = useVehicleStore();
  const { profile } = useAuthStore();
  const [jobs, setJobs] = useState<ServiceJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookSheet, setBookSheet] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(MOCK_DEALERS[0].id);
  const [serviceType, setServiceType] = useState<'Routine' | 'Complaint' | 'Warranty'>('Routine');
  const [description, setDescription] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getServiceJobs(activeVin).then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, [activeVin]);

  useEffect(() => {
    if (bookSheet) {
      getAppointmentSlots(selectedDealer).then((s) => {
        setSlots(s);
        setSelectedSlot(s[0] ?? '');
      });
    }
  }, [bookSheet, selectedDealer]);

  const activeJob = jobs.find((j) => j.status !== 'Closed');
  const history = jobs.filter((j) => j.status === 'Closed');

  const getStepIndex = (status: string) => {
    if (status === 'Closed') return 4;
    return STEPS.indexOf(status);
  };

  useEffect(() => {
    if (activeJob) {
      const stepIndex = getStepIndex(activeJob.status);
      const targetPercent = (stepIndex / (STEPS.length - 1)) * 100;
      
      Animated.timing(progressAnim, {
        toValue: targetPercent,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [activeJob?.status]);

  const handleSubmit = async () => {
    await submitServiceRequest({
      dealerId: selectedDealer,
      date: new Date().toISOString().split('T')[0],
      serviceType,
      description,
      vin: activeVin,
    });
    setBookSheet(false);
    setDescription('');
  };

  const getStepTimestamp = (jobDate: string, index: number) => {
    const times = ['09:30 AM', '11:15 AM', '02:45 PM', '04:30 PM'];
    return times[index] || '';
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Service" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.dueBanner}>
          <Text style={styles.dueText}>
            Service Due in 320 km or 14 days. Book now →
          </Text>
        </View>

        {loading ? (
          <SkeletonCard />
        ) : activeJob ? (
          <View style={styles.activeCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardHeaderLabel}>ACTIVE SERVICE</Text>
                <Text style={styles.cardJobId}>{activeJob.id}</Text>
              </View>
              <Badge label={activeJob.status} variant="teal" />
            </View>

            <View style={styles.stepperContainer}>
              <View style={styles.trackWrapper}>
                <View style={styles.lineBackground} />
                <Animated.View
                  style={[
                    styles.lineActive,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>

              <View style={styles.nodesContainer}>
                {STEPS.map((step, i) => {
                  const stepIndex = getStepIndex(activeJob.status);
                  const isCompleted = i < stepIndex;
                  const isCurrent = i === stepIndex;
                  const isFuture = i > stepIndex;

                  return (
                    <View key={step} style={styles.stepNode}>
                      <View style={styles.nodeWrapper}>
                        {isCompleted && (
                          <View style={styles.nodeCompleted}>
                            <Check size={12} color="#FFFFFF" strokeWidth={3} />
                          </View>
                        )}
                        {isCurrent && (
                          <View style={styles.nodeCurrentOuter}>
                            <View style={styles.nodeCurrentInner} />
                          </View>
                        )}
                        {isFuture && (
                          <View style={styles.nodeFuture} />
                        )}
                      </View>

                      <Text
                        style={[
                          styles.stepLabel,
                          (isCompleted || isCurrent) && styles.stepLabelActive,
                          isCurrent && styles.stepLabelCurrent,
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                      >
                        {step}
                      </Text>

                      {(isCompleted || isCurrent) && (
                        <Text style={styles.stepTimestamp}>
                          {getStepTimestamp(activeJob.date, i)}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.metadataStrip}>
              <View style={styles.metaColumn}>
                <Text style={styles.metaLabel}>CUSTOMER</Text>
                <Text style={styles.metaValue}>{profile?.name || 'Customer'}</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaColumn}>
                <Text style={styles.metaLabel}>DEALER</Text>
                <Text style={styles.metaValue}>{activeJob.dealer}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => router.push(`/(customer)/service/job-card/${activeJob.id}`)}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
              <ChevronRight size={14} color={theme.colors.teal} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        ) : null}

        <Button title="Book Service" onPress={() => setBookSheet(true)} style={{ marginBottom: 24 }} />

        <Text style={styles.sectionLabel}>SERVICE HISTORY</Text>
        {history.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={styles.historyCard}
            onPress={() => setExpandedId(expandedId === job.id ? null : job.id)}
          >
            <View style={styles.historyHeader}>
              <Text style={styles.historyDate}>{job.date}</Text>
              <Badge label={job.status} variant="grey" />
            </View>
            <Text style={styles.historyDealer}>{job.dealer} · {job.serviceType}</Text>
            <Text style={styles.historyKm}>{job.kmAtService.toLocaleString()} km</Text>
            {expandedId === job.id && job.description && (
              <Text style={styles.expandedDesc}>{job.description}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomSheet visible={bookSheet} onClose={() => setBookSheet(false)} title="Book Service">
        <Text style={styles.fieldLabel}>DEALER</Text>
        {MOCK_DEALERS.map((d) => (
          <TouchableOpacity
            key={d.id}
            style={[styles.dealerOption, selectedDealer === d.id && styles.dealerOptionActive]}
            onPress={() => setSelectedDealer(d.id)}
          >
            <Text style={styles.dealerName}>{d.name}</Text>
            <Text style={styles.dealerLoc}>{d.location}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.fieldLabel}>APPOINTMENT SLOT</Text>
        <View style={styles.slotRow}>
          {slots.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[styles.slotPill, selectedSlot === slot && styles.slotPillActive]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.fieldLabel}>SERVICE TYPE</Text>
        <View style={styles.typeRow}>
          {(['Routine', 'Complaint', 'Warranty'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typePill, serviceType === t && styles.typePillActive]}
              onPress={() => setServiceType(t)}
            >
              <Text style={[styles.typeText, serviceType === t && styles.typeTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.fieldLabel}>DESCRIPTION</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Describe the issue or service needed..."
          placeholderTextColor={theme.colors.text3}
          multiline
          value={description}
          onChangeText={setDescription}
        />
        <Button title="Submit Request" onPress={handleSubmit} />
      </BottomSheet>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  content: { padding: 16, paddingTop: 16, paddingBottom: 32 },
  dueBanner: {
    backgroundColor: theme.colors.amber + '20',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.amber,
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  dueText: { color: theme.colors.amber, fontSize: 14 },
  activeCard: {
    backgroundColor: scheme === 'dark' ? theme.colors.surface : '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: scheme === 'dark' ? theme.colors.border : '#E5E7EB',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cardHeaderLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardJobId: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 16,
    fontWeight: '700',
    color: scheme === 'dark' ? theme.colors.text1 : '#111827',
  },
  stepperContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  trackWrapper: {
    position: 'absolute',
    left: 36,
    right: 36,
    top: 14,
    height: 4,
    zIndex: 1,
  },
  lineBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: scheme === 'dark' ? theme.colors.border : '#E5E7EB',
    borderRadius: 2,
  },
  lineActive: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.colors.teal,
    borderRadius: 2,
  },
  nodesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 3,
  },
  stepNode: {
    width: 72,
    alignItems: 'center',
  },
  nodeWrapper: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  nodeCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeCurrentOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.teal,
    backgroundColor: theme.colors.tealDim,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  nodeCurrentInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.teal,
  },
  nodeFuture: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: scheme === 'dark' ? theme.colors.border : '#E5E7EB',
    backgroundColor: scheme === 'dark' ? theme.colors.surface : '#F9FAFB',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: scheme === 'dark' ? theme.colors.text1 : '#111827',
    fontWeight: '600',
  },
  stepLabelCurrent: {
    color: theme.colors.teal,
    fontWeight: '700',
  },
  stepTimestamp: {
    fontSize: 7.5,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  metadataStrip: {
    flexDirection: 'row',
    backgroundColor: scheme === 'dark' ? theme.colors.surface2 : '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: scheme === 'dark' ? theme.colors.border : '#F3F4F6',
  },
  metaColumn: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '500',
    color: scheme === 'dark' ? theme.colors.text1 : '#111827',
  },
  metaDivider: {
    width: 1,
    backgroundColor: scheme === 'dark' ? theme.colors.border : '#E5E7EB',
    marginHorizontal: 12,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.teal,
    marginRight: 4,
  },
  sectionLabel: {
    fontSize: 11,
    color: theme.colors.text2,
    letterSpacing: 1,
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyDate: { fontSize: 14, color: theme.colors.text1, fontWeight: '600' },
  historyDealer: { fontSize: 13, color: theme.colors.text2, marginTop: 4 },
  historyKm: { fontSize: 12, color: theme.colors.text3, marginTop: 2 },
  expandedDesc: { fontSize: 13, color: theme.colors.text2, marginTop: 8, lineHeight: 18 },
  fieldLabel: {
    fontSize: 11,
    color: theme.colors.text2,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 12,
  },
  dealerOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  dealerOptionActive: { borderColor: theme.colors.teal },
  dealerName: { fontSize: 14, color: theme.colors.text1 },
  dealerLoc: { fontSize: 12, color: theme.colors.text2 },
  typeRow: { flexDirection: 'row', gap: 8 },
  typePill: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  typePillActive: { borderColor: theme.colors.teal, backgroundColor: theme.colors.tealDim },
  typeText: { fontSize: 12, color: theme.colors.text2 },
  typeTextActive: { color: theme.colors.teal },
  slotRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  slotPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  slotPillActive: { borderColor: theme.colors.teal, backgroundColor: theme.colors.tealDim },
  slotText: { fontSize: 12, color: theme.colors.text2 },
  slotTextActive: { color: theme.colors.teal, fontWeight: '600' },
  textarea: {
    backgroundColor: theme.colors.surface2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    color: theme.colors.text1,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
});
