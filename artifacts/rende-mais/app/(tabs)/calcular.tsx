import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@/components/ui/AppIcon';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import {
  BANKS,
  CURRENT_CDI_RATE,
  formatCurrency,
} from '@/constants/data';
import { BankLogo } from '@/components/BankLogo';

function formatInput(raw: string): string {
  const nums = raw.replace(/\D/g, '');
  if (!nums) return '';
  const cents = parseInt(nums, 10);
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseValue(formatted: string): number {
  const clean = formatted.replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(clean) || 0;
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function calculateReturnWithMonthly(
  principal: number,
  monthlyContribution: number,
  cdiPercent: number,
  months: number,
  hasTax: boolean
): { gross: number; net: number; monthly: number; total: number; invested: number } {
  const annualRate = (CURRENT_CDI_RATE * cdiPercent) / 100 / 100;
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  const factor = Math.pow(1 + monthlyRate, months);

  const totalFromPrincipal = principal * factor;
  const totalFromMonthly = monthlyContribution > 0
    ? monthlyRate === 0
      ? monthlyContribution * months
      : monthlyContribution * ((factor - 1) / monthlyRate)
    : 0;

  const invested = principal + monthlyContribution * months;
  const gross = totalFromPrincipal + totalFromMonthly - invested;

  let taxRate = 0;
  if (hasTax) {
    if (months <= 6) taxRate = 0.225;
    else if (months <= 12) taxRate = 0.20;
    else if (months <= 24) taxRate = 0.175;
    else taxRate = 0.15;
  }

  const net = gross * (1 - taxRate);
  const monthly = months > 0 ? net / months : 0;
  const total = invested + net;

  return { gross, net, monthly, total, invested };
}

function calculateSavingsReturnWithMonthly(
  principal: number,
  monthlyContribution: number,
  months: number
): number {
  const monthlyRate = 0.005;
  const factor = Math.pow(1 + monthlyRate, months);
  const totalFromPrincipal = principal * factor;
  const totalFromMonthly = monthlyContribution > 0
    ? monthlyRate === 0
      ? monthlyContribution * months
      : monthlyContribution * ((factor - 1) / monthlyRate)
    : 0;

  const invested = principal + monthlyContribution * months;
  return totalFromPrincipal + totalFromMonthly - invested;
}


const PERIODS = [
  { label: '3 meses', months: 3 },
  { label: '6 meses', months: 6 },
  { label: '1 ano', months: 12 },
  { label: '2 anos', months: 24 },
];

export default function CalcularScreen() {
  const insets = useSafeAreaInsets();
  const [inputValue, setInputValue] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [selectedMonths, setSelectedMonths] = useState(12);
  const [useCustomMonths, setUseCustomMonths] = useState(false);
  const [customMonths, setCustomMonths] = useState('');
  const [selectedBankId, setSelectedBankId] = useState(BANKS[0].id);
  const [bankQuery, setBankQuery] = useState('');

  const parsedCustomMonths = parseInt(customMonths, 10);
  const effectiveMonths =
    useCustomMonths && Number.isFinite(parsedCustomMonths) && parsedCustomMonths > 0
      ? parsedCustomMonths
      : selectedMonths;

  const amount = parseValue(inputValue);
  const monthlyAmount = parseValue(monthlyContribution);
  const canSimulate = (amount > 0 || monthlyAmount > 0) && effectiveMonths > 0;
  const normalizedQuery = normalizeText(bankQuery);
  const filteredBanks = BANKS.filter((bank) => {
    if (!normalizedQuery) return true;
    const haystack = normalizeText(`${bank.name} ${bank.shortName}`);
    return haystack.includes(normalizedQuery);
  });
  const selectedBank = BANKS.find((b) => b.id === selectedBankId) ?? BANKS[0];

  const result = useMemo(() => {
    if (!canSimulate) return null;
    return calculateReturnWithMonthly(
      amount,
      monthlyAmount,
      selectedBank.cdiRate,
      effectiveMonths,
      selectedBank.hasTax
    );
  }, [amount, monthlyAmount, selectedBank, effectiveMonths, canSimulate]);

  const savingsNet = useMemo(() => {
    if (!canSimulate) return 0;
    return calculateSavingsReturnWithMonthly(amount, monthlyAmount, effectiveMonths);
  }, [amount, monthlyAmount, effectiveMonths, canSimulate]);

  const taxLabel = () => {
    if (!selectedBank.hasTax) return 'Sem imposto de renda';
    if (effectiveMonths <= 6) return 'Imposto: 22,5% sobre o lucro';
    if (effectiveMonths <= 12) return 'Imposto: 20% sobre o lucro';
    if (effectiveMonths <= 24) return 'Imposto: 17,5% sobre o lucro';
    return 'Imposto: 15% sobre o lucro';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.title}>Calculadora</Text>
          <Text style={styles.subtitle}>Simule quanto você vai ganhar</Text>
        </View>

        {/* Amount input */}
        <View style={styles.section}>
          <Text style={styles.question}>Quanto você quer investir?</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={(t) => setInputValue(formatInput(t))}
              placeholder="R$ 0,00"
              placeholderTextColor={Colors.neutral[300]}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Monthly contribution */}
        <View style={styles.section}>
          <Text style={styles.question}>Aporte mensal (opcional)</Text>
          <View style={styles.inputWrapperSoft}>
            <TextInput
              style={styles.inputSmall}
              value={monthlyContribution}
              onChangeText={(t) => setMonthlyContribution(formatInput(t))}
              placeholder="R$ 0,00"
              placeholderTextColor={Colors.neutral[300]}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Period */}
        <View style={styles.section}>
          <Text style={styles.question}>Por quanto tempo?</Text>
          <View style={styles.pillRow}>
            {PERIODS.map(({ label, months }) => (
              <TouchableOpacity
                key={months}
                style={[styles.pill, selectedMonths === months && !useCustomMonths && styles.pillActive]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedMonths(months);
                  setUseCustomMonths(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillText, selectedMonths === months && !useCustomMonths && styles.pillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.pill, useCustomMonths && styles.pillActive]}
              onPress={() => {
                Haptics.selectionAsync();
                setUseCustomMonths(true);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, useCustomMonths && styles.pillTextActive]}>
                Outro
              </Text>
            </TouchableOpacity>
          </View>
          {useCustomMonths && (
            <View style={styles.customMonthRow}>
              <TextInput
                style={styles.customMonthInput}
                value={customMonths}
                onChangeText={(t) => setCustomMonths(t.replace(/\D/g, ''))}
                placeholder="Ex: 18"
                placeholderTextColor={Colors.neutral[300]}
                keyboardType="numeric"
                returnKeyType="done"
              />
              <Text style={styles.customMonthLabel}>meses</Text>
            </View>
          )}
        </View>

        {/* Bank picker */}
        <View style={styles.section}>
          <Text style={styles.question}>Em qual banco?</Text>
          <View style={styles.searchWrap}>
            <AppIcon name="search" size={16} color={Colors.neutral[400]} />
            <TextInput
              style={styles.searchInput}
              value={bankQuery}
              onChangeText={setBankQuery}
              placeholder="Buscar banco pelo nome"
              placeholderTextColor={Colors.neutral[300]}
              returnKeyType="search"
            />
            {bankQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setBankQuery('')}
                style={styles.searchClear}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <AppIcon name="x" size={14} color={Colors.neutral[400]} />
              </TouchableOpacity>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.bankRow}>
              {filteredBanks.map((bank) => (
                <TouchableOpacity
                  key={bank.id}
                  style={[styles.bankOption, selectedBankId === bank.id && styles.bankOptionSelected]}
                  onPress={() => { Haptics.selectionAsync(); setSelectedBankId(bank.id); }}
                  activeOpacity={0.8}
                >
                  <BankLogo bank={bank} size={32} />
                  <Text style={[styles.bankName, selectedBankId === bank.id && styles.bankNameSelected]}>
                    {bank.shortName}
                  </Text>
                  <Text style={[styles.bankRate, selectedBankId === bank.id && styles.bankRateSelected]}>
                    {bank.cdiRate.toFixed(1)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Result */}
        {result && canSimulate && (
          <View style={styles.section}>
            <Text style={styles.question}>Resultado da simulação</Text>

            {/* Main result */}
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Você terá no final</Text>
              <Text style={styles.resultTotal}>{formatCurrency(result.total)}</Text>
              <Text style={styles.resultSub}>
                Lucro de{' '}
                <Text style={styles.resultProfit}>{formatCurrency(result.net)}</Text>
                {' '}em {effectiveMonths < 12 ? `${effectiveMonths} meses` : effectiveMonths === 12 ? '1 ano' : `${effectiveMonths} meses`}
              </Text>
              <Text style={styles.resultInvested}>Total investido: {formatCurrency(result.invested)}</Text>
              <Text style={styles.resultMonthly}>
                ≈ {formatCurrency(result.monthly)} por mês
              </Text>
            </View>

            {/* vs savings */}
            <View style={styles.vsCard}>
              <View style={styles.vsItem}>
                <Text style={styles.vsItemLabel}>Na poupança</Text>
                <Text style={styles.vsItemValue}>{formatCurrency(savingsNet)}</Text>
              </View>
              <View style={styles.vsArrow}>
                <AppIcon name="arrow-right" size={14} color={Colors.neutral[300]} />
              </View>
              <View style={styles.vsItem}>
                <Text style={[styles.vsItemLabel, { color: Colors.brand[600] }]}>
                  Na {selectedBank.shortName}
                </Text>
                <Text style={[styles.vsItemValue, { color: Colors.brand[500] }]}>
                  {formatCurrency(result.net)}
                </Text>
              </View>
            </View>
            {result.net - savingsNet > 0 && (
              <Text style={styles.extraGain}>
                Você ganha{' '}
                <Text style={styles.extraGainHighlight}>{formatCurrency(result.net - savingsNet)} a mais</Text>
                {' '}do que na poupança.
              </Text>
            )}

            {/* Tax note */}
            <Text style={styles.taxNote}>* {taxLabel()}</Text>
          </View>
        )}

        {/* Empty */}
        {(!canSimulate) && (
          <View style={styles.emptyHint}>
            <AppIcon name="edit-3" size={32} color={Colors.neutral[200]} />
            <Text style={styles.emptyHintText}>
              Digite um valor para ver quanto você vai ganhar
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  section: { paddingHorizontal: 20, marginTop: 28 },
  question: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
    marginBottom: 14,
  },
  inputWrapper: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.brand[400],
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
    paddingVertical: 18,
  },
  inputWrapperSoft: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    paddingHorizontal: 16,
  },
  inputSmall: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[900],
    paddingVertical: 14,
  },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  pillActive: { backgroundColor: Colors.neutral[950], borderColor: Colors.neutral[950] },
  pillText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.neutral[600] },
  pillTextActive: { color: Colors.white },
  customMonthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  customMonthInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
  },
  customMonthLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[500],
  },
  searchWrap: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[900],
  },
  searchClear: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: Colors.neutral[100],
  },
  bankRow: { flexDirection: 'row', gap: 10 },
  bankOption: {
    alignItems: 'center',
    gap: 6,
    padding: 14,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    minWidth: 76,
  },
  bankOptionSelected: { borderColor: Colors.brand[500], backgroundColor: Colors.brand[50] },
  bankName: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.neutral[600] },
  bankNameSelected: { color: Colors.brand[600] },
  bankRate: { fontSize: 13, fontFamily: 'Inter_700Bold', color: Colors.neutral[400] },
  bankRateSelected: { color: Colors.brand[500] },
  resultCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1.5,
    borderColor: Colors.brand[200],
    gap: 4,
  },
  resultLabel: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.neutral[400] },
  resultTotal: {
    fontSize: 44,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
    letterSpacing: -1.5,
    marginTop: 4,
  },
  resultSub: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    marginTop: 4,
  },
  resultInvested: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[400],
    marginTop: 2,
  },
  resultProfit: {
    fontFamily: 'Inter_700Bold',
    color: Colors.brand[500],
  },
  resultMonthly: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[400],
    marginTop: 2,
  },
  vsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  vsItem: { flex: 1, gap: 4 },
  vsArrow: { paddingHorizontal: 12 },
  vsItemLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.neutral[400] },
  vsItemValue: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[600],
  },
  extraGain: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    marginTop: 10,
    lineHeight: 20,
  },
  extraGainHighlight: {
    fontFamily: 'Inter_700Bold',
    color: Colors.brand[500],
  },
  taxNote: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[300],
    marginTop: 12,
  },
  emptyHint: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    gap: 14,
  },
  emptyHintText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[300],
    textAlign: 'center',
    lineHeight: 22,
  },
});
