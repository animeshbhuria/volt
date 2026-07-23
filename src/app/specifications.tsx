import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/tokens';

import { useAuthStore } from '@/store/authStore';

import { SpecificationService } from '@/services/specificationService';

const requirementsDb = SpecificationService.getRequirements();
const signalsDb = SpecificationService.getSignals();
const messagesDb = SpecificationService.getCanMessages();
const architectureDb = SpecificationService.getArchitectureCompliance();
const vvDeliverablesDb = SpecificationService.getVvDeliverables();

type SpecTab = 'Requirements' | 'Signals' | 'CAN Messages' | 'Architecture & V&V';

export default function SpecificationsScreen() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const styles = getStyles(theme, scheme === 'dark' ? 'dark' : 'light');
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<SpecTab>('Requirements');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: SpecTab[] = ['Requirements', 'Signals', 'CAN Messages', 'Architecture & V&V'];

  let fallbackPath = '/(customer)/settings';
  if (user) {
    if (user.role === 'DEALER') fallbackPath = '/(dealer)/profile';
    else if (user.role === 'FINANCIER') fallbackPath = '/(financier)/profile';
    else if (user.role === 'VOLT') fallbackPath = '/(oem)/profile';
  }

  const filteredRequirements = requirementsDb.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.requirement.toLowerCase().includes(q) ||
      r.owner.toLowerCase().includes(q)
    );
  });

  const filteredSignals = signalsDb.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.id.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.ecu.toLowerCase().includes(q) ||
      s.messageName.toLowerCase().includes(q)
    );
  });

  const filteredMessages = messagesDb.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.id.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q) ||
      m.txEcu.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      <ScreenHeader title="System Specifications" subtitle="VOLT Mobility Compliance" fallbackPath={fallbackPath} />
      
      <View style={styles.tabRowWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabRow}
        >
          {tabs.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && styles.tabActive]}
              onPress={() => {
                setActiveTab(t);
                setSearchQuery('');
              }}
            >
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab}...`}
          placeholderTextColor={theme.colors.text3}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'Requirements' && (
          filteredRequirements.map((r) => (
            <Card key={r.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.reqId}>{r.id}</Text>
                <Badge label={r.priority} variant={r.priority === 'Must' ? 'red' : 'amber'} />
              </View>
              <Text style={styles.reqCategory}>{r.category}</Text>
              <Text style={styles.reqDesc}>{r.requirement}</Text>
              {r.acceptanceCriteria ? (
                <Text style={styles.reqAcceptance}>
                  <Text style={{ fontWeight: 'bold' }}>Acceptance: </Text>
                  {r.acceptanceCriteria}
                </Text>
              ) : null}
              <View style={styles.cardFooter}>
                <Text style={styles.metaLabel}>Owner: {r.owner}</Text>
                <Text style={styles.metaLabel}>Release: {r.release}</Text>
              </View>
            </Card>
          ))
        )}

        {activeTab === 'Signals' && (
          filteredSignals.map((s) => (
            <Card key={s.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.sigId}>{s.id}</Text>
                <Text style={styles.sigEcu}>{s.ecu} · {s.bus}</Text>
              </View>
              <Text style={styles.sigName}>{s.name}</Text>
              <Text style={styles.sigDesc}>{s.description}</Text>
              <View style={styles.sigGrid}>
                <View style={styles.sigGridCol}>
                  <Text style={styles.gridLabel}>Type</Text>
                  <Text style={styles.gridValue}>{s.dataType}</Text>
                </View>
                <View style={styles.sigGridCol}>
                  <Text style={styles.gridLabel}>Range</Text>
                  <Text style={styles.gridValue}>{s.min} to {s.max} {s.unit}</Text>
                </View>
                <View style={styles.sigGridCol}>
                  <Text style={styles.gridLabel}>CAN ID</Text>
                  <Text style={styles.gridValue}>{s.canId}</Text>
                </View>
              </View>
              {s.notes ? (
                <Text style={styles.notesText}>Notes: {s.notes}</Text>
              ) : null}
            </Card>
          ))
        )}

        {activeTab === 'CAN Messages' && (
          filteredMessages.map((m) => (
            <Card key={m.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.msgId}>{m.id}</Text>
                <Text style={styles.msgEcu}>Tx: {m.txEcu}</Text>
              </View>
              <Text style={styles.msgName}>{m.name}</Text>
              <Text style={styles.msgDesc}>{m.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.metaLabel}>Cycle: {m.cycleTime}</Text>
                <Text style={styles.metaLabel}>DLC: {m.dlc} bytes</Text>
              </View>
              <Text style={styles.signalsLabel}>PACKED SIGNALS ({m.signals.length}):</Text>
              <View style={styles.signalsList}>
                {m.signals.map((sig, idx) => (
                  <View key={idx} style={styles.signalBadge}>
                    <Text style={styles.signalBadgeText}>{sig}</Text>
                  </View>
                ))}
              </View>
            </Card>
          ))
        )}

        {activeTab === 'Architecture & V&V' && (
          <>
            <Text style={styles.sectionTitle}>ARCHITECTURE COMPLIANCE</Text>
            {architectureDb.map((c, idx) => (
              <Card key={idx} style={styles.card}>
                <Text style={styles.archSection}>{c.section} · {c.item}</Text>
                <Text style={styles.archDesc}>{c.description}</Text>
                <Text style={styles.archRemarks}>{c.remarks}</Text>
              </Card>
            ))}

            <Text style={styles.sectionTitle}>V&V DELIVERABLES</Text>
            {vvDeliverablesDb.map((d, idx) => (
              <Card key={idx} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.vvArea}>{d.area}</Text>
                  <Badge label={d.type} variant="teal" />
                </View>
                <Text style={styles.vvDesc}>{d.description}</Text>
                <Text style={styles.vvOutput}>Output: {d.output}</Text>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: Theme, scheme: 'dark' | 'light') => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.midnight },
  tabRowWrapper: { height: 48, marginTop: 8 },
  tabScroll: { flexGrow: 0 },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabActive: { backgroundColor: theme.colors.teal, borderColor: theme.colors.teal },
  tabText: { fontSize: 13, color: theme.colors.text2 },
  tabTextActive: { color: scheme === 'dark' ? '#0D1117' : '#FFFFFF', fontWeight: '600' },
  searchWrapper: { paddingHorizontal: 16, marginBottom: 8 },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: theme.colors.text1,
    backgroundColor: theme.colors.surface2,
    fontSize: 14,
  },
  content: { padding: 16, paddingBottom: 48 },
  card: { marginBottom: 12, padding: 16, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border, paddingTop: 8, marginTop: 8 },
  reqId: { fontFamily: 'JetBrainsMono_700Bold', fontSize: 13, color: theme.colors.teal },
  reqCategory: { fontSize: 12, fontWeight: '600', color: theme.colors.text2, marginBottom: 4 },
  reqDesc: { fontSize: 15, color: theme.colors.text1, lineHeight: 20 },
  reqAcceptance: { fontSize: 13, color: theme.colors.text2, marginTop: 8, backgroundColor: theme.colors.surface2, padding: 8, borderRadius: 6 },
  metaLabel: { fontSize: 11, color: theme.colors.text3 },
  sigId: { fontFamily: 'JetBrainsMono_700Bold', fontSize: 13, color: theme.colors.teal },
  sigEcu: { fontSize: 12, color: theme.colors.text3 },
  sigName: { fontSize: 16, fontWeight: '600', color: theme.colors.text1, marginBottom: 4 },
  sigDesc: { fontSize: 14, color: theme.colors.text2, marginBottom: 12 },
  sigGrid: { flexDirection: 'row', gap: 12, backgroundColor: theme.colors.surface2, padding: 10, borderRadius: 8 },
  sigGridCol: { flex: 1 },
  gridLabel: { fontSize: 10, color: theme.colors.text3, textTransform: 'uppercase', marginBottom: 2 },
  gridValue: { fontSize: 12, fontWeight: '600', color: theme.colors.text1 },
  notesText: { fontSize: 12, color: theme.colors.amber, marginTop: 8 },
  msgId: { fontFamily: 'JetBrainsMono_700Bold', fontSize: 13, color: theme.colors.teal },
  msgEcu: { fontSize: 12, color: theme.colors.text3 },
  msgName: { fontSize: 16, fontWeight: '600', color: theme.colors.text1, marginBottom: 4 },
  msgDesc: { fontSize: 14, color: theme.colors.text2, marginBottom: 8 },
  signalsLabel: { fontSize: 11, color: theme.colors.text3, letterSpacing: 0.5, marginTop: 12, marginBottom: 6 },
  signalsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  signalBadge: { backgroundColor: theme.colors.surface2, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  signalBadgeText: { fontSize: 11, color: theme.colors.text2, fontFamily: 'JetBrainsMono_400Regular' },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: theme.colors.text2, letterSpacing: 1, marginTop: 24, marginBottom: 12 },
  archSection: { fontSize: 14, fontWeight: '600', color: theme.colors.teal, marginBottom: 6 },
  archDesc: { fontSize: 14, color: theme.colors.text1, lineHeight: 20 },
  archRemarks: { fontSize: 12, color: theme.colors.text3, marginTop: 6 },
  vvArea: { fontSize: 15, fontWeight: '600', color: theme.colors.text1 },
  vvDesc: { fontSize: 14, color: theme.colors.text2, marginTop: 4 },
  vvOutput: { fontSize: 12, color: theme.colors.teal, marginTop: 6, fontWeight: '500' },
});
