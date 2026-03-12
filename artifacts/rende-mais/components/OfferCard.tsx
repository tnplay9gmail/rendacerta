import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Bank, calculateReturn, formatCurrency } from '@/constants/data';
import { Colors } from '@/constants/colors';
import { BankLogo } from './BankLogo';
import { LiquidityPill } from './LiquidityPill';
import { AppIcon } from '@/components/ui/AppIcon';

interface OfferCardProps {
  bank: Bank;
  investmentAmount?: number;
  index?: number;
  onInvestPress?: (bank: Bank) => void;
}

export function OfferCard({ bank, investmentAmount = 1000, onInvestPress }: OfferCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const { monthly } = calculateReturn(investmentAmount, bank.cdiRate, 12, bank.hasTax);

  const handleCardPress = () => {
    Haptics.selectionAsync();
    router.push({ pathname: '/banco/[id]', params: { id: bank.id } });
  };

  const handleInvestPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onInvestPress?.(bank);
  };

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.985, useNativeDriver: true, speed: 30 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.card, bank.isRecommended && styles.topCard]}
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Top row */}
        <View style={styles.topRow}>
          <BankLogo bank={bank} size={40} />
          <View style={styles.bankMeta}>
            <Text style={styles.bankName}>{bank.name}</Text>
            <LiquidityPill type={bank.liquidity} />
          </View>
          {bank.isRecommended && (
            <View style={styles.bestBadge}>
              <Text style={styles.bestBadgeText}>Melhor</Text>
            </View>
          )}
        </View>

        {/* Rate — the star of the show */}
        <View style={styles.rateBlock}>
          <Text style={styles.rateValue}>{bank.cdiRate.toFixed(1)}%</Text>
          <Text style={styles.rateUnit}>ao ano</Text>
        </View>

        {/* Projection — one clean line */}
        <Text style={styles.projection}>
          Rende{' '}
          <Text style={styles.projectionHighlight}>≈ {formatCurrency(monthly)}/mês</Text>
          {' '}com {formatCurrency(investmentAmount)}
        </Text>

        {/* Tags */}
        <View style={styles.tags}>
          {bank.fgcCovered && (
            <View style={styles.tag}>
              <AppIcon name="shield" size={11} color={Colors.fgc.badge} />
              <Text style={[styles.tagText, { color: Colors.fgc.badge }]}>Protegido pelo governo</Text>
            </View>
          )}
          {!bank.hasTax && (
            <View style={[styles.tag, styles.tagGreen]}>
              <AppIcon name="tag" size={11} color={Colors.brand[600]} />
              <Text style={[styles.tagText, { color: Colors.brand[600] }]}>Sem imposto</Text>
            </View>
          )}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.cta, bank.isRecommended && styles.ctaPrimary]}
          onPress={handleInvestPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.ctaText, bank.isRecommended && styles.ctaTextPrimary]}>
            Investir na {bank.shortName}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  topCard: {
    borderColor: Colors.brand[300],
    borderWidth: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  bankMeta: {
    flex: 1,
    gap: 5,
  },
  bankName: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
  },
  bestBadge: {
    backgroundColor: Colors.brand[500],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  bestBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
  },
  rateBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 8,
  },
  rateValue: {
    fontSize: 42,
    fontFamily: 'Inter_700Bold',
    color: Colors.brand[500],
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  rateUnit: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
  },
  projection: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    marginBottom: 16,
  },
  projectionHighlight: {
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.fgc.light,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  tagGreen: {
    backgroundColor: Colors.brand[50],
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  cta: {
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  ctaPrimary: {
    backgroundColor: Colors.brand[500],
    borderColor: Colors.brand[500],
  },
  ctaText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[700],
  },
  ctaTextPrimary: {
    color: Colors.white,
  },
});
