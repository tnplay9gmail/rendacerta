import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  InteractionManager,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@/components/ui/AppIcon';
import * as Haptics from 'expo-haptics';
import { Colors, shadows } from '@/constants/colors';
import {
  BANKS,
  calculateReturnWithBaseCdi,
  calculateSavingsReturn,
  formatCurrency,
  INVESTMENT_LABELS,
  LIQUIDITY_LABELS,
} from '@/constants/data';
import { BankLogo } from '@/components/BankLogo';
import { LiquidityPill } from '@/components/LiquidityPill';
import { Badge } from '@/components/ui/Badge';
import { RiskMeter } from '@/components/RiskMeter';
import { AffiliateSheet } from '@/components/AffiliateSheet';
import { useAppData } from '@/providers/AppDataProvider';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { WebContainer } from '@/components/web/WebContainer';

const INVESTMENT_AMOUNTS = [1000, 5000, 10000, 50000];

export default function BancoDetail() {
  const { banks, currentCdiRate, trackAffiliateClick } = useAppData();
  const sourceBanks = banks.length > 0 ? banks : BANKS;
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isDesktop } = useResponsiveLayout();
  const isWebDesktop = Platform.OS === 'web' && isDesktop;
  const [affiliateVisible, setAffiliateVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(5000);

  const bank = sourceBanks.find((b) => b.id === id);

  if (!bank) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Banco não encontrado</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { net, monthly } = calculateReturnWithBaseCdi(
    selectedAmount,
    bank.cdiRate,
    12,
    bank.hasTax,
    currentCdiRate,
  );
  const savingsReturn = calculateSavingsReturn(selectedAmount, 12);
  const gainVsSavings = net - savingsReturn;

  const maxRate = Math.max(...bank.rateHistory);
  const minRate = Math.min(...bank.rateHistory);

  const handleOpenAffiliate = () => {
    setAffiliateVisible(true);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    InteractionManager.runAfterInteractions(() => {
      void trackAffiliateClick({
        bank,
        sourceScreen: 'bank_detail',
        sourceComponent: 'bank_detail_invest_button',
      });
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: isWebDesktop ? 24 : isDesktop ? 16 : insets.top + 10 }]}>
        <WebContainer>
          <View style={[styles.headerInner, isWebDesktop && styles.headerInnerDesktop]}>
            <View style={[styles.headerLeft, isWebDesktop && styles.headerLeftDesktop]}>
              <TouchableOpacity style={styles.backButton} onPress={() => { Haptics.selectionAsync(); router.back(); }}>
                <AppIcon name="arrow-left" size={22} color={Colors.neutral[950]} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{bank.shortName}</Text>
            </View>
            <TouchableOpacity style={[styles.headerInvestButton, isWebDesktop && styles.headerInvestButtonDesktop]} onPress={handleOpenAffiliate} activeOpacity={0.85}>
              <Text style={styles.headerInvestText}>Abrir conta</Text>
              <AppIcon name="external-link" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </WebContainer>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isDesktop ? 48 : insets.bottom + 28 }}
      >
        <WebContainer>
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <BankLogo bank={bank} size={56} />
              <View style={{ flex: 1 }}>
                <Text style={styles.heroName}>{bank.name}</Text>
                <Text style={styles.heroType}>{INVESTMENT_LABELS[bank.investmentType]}</Text>
              </View>
            </View>

            <View style={styles.heroRate}>
              <Text style={styles.heroRateValue}>{bank.cdiRate.toFixed(1)}%</Text>
              <Text style={styles.heroRateLabel}>ao ano · {bank.cdiRate.toFixed(1)}% do CDI (rentabilidade de referência do mercado)</Text>
            </View>

            <View style={styles.heroPills}>
              <LiquidityPill type={bank.liquidity} />
              {bank.fgcCovered && <Badge label="Dinheiro protegido pelo governo até R$ 250 mil" variant="fgc" size="sm" />}
              {!bank.hasTax && <Badge label="Sem imposto de renda" variant="brand" size="sm" />}
            </View>

            {bank.minimumAmount > 0 && (
              <Text style={styles.minimum}>
                Mínimo para começar: {formatCurrency(bank.minimumAmount)}
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Simular rendimento</Text>
            <View style={styles.simulatorCard}>
              <Text style={styles.simLabel}>Com quanto?</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.amountRow}>
                  {INVESTMENT_AMOUNTS.map((amt) => (
                    <TouchableOpacity
                      key={amt}
                      style={[styles.amountPill, selectedAmount === amt && styles.amountPillActive]}
                      onPress={() => { Haptics.selectionAsync(); setSelectedAmount(amt); }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.amountText, selectedAmount === amt && styles.amountTextActive]}>
                        {formatCurrency(amt)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View style={styles.projectionBox}>
                <View style={styles.projectionItem}>
                  <Text style={styles.projLabel}>Em 12 meses</Text>
                  <Text style={styles.projValue}>{formatCurrency(net)}</Text>
                  <Text style={styles.projSub}>lucro líquido</Text>
                </View>
                <View style={styles.projDivider} />
                <View style={styles.projectionItem}>
                  <Text style={styles.projLabel}>Por mês</Text>
                  <Text style={styles.projValue}>≈ {formatCurrency(monthly)}</Text>
                  <Text style={styles.projSub}>rendimento mensal</Text>
                </View>
              </View>

              {gainVsSavings > 0 && (
                <View style={styles.vsSavingsBox}>
                  <AppIcon name="trending-up" size={16} color={Colors.brand[500]} />
                  <Text style={styles.vsSavingsText}>
                    Comparado à poupança, você ganha {formatCurrency(gainVsSavings)} a mais em 12 meses
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Histórico da taxa (6 meses)</Text>
            <View style={styles.chartCard}>
              <View style={styles.chartContainer}>
                {bank.rateHistory.map((rate, index) => {
                  const barHeight = ((rate - minRate + 2) / (maxRate - minRate + 4)) * 80;
                  const isLast = index === bank.rateHistory.length - 1;
                  return (
                    <View key={index} style={styles.barWrapper}>
                      <Text style={[styles.barValue, isLast && { color: Colors.brand[500] }]}>
                        {rate.toFixed(0)}
                      </Text>
                      <View
                        style={[
                          styles.bar,
                          { height: barHeight, backgroundColor: isLast ? Colors.brand[500] : Colors.brand[200] },
                        ]}
                      />
                      <Text style={styles.barMonth}>
                        {['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar'][index]}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <Text style={styles.chartCaption}>Como a taxa variou nos últimos 6 meses</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>O que você precisa saber</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <AppIcon name="shield" size={16} color={Colors.fgc.badge} />
                <Text style={styles.detailText}>
                  {bank.fgcCovered
                    ? 'Dinheiro protegido pelo governo até R$ 250 mil'
                    : 'Não coberto pelo FGC — verifique antes de investir'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <AppIcon name="file-text" size={16} color={Colors.neutral[400]} />
                <Text style={styles.detailText}>
                  {bank.hasTax ? 'Paga imposto de renda (IR regressivo)' : 'Livre de imposto de renda'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <AppIcon name="clock" size={16} color={Colors.neutral[400]} />
                <Text style={styles.detailText}>{LIQUIDITY_LABELS[bank.liquidity].label}</Text>
              </View>
              <View style={styles.detailRow}>
                <AppIcon name="dollar-sign" size={16} color={Colors.neutral[400]} />
                <Text style={styles.detailText}>
                  {bank.minimumAmount === 0
                    ? 'Sem valor mínimo para investir'
                    : `Mínimo para começar: ${formatCurrency(bank.minimumAmount)}`}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Segurança do banco</Text>
            <View style={styles.riskCard}>
              <RiskMeter score={bank.riskScore} level={bank.riskLevel} />
              <Text style={styles.riskDesc}>{bank.description}</Text>
            </View>
          </View>

          {!isDesktop && (
            <View style={styles.section}>
              <Text style={styles.redirectNote}>
                Você vai ser redirecionado para o site do banco.
              </Text>
            </View>
          )}
        </WebContainer>
      </ScrollView>
      <AffiliateSheet
        bank={bank}
        visible={affiliateVisible}
        sourceScreen="bank_detail"
        onClose={() => setAffiliateVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  headerInnerDesktop: {
    position: 'relative',
    minHeight: 38,
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerLeftDesktop: {
    paddingRight: 152,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
    flexShrink: 1,
  },
  headerInvestButton: {
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.brand[500],
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  headerInvestButtonDesktop: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 38,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  headerInvestText: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  heroCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    gap: 14,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroName: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
  },
  heroType: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    marginTop: 2,
  },
  heroRate: {
    gap: 4,
  },
  heroRateValue: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    color: Colors.brand[500],
    letterSpacing: -2,
  },
  heroRateLabel: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    lineHeight: 18,
  },
  heroPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  minimum: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[500],
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
    marginBottom: 12,
  },
  simulatorCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    ...shadows.card,
  },
  simLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[500],
  },
  amountRow: {
    flexDirection: 'row',
    gap: 8,
  },
  amountPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.neutral[100],
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
  },
  amountPillActive: {
    backgroundColor: Colors.brand[500],
    borderColor: Colors.brand[500],
  },
  amountText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[700],
  },
  amountTextActive: {
    color: Colors.white,
  },
  projectionBox: {
    flexDirection: 'row',
    backgroundColor: Colors.brand[50],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  projectionItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  projLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.brand[600],
  },
  projValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: Colors.brand[700],
  },
  projSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.brand[500],
  },
  projDivider: {
    width: 1,
    height: 50,
    backgroundColor: Colors.brand[200],
    marginHorizontal: 12,
  },
  vsSavingsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.brand[50],
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.brand[200],
  },
  vsSavingsText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.brand[600],
    lineHeight: 18,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    ...shadows.card,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
  },
  barWrapper: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  barValue: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[500],
  },
  bar: {
    width: 28,
    borderRadius: 6,
    minHeight: 16,
  },
  barMonth: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
  },
  chartCaption: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
    textAlign: 'center',
    marginTop: 12,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    ...shadows.card,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[700],
    lineHeight: 20,
  },
  riskCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    ...shadows.card,
  },
  riskDesc: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    lineHeight: 22,
  },
  redirectNote: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    textAlign: 'center',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[500],
  },
  backLink: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.brand[500],
  },
});
