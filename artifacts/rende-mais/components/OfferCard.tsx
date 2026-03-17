import React, { memo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Bank, CURRENT_CDI_RATE, calculateReturnWithBaseCdi, formatCurrency } from '@/constants/data';
import { Colors } from '@/constants/colors';
import { BankLogo } from './BankLogo';
import { LiquidityPill } from './LiquidityPill';
import { AppIcon } from '@/components/ui/AppIcon';

interface OfferCardProps {
  bank: Bank;
  investmentAmount?: number;
  currentCdiRate?: number;
  index?: number;
  isBest?: boolean;
  onInvestPress?: (bank: Bank) => void;
}

export const OfferCard = memo(function OfferCard({
  bank,
  investmentAmount = 1000,
  currentCdiRate = CURRENT_CDI_RATE,
  isBest = false,
  onInvestPress,
}: OfferCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const [hovered, setHovered] = useState(false);
  const [investHovered, setInvestHovered] = useState(false);
  const isWeb = Platform.OS === 'web';

  const { monthly } = calculateReturnWithBaseCdi(
    investmentAmount,
    bank.cdiRate,
    12,
    bank.hasTax,
    currentCdiRate,
  );

  const handleCardPress = () => {
    Haptics.selectionAsync();
    router.push({ pathname: '/banco/[id]', params: { id: bank.id } });
  };

  const handleInvestPress = () => {
    onInvestPress?.(bank);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.985, useNativeDriver: true, speed: 30 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  const webHoverProps = isWeb
    ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      }
    : {};

  return (
    <Animated.View style={[{ transform: [{ scale }] }, isWeb && { flex: 1 }]}>
      <TouchableOpacity
        style={[
          styles.card,
          isBest && styles.topCard,
          hovered && styles.cardHovered,
          isWeb && { cursor: 'pointer' as unknown as undefined, flex: 1 },
        ]}
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        {...webHoverProps}
      >
        {/* Top row */}
        <View style={styles.topRow}>
          <BankLogo bank={bank} size={40} />
          <View style={styles.bankMeta}>
            <Text style={styles.bankName} numberOfLines={1}>{bank.name}</Text>
          </View>
          {isBest && (
            <View style={styles.bestBadge}>
              <Text style={styles.bestBadgeText}>Melhor</Text>
            </View>
          )}
        </View>
        <LiquidityPill type={bank.liquidity} />

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
        <View style={{ marginTop: 'auto' as unknown as number }}>
          <TouchableOpacity
            style={[
              styles.cta,
              isBest && styles.ctaPrimary,
              investHovered && styles.ctaHovered,
              investHovered && isBest && styles.ctaPrimaryHovered,
            ]}
            onPress={handleInvestPress}
            activeOpacity={0.8}
            {...(isWeb ? {
              onMouseEnter: () => setInvestHovered(true),
              onMouseLeave: () => setInvestHovered(false),
            } : {})}
          >
            <Text style={[styles.ctaText, isBest && styles.ctaTextPrimary]}>
              Investir na {bank.shortName}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

OfferCard.displayName = 'OfferCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
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
  cardHovered: {
    borderColor: Colors.brand[300],
    transform: [{ scale: 1.005 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
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
    overflow: 'visible' as unknown as undefined,
  },
  ctaHovered: {
    boxShadow: '0 0 20px 4px rgba(22, 163, 74, 0.25), 0 0 40px 8px rgba(22, 163, 74, 0.1)' as unknown as undefined,
    borderColor: Colors.brand[300],
    transform: [{ scale: 1.01 }],
  },
  ctaPrimary: {
    backgroundColor: Colors.brand[500],
    borderColor: Colors.brand[500],
  },
  ctaPrimaryHovered: {
    backgroundColor: Colors.brand[600],
    boxShadow: '0 0 24px 6px rgba(22, 163, 74, 0.35), 0 0 48px 12px rgba(22, 163, 74, 0.15)' as unknown as undefined,
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
