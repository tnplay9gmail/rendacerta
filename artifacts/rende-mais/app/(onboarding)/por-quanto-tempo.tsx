import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { AppIcon, AppIconName } from '@/components/ui/AppIcon';
import { Colors } from '@/constants/colors';
import { LiquidityPreference, STORAGE_KEYS } from '@/constants/storage';

const OPTIONS: { key: LiquidityPreference; label: string; sub: string; icon: AppIconName }[] = [
  { key: 'imediata', label: 'Quero poder sacar quando quiser', sub: 'Liquidez imediata (D+0)', icon: 'zap' },
  { key: 'meses', label: 'Posso esperar alguns meses', sub: 'Liquidez em D+30', icon: 'calendar' },
  { key: 'longo', label: 'Não vou precisar por mais de 1 ano', sub: 'Maior taxa possível', icon: 'trending-up' },
];

function ProgressDots({ current }: { current: number }) {
  return (
    <View style={styles.dots}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={[styles.dot, i === current ? styles.dotActive : styles.dotInactive]}
        />
      ))}
    </View>
  );
}

export default function PorQuantoTempo() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<LiquidityPreference | null>(null);

  const handleSelect = (key: LiquidityPreference) => {
    Haptics.selectionAsync();
    setSelected(key);
  };

  const handleNext = async () => {
    if (!selected) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    const profile = existing ? JSON.parse(existing) : {};
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify({ ...profile, liquidityPref: selected })
    );
    router.push('/(onboarding)/prioridade');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}>
      <ProgressDots current={2} />

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AppIcon name="arrow-left" size={22} color={Colors.neutral[700]} />
        </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.headline}>Quando você pode precisar do dinheiro?</Text>
        <Text style={styles.body}>
          Não tem resposta certa. Cada situação é diferente.
        </Text>

        <View style={styles.options}>
          {OPTIONS.map(({ key, label, sub, icon }) => (
            <TouchableOpacity
              key={key}
              style={[styles.option, selected === key && styles.optionSelected]}
              onPress={() => handleSelect(key)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, selected === key && styles.iconBoxSelected]}>
                <AppIcon name={icon} size={20} color={selected === key ? Colors.brand[500] : Colors.neutral[400]} />
              </View>
              <View style={styles.optionTexts}>
                <Text style={[styles.optionLabel, selected === key && styles.optionLabelSelected]}>
                  {label}
                </Text>
                <Text style={[styles.optionSub, selected === key && styles.optionSubSelected]}>
                  {sub}
                </Text>
              </View>
              {selected === key && (
                <AppIcon name="check-circle" size={20} color={Colors.brand[500]} weight="fill" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, !selected && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={!selected}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Próximo</Text>
        <AppIcon name="arrow-right" size={20} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: Colors.brand[500], width: 24 },
  dotInactive: { backgroundColor: Colors.neutral[200] },
  content: {
    flex: 1,
    gap: 16,
  },
  headline: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
    lineHeight: 36,
  },
  body: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    lineHeight: 22,
  },
  options: {
    gap: 12,
    marginTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
    borderRadius: 14,
    padding: 16,
    gap: 14,
    backgroundColor: Colors.white,
  },
  optionSelected: {
    borderColor: Colors.brand[500],
    backgroundColor: Colors.brand[50],
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    backgroundColor: Colors.brand[100],
  },
  optionTexts: { flex: 1 },
  optionLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
  },
  optionLabelSelected: { color: Colors.brand[700] },
  optionSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
    marginTop: 2,
  },
  optionSubSelected: { color: Colors.brand[500] },
  button: {
    backgroundColor: Colors.brand[500],
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: {
    color: Colors.white,
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
  },
});
