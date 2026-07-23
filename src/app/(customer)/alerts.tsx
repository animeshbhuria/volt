import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Swipeable } from 'react-native-gesture-handler';
import { AlertTriangle, Info, Wrench, FileText, Route, Lock, BellOff } from 'lucide-react-native';
import Animated, { FadeInUp, FadeOutLeft, LinearTransition } from 'react-native-reanimated';
import { useAlertStore } from '@/store/alertStore';
import { useAuthStore } from '@/store/authStore';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { useTranslation } from '@/hooks/useTranslation';
import { radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';
import type { AlertCategory } from '@/types/alerts';
import type { Alert } from '@/types/alerts';

const FILTERS: { key: 'all' | AlertCategory; label: string }[] = [
  { key: 'all', label: 'All Alerts' },
  { key: 'critical', label: 'Critical' },
  { key: 'service', label: 'Service' },
  { key: 'documents', label: 'Documents' },
  { key: 'trips', label: 'Trips' },
];

const iconMap = {
  critical: AlertTriangle,
  service: Wrench,
  documents: FileText,
  trips: Route,
  info: Info,
};

export default function AlertsScreen() {
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const { alerts, loading, error, fetchAlerts, dismissAlert } = useAlertStore();
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | AlertCategory>('all');

  useEffect(() => {
    if (user) fetchAlerts(user.phone, 'CUSTOMER');
  }, [user, fetchAlerts]);

  const filtered =
    filter === 'all' ? alerts : alerts.filter((a) => a.category === filter);

  const severityColor = (severity: string) => {
    if (severity === 'critical') return theme.colors.red;
    if (severity === 'warning') return theme.colors.amber;
    return theme.colors.teal;
  };

  const renderAlert = (alert: Alert) => {
    const Icon = iconMap[alert.category] ?? Info;
    const color = severityColor(alert.severity);
    
    const card = (
      <View
        style={[
          styles.alertCard,
          !alert.read && styles.alertUnread,
          alert.severity === 'critical' && styles.alertCritical,
        ]}
      >
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
          <Icon size={18} color={color} />
        </View>
        <View style={styles.alertContent}>
          <View style={styles.alertTitleRow}>
            <Text style={styles.alertTitle}>{alert.title}</Text>
            {!alert.dismissible && (
              <View style={styles.lockedBadge}>
                <Lock size={10} color={theme.colors.text3} style={{ marginRight: 2 }} />
                <Text style={styles.lockedText}>LOCKED</Text>
              </View>
            )}
            {!alert.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.alertDesc}>{alert.description}</Text>
          <Text style={styles.alertTime}>
            {alert.timestamp.toLocaleString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>
    );

    const cardContent = !alert.dismissible ? (
      card
    ) : (
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            style={styles.dismissAction}
            onPress={() => dismissAlert(alert.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        )}
        overshootRight={false}
      >
        {card}
      </Swipeable>
    );

    return (
      <Animated.View
        key={alert.id}
        entering={FadeInUp.duration(250)}
        exiting={FadeOutLeft.duration(200)}
        layout={LinearTransition.springify().mass(0.8).damping(15)}
      >
        {cardContent}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('alerts')} />

      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterScrollContent}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterPill, filter === f.key && styles.filterPillActive]}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {error ? (
        <ErrorState message={error} onRetry={() => user && fetchAlerts(user.phone, 'CUSTOMER')} />
      ) : loading ? (
        <View style={{ padding: 16 }}>
          <SkeletonCard />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconContainer}>
            <BellOff size={32} color={theme.colors.text3} />
          </View>
          <Text style={styles.emptyTitle}>{t('allClear')}</Text>
          <Text style={styles.emptySub}>We will notify you when something needs your attention.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {filtered.map(renderAlert)}
        </ScrollView>
      )}
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  filterWrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    paddingVertical: 12,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  filterPillActive: {
    backgroundColor: theme.colors.tealDim,
    borderColor: theme.colors.teal,
  },
  filterText: {
    fontSize: 13,
    color: theme.colors.text2,
    fontWeight: '500',
  },
  filterTextActive: {
    color: theme.colors.teal,
    fontWeight: '700',
  },
  list: {
    padding: 16,
    paddingBottom: 48,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 10,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  alertUnread: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.teal,
  },
  alertCritical: {
    backgroundColor: 'rgba(239, 68, 68, 0.04)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text1,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lockedText: {
    fontSize: 8,
    fontWeight: '700',
    color: theme.colors.text2,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.teal,
  },
  alertDesc: {
    fontSize: 13,
    color: theme.colors.text2,
    marginTop: 6,
    lineHeight: 18,
  },
  alertTime: {
    fontSize: 11,
    color: theme.colors.text3,
    marginTop: 8,
    ...typography.mono,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text1,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: theme.colors.text2,
    textAlign: 'center',
    lineHeight: 18,
  },
  dismissAction: {
    backgroundColor: theme.colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 10,
    borderRadius: radius.md,
    marginLeft: 8,
  },
  dismissText: {
    color: theme.colors.text1,
    fontWeight: '700',
    fontSize: 13,
  },
});
