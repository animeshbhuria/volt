import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import type { CommandResult, CommandStatus } from '@/types/vehicle';
import { useAuthStore } from '@/store/authStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { Check, X, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

const STATUSES: CommandStatus[] = ['QUEUED', 'SENT', 'ACKNOWLEDGED', 'FAILED'];

interface CommandStatusCardProps {
  commandName: string;
  result: CommandResult | null;
  loading?: boolean;
}

export function CommandStatusCard({ commandName, result, loading }: CommandStatusCardProps) {
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const { profile } = useAuthStore();
  const { vehicles, activeVin } = useVehicleStore();
  const [displayStatus, setDisplayStatus] = useState<CommandStatus>('QUEUED');
  const progressAnim = useRef(new Animated.Value(0)).current;

  const activeVehicle = vehicles.find((v) => v.vin === activeVin);
  const dealerName = activeVehicle?.dealerName || 'Jaipur EV Motors';

  useEffect(() => {
    if (!result) return;
    setDisplayStatus(result.status);

    if (result.status === 'QUEUED') {
      const t1 = setTimeout(() => setDisplayStatus('SENT'), 1500);
      const t2 = setTimeout(() => setDisplayStatus('ACKNOWLEDGED'), 2500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [result]);

  const currentStatus = result?.status ?? displayStatus;

  const getStatusIndex = (status: CommandStatus) => {
    return STATUSES.indexOf(status);
  };

  useEffect(() => {
    const stepIndex = getStatusIndex(currentStatus);
    if (stepIndex >= 0) {
      const targetPercent = (stepIndex / (STATUSES.length - 1)) * 100;
      Animated.timing(progressAnim, {
        toValue: targetPercent,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [currentStatus]);

  const formatTimestamp = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const getTimestampForStage = (status: CommandStatus, idx: number) => {
    if (result?.timestamps?.[status]) {
      return formatTimestamp(result.timestamps[status]);
    }
    const queuedTime = result?.timestamps?.['QUEUED'];
    if (queuedTime) {
      const baseDate = new Date(queuedTime);
      if (status === 'SENT') {
        return formatTimestamp(new Date(baseDate.getTime() + 1500));
      }
      if (status === 'ACKNOWLEDGED') {
        return formatTimestamp(new Date(baseDate.getTime() + 2500));
      }
    }
    return '';
  };

  const badgeBgColor = currentStatus === 'FAILED'
    ? (scheme === 'dark' ? 'rgba(220,38,38,0.2)' : 'rgba(220,38,38,0.1)')
    : (scheme === 'dark' ? 'rgba(0,91,255,0.2)' : 'rgba(0,91,255,0.1)');

  const badgeTextColor = currentStatus === 'FAILED' ? theme.colors.red : theme.colors.teal;
  const progressLineColor = currentStatus === 'FAILED' ? theme.colors.red : theme.colors.teal;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardHeaderLabel}>{commandName.toUpperCase()}</Text>
          <Text style={styles.cardJobId}>{result?.commandId || 'CMD-PENDING'}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
          <Text style={[styles.badgeText, { color: badgeTextColor }]}>
            {currentStatus}
          </Text>
        </View>
      </View>

      {loading ? (
        <Text style={styles.loading}>Queuing command...</Text>
      ) : (
        <>
          {/* Stepper container */}
          <View style={styles.stepperContainer}>
            {/* Progress track wrapper */}
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
                    backgroundColor: progressLineColor,
                  },
                ]}
              />
            </View>

            {/* Steps row */}
            <View style={styles.nodesContainer}>
              {STATUSES.map((s, i) => {
                const stepIndex = getStatusIndex(currentStatus);
                const isCompleted = i < stepIndex;
                const isCurrent = i === stepIndex;
                const isFuture = i > stepIndex;

                return (
                  <View key={s} style={styles.stepNode}>
                    <View style={styles.nodeWrapper}>
                      {isCompleted && (
                        <View style={styles.nodeCompleted}>
                          <Check size={12} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      )}
                      {isCurrent && (
                        <View style={[styles.nodeCurrentOuter, currentStatus === 'FAILED' && styles.nodeCurrentOuterFailed]}>
                          {currentStatus === 'FAILED' ? (
                            <X size={14} color="#FFFFFF" strokeWidth={3} />
                          ) : (
                            <View style={styles.nodeCurrentInner} />
                          )}
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
                        isCurrent && currentStatus === 'FAILED' && styles.stepLabelFailed,
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {s}
                    </Text>

                    {(isCompleted || isCurrent) && (
                      <Text style={styles.stepTimestamp}>
                        {getTimestampForStage(s, i)}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Customer & Dealer Info */}
          <View style={styles.metadataStrip}>
            <View style={styles.metaColumn}>
              <Text style={styles.metaLabel}>CUSTOMER</Text>
              <Text style={styles.metaValue}>{profile?.name || 'Customer'}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaColumn}>
              <Text style={styles.metaLabel}>DEALER</Text>
              <Text style={styles.metaValue}>{dealerName}</Text>
            </View>
          </View>

          {/* Error message banner */}
          {result?.reason && currentStatus === 'FAILED' && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{result.reason}</Text>
            </View>
          )}

          {/* View Details Decorative Text Link */}
          <TouchableOpacity style={styles.viewDetailsButton} activeOpacity={0.7}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <ChevronRight size={14} color={theme.colors.teal} strokeWidth={2.5} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 16,
    marginBottom: 8,
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
    color: theme.colors.text3,
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardJobId: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text1,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  loading: {
    color: theme.colors.text2,
    fontSize: 13,
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
    backgroundColor: theme.colors.border,
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
    backgroundColor: scheme === 'dark' ? 'rgba(0, 91, 255, 0.2)' : 'rgba(0, 91, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  nodeCurrentOuterFailed: {
    borderColor: theme.colors.red,
    backgroundColor: theme.colors.red,
    shadowColor: theme.colors.red,
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
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface2,
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: theme.colors.text3,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: theme.colors.text1,
    fontWeight: '600',
  },
  stepLabelCurrent: {
    color: theme.colors.teal,
    fontWeight: '700',
  },
  stepLabelFailed: {
    color: theme.colors.red,
  },
  stepTimestamp: {
    fontSize: 7.5,
    fontWeight: '500',
    color: theme.colors.text2,
    marginTop: 2,
    textAlign: 'center',
  },
  metadataStrip: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface2,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metaColumn: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: theme.colors.text3,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text1,
  },
  metaDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 12,
  },
  errorBanner: {
    backgroundColor: scheme === 'dark' ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: scheme === 'dark' ? 'rgba(220, 38, 38, 0.3)' : 'rgba(220, 38, 38, 0.15)',
  },
  errorText: {
    color: theme.colors.red,
    fontSize: 12,
    fontWeight: '500',
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
});
