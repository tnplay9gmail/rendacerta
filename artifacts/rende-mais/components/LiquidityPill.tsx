import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LiquidityType, LIQUIDITY_LABELS } from '@/constants/data';
import { Colors } from '@/constants/colors';

interface LiquidityPillProps {
  type: LiquidityType;
}

export function LiquidityPill({ type }: LiquidityPillProps) {
  const { label } = LIQUIDITY_LABELS[type];
  const isGood = type === 'D+0';

  return (
    <View style={[styles.pill, isGood && styles.pillGood]}>
      <Text style={[styles.text, isGood && styles.textGood]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.neutral[100],
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  pillGood: {
    backgroundColor: Colors.brand[50],
  },
  text: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[500],
  },
  textGood: {
    color: Colors.brand[600],
  },
});
