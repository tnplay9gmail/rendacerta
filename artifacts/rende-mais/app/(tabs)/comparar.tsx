import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import {
  BANKS,
  Bank,
  calculateReturn,
  calculateSavingsReturn,
  formatCurrency,
  LIQUIDITY_LABELS,
} from '@/constants/data';
import { BankLogo } from '@/components/BankLogo';

const INVESTMENT_VALUES = [1000, 5000, 10000, 50000];
const PERIOD_MONTHS = [
  { label: '6 meses', value: 6 },
  { label: '1 ano', value: 12 },
  { label: '2 anos', value: 24 },
];

export default function CompararScreen() {
  const insets = useSafeAreaInsets();
  const [selectedBanks, setSelectedBanks] = useState<string[]>([BANKS[0].id, BANKS[2].id]);
  const [investmentValue, setInvestmentValue] = useState(5000);
  const [months, setMonths] = useState(12);

  const toggleBank = (id: string) => {
    Haptics.selectionAsync();
    setSelectedBanks((prev) => {
      if (prev.includes(id)) {
        return prev.length === 1 ? prev : prev.filter((b) => b !== id);
      }
      return prev.length >= 3 ? [...prev.slice(1), id] : [...prev, id];
    });
  };

  const comparedBanks = BANKS.filter((b) => selectedBanks.includes(b.id));
  const savingsReturn = calculateSavingsReturn(investmentValue, months);

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.title}>Comparar</Text>
          <Text style={styles.subtitle}>Escolha até 3 bancos</Text>
        </View>

        {/* Simulation config */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Valor investido</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.pillRow}>
              {INVESTMENT_VALUES.map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.pill, investmentValue === v && styles.pillActive]}
                  onPress={() => { Haptics.selectionAsync(); setInvestmentValue(v); }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, investmentValue === v && styles.pillTextActive]}>
                    {formatCurrency(v)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Período</Text>
          <View style={styles.pillRow}>
            {PERIOD_MONTHS.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                style={[styles.pill, months === value && styles.pillActive]}
                onPress={() => { Haptics.selectionAsync(); setMonths(value); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillText, months === value && styles.pillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bank selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Selecionar bancos</Text>
          <View style={styles.bankGrid}>
            {BANKS.map((bank) => {
              const isSelected = selectedBanks.includes(bank.id);
              return (
                <TouchableOpacity
                  key={bank.id}
                  style={[styles.bankChip, isSelected && styles.bankChipSelected]}
                  onPress={() => toggleBank(bank.id)}
                  activeOpacity={0.8}
                >
                  <BankLogo bank={bank} size={24} />
                  <Text style={[styles.bankChipText, isSelected && styles.bankChipTextSelected]}>
                    {bank.shortName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Results */}
        {comparedBanks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Resultado</Text>
            <View style={styles.compareCards}>
              {comparedBanks.map((bank) => {
                const { net, monthly } = calculateReturn(investmentValue, bank.cdiRate, months, bank.hasTax);
                const extraVsSavings = net - savingsReturn;

                return (
                  <View key={bank.id} style={[styles.compareCard, bank.isRecommended && styles.compareCardTop]}>
                    <View style={styles.compareHeader}>
                      <BankLogo bank={bank} size={38} />
                      <View style={styles.compareHeaderText}>
                        <Text style={styles.compareName}>{bank.name}</Text>
                        <Text style={styles.compareMeta}>
                          {bank.cdiRate.toFixed(1)}% CDI - {bank.hasTax ? 'Com imposto' : 'Sem imposto'}
                        </Text>
                      </View>
                      {bank.isRecommended && (
                        <View style={styles.topBadgeInline}>
                          <Text style={styles.topBadgeText}>Melhor</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.metricRow}>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>
                          Lucro em {months < 12 ? `${months} meses` : months === 12 ? '1 ano' : '2 anos'}
                        </Text>
                        <Text style={styles.metricValue}>{formatCurrency(net)}</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Media por mes</Text>
                        <Text style={styles.metricValue}>{formatCurrency(monthly)}</Text>
                      </View>
                    </View>

                    <View style={styles.metricRow}>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Liquidez</Text>
                        <Text style={styles.metricValueSmall}>
                          {LIQUIDITY_LABELS[bank.liquidity].label}
                        </Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Imposto</Text>
                        <Text style={styles.metricValueSmall}>
                          {bank.hasTax ? 'Com imposto' : 'Sem imposto'}
                        </Text>
                      </View>
                    </View>

                    {extraVsSavings > 0 && (
                      <View style={styles.vsRow}>
                        <Text style={styles.vsText}>+{formatCurrency(extraVsSavings)} vs poupanca</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Savings reference */}
            <View style={styles.savingsRef}>
              <Text style={styles.savingsRefLabel}>Poupança (referência)</Text>
              <Text style={styles.savingsRefValue}>{formatCurrency(savingsReturn)}</Text>
              <Text style={styles.savingsRefSub}>
                em {months < 12 ? `${months} meses` : months === 12 ? '1 ano' : '2 anos'} · 0,5% ao mês
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: Colors.neutral[950] },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.neutral[400], marginTop: 4 },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[400],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  pillRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  pillActive: { backgroundColor: Colors.neutral[950], borderColor: Colors.neutral[950] },
  pillText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.neutral[700] },
  pillTextActive: { color: Colors.white },
  bankGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bankChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  bankChipSelected: { borderColor: Colors.brand[500], backgroundColor: Colors.brand[50] },
  bankChipText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.neutral[600] },
  bankChipTextSelected: { color: Colors.brand[600] },
  compareCards: { gap: 12 },
  compareCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
    gap: 12,
  },
  compareCardTop: { borderColor: Colors.brand[300], borderWidth: 1.5 },
  compareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compareHeaderText: { flex: 1 },
  compareName: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.neutral[950] },
  compareMeta: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.neutral[400], marginTop: 2 },
  topBadgeInline: {
    backgroundColor: Colors.brand[500],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  topBadgeText: { color: Colors.white, fontSize: 11, fontFamily: 'Inter_700Bold' },
  metricRow: { flexDirection: 'row', gap: 12 },
  metricItem: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  metricLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', color: Colors.neutral[400] },
  metricValue: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.neutral[950], marginTop: 4 },
  metricValueSmall: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.neutral[700], marginTop: 4 },
  vsRow: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.brand[50],
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  vsText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.brand[600] },
  savingsRef: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
    gap: 2,
  },
  savingsRefLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.neutral[400] },
  savingsRefValue: { fontSize: 20, fontFamily: 'Inter_700Bold', color: Colors.neutral[600] },
  savingsRefSub: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.neutral[300] },
});
