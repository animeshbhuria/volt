import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Check, X } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getImmobilizationRequests } from '@/services/mockApi';
import type { ImmobilizationRequest } from '@/types/vehicle';
import { radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

const REASONS = ['Payment Default', 'Approved Recovery'];

interface RequestTrackerProps {
  status: string;
  steps: string[];
}

function RequestTracker({ status, steps }: RequestTrackerProps) {
  const stepIndex = steps.indexOf(status === 'Rejected' ? 'Under Review' : status);
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (stepIndex >= 0) {
      const targetPercent = (stepIndex / (steps.length - 1)) * 100;
      Animated.timing(progressAnim, {
        toValue: targetPercent,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [stepIndex]);

  return (
    <View style={trackerStyles.stepperContainer}>
      <View style={trackerStyles.trackWrapper}>
        <View style={trackerStyles.lineBackground} />
        <Animated.View
          style={[
            trackerStyles.lineActive,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: status === 'Rejected' ? '#DC2626' : '#005BFF',
            },
          ]}
        />
      </View>

      <View style={trackerStyles.nodesContainer}>
        {steps.map((step, i) => {
          const isCompleted = i < stepIndex;
          const isCurrent = i === stepIndex;
          const isFuture = i > stepIndex;

          return (
            <View key={step} style={trackerStyles.stepNode}>
              <View style={trackerStyles.nodeWrapper}>
                {isCompleted && (
                  <View style={trackerStyles.nodeCompleted}>
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
                {isCurrent && (
                  <View style={[trackerStyles.nodeCurrentOuter, status === 'Rejected' && trackerStyles.nodeCurrentOuterFailed]}>
                    {status === 'Rejected' ? (
                      <X size={14} color="#FFFFFF" strokeWidth={3} />
                    ) : (
                      <View style={trackerStyles.nodeCurrentInner} />
                    )}
                  </View>
                )}
                {isFuture && (
                  <View style={trackerStyles.nodeFuture} />
                )}
              </View>

              <Text
                style={[
                  trackerStyles.stepLabel,
                  (isCompleted || isCurrent) && trackerStyles.stepLabelActive,
                  isCurrent && trackerStyles.stepLabelCurrent,
                  isCurrent && status === 'Rejected' && trackerStyles.stepLabelFailed,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {step}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const trackerStyles = StyleSheet.create({
  stepperContainer: {
    position: 'relative',
    marginVertical: 12,
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
    backgroundColor: '#E9ECF0',
    borderRadius: 2,
  },
  lineActive: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
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
    backgroundColor: '#005BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeCurrentOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#005BFF',
    backgroundColor: 'rgba(0, 91, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#005BFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  nodeCurrentOuterFailed: {
    borderColor: '#DC2626',
    backgroundColor: '#DC2626',
    shadowColor: '#DC2626',
  },
  nodeCurrentInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#005BFF',
  },
  nodeFuture: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#111827',
    fontWeight: '600',
  },
  stepLabelCurrent: {
    color: '#005BFF',
    fontWeight: '700',
  },
  stepLabelFailed: {
    color: '#DC2626',
  },
});

export default function ImmobilizationScreen() {
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const [requests, setRequests] = useState<ImmobilizationRequest[]>([]);
  const [vin, setVin] = useState('');
  const [customer, setCustomer] = useState('');
  const [reason, setReason] = useState(REASONS[0]);
  const [reasonDropdownOpen, setReasonDropdownOpen] = useState(false);
  const [evidence, setEvidence] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getImmobilizationRequests().then(setRequests);
  }, []);

  const handleSubmit = () => {
    Alert.alert(
      'Request Submitted',
      'Status: Submitted — Pending VOLT Review.',
    );
    setShowForm(false);
  };

  const trackerSteps = ['Submitted', 'Under Review', 'Approved', 'Executed'];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Immobilization" />
      <ScrollView contentContainerStyle={styles.content}>
        <Button
          title="Raise Immobilization Request"
          onPress={() => setShowForm(true)}
          style={{ marginBottom: 24 }}
        />

      {showForm && (
        <Card style={{ marginBottom: 24 }}>
          <Text style={styles.label}>VIN</Text>
          <TextInput
            style={styles.input}
            value={vin}
            onChangeText={setVin}
            placeholderTextColor={theme.colors.text3}
            placeholder="VOLT1EV..."
          />
          <Text style={styles.label}>CUSTOMER</Text>
          <TextInput
            style={styles.input}
            value={customer}
            onChangeText={setCustomer}
            placeholderTextColor={theme.colors.text3}
          />
          <Text style={styles.label}>REASON</Text>
          
          {/* Custom Dropdown for Reason */}
          <TouchableOpacity
            style={[
              styles.dropdownTrigger,
              reasonDropdownOpen && styles.dropdownTriggerActive,
            ]}
            onPress={() => setReasonDropdownOpen(!reasonDropdownOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownText}>{reason}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {reasonDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {REASONS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.dropdownItem,
                    reason === r && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setReason(r);
                    setReasonDropdownOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      reason === r && styles.dropdownItemTextActive,
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>EVIDENCE</Text>
          <TextInput
            style={styles.textarea}
            value={evidence}
            onChangeText={setEvidence}
            multiline
            placeholderTextColor={theme.colors.text3}
            placeholder="Loan account details, court order reference..."
          />
          <Button title="Submit Request" onPress={handleSubmit} style={{ marginTop: 16 }} />
        </Card>
      )}

      <Text style={styles.section}>REQUEST STATUS TRACKER</Text>
      {requests.map((req) => {
        return (
          <Card key={req.id} style={{ marginBottom: 16, padding: 20 }}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardHeaderLabel}>IMMOBILIZATION</Text>
                <Text style={styles.cardJobId}>{req.id}</Text>
              </View>
              <Badge 
                label={req.status} 
                variant={req.status === 'Rejected' ? 'red' : req.status === 'Executed' ? 'green' : 'amber'} 
              />
            </View>

            <RequestTracker status={req.status} steps={trackerSteps} />

            <View style={styles.metadataStrip}>
              <View style={styles.metaColumn}>
                <Text style={styles.metaLabel}>CUSTOMER</Text>
                <Text style={styles.metaValue}>{req.customer}</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaColumn}>
                <Text style={styles.metaLabel}>VEHICLE VIN</Text>
                <Text style={styles.metaValue}>{req.vin}</Text>
              </View>
            </View>

            {req.evidence ? (
              <View style={styles.evidenceContainer}>
                <Text style={styles.evidenceLabel}>EVIDENCE SUMMARY</Text>
                <Text style={styles.evidenceValue} numberOfLines={2}>{req.evidence}</Text>
              </View>
            ) : null}
          </Card>
        );
      })}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  content: { padding: 16, paddingTop: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text1, marginBottom: 16 },
  label: { fontSize: 11, color: theme.colors.text2, letterSpacing: 1, marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: theme.colors.surface2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    color: theme.colors.text1,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  dropdownTriggerActive: {
    borderColor: theme.colors.teal,
  },
  dropdownText: {
    fontSize: 14,
    color: theme.colors.text1,
  },
  dropdownArrow: {
    fontSize: 10,
    color: theme.colors.text2,
  },
  dropdownMenu: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownItemActive: {
    backgroundColor: theme.colors.tealMuted,
  },
  dropdownItemText: {
    fontSize: 14,
    color: theme.colors.text2,
  },
  dropdownItemTextActive: {
    color: theme.colors.teal,
    fontWeight: '600',
  },
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
  section: { fontSize: 11, color: theme.colors.text2, letterSpacing: 1, marginBottom: 12 },
  reqId: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 11, color: theme.colors.text3 },
  reqVin: { fontSize: 14, fontWeight: '600', color: theme.colors.text1, marginTop: 4, marginBottom: 16 },
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
    color: '#111827',
  },
  metadataStrip: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
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
    color: '#111827',
  },
  metaDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  evidenceContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  evidenceLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  evidenceValue: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 15,
  },
});
