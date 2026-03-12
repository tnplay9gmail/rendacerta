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
import { RiskPreference, STORAGE_KEYS } from '@/constants/storage';

const OPTIONS: { key: RiskPreference; label: string; sub: string; icon: AppIconName; color: string }[] = [
  {
    key: 'taxa',
    label: 'Quero a maior taxa possível',
    sub: 'Maximizar meu rendimento',
    icon: 'zap',
    color: Colors.brand[500],
  },
  {
    key: 'seguranca',
    label: 'Prefiro segurança e proteção',
    sub: 'Bancos mais sólidos, FGC garantido',
    icon: 'shield',
    color: Colors.fgc.badge,
  },
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

export default function Prioridade() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<RiskPreference | null>(null);

  const handleSelect = (key: RiskPreference) => {
    Haptics.selectionAsync();
    setSelected(key);
  };

  const handleFinish = async () => {
    if (!selected) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    const profile = existing ? JSON.parse(existing) : {};
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify({ ...profile, riskPref: selected })
    );
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}>
      <ProgressDots current={3} />

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <AppIcon name="arrow-left" size={22} color={Colors.neutral[700]} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.headline}>O que é mais importante pra você?</Text>
        <Text style={styles.body}>
          Isso ajuda a gente a mostrar as melhores opções pra você.
        </Text>

        <View style={styles.options}>
          {OPTIONS.map(({ key, label, sub, icon, color }) => (
            <TouchableOpacity
              key={key}
              style={[styles.option, selected === key && styles.optionSelected]}
              onPress={() => handleSelect(key)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, { backgroundColor: selected === key ? `${color}20` : Colors.neutral[100] }]}>
                <AppIcon name={icon} size={28} color={selected === key ? color : Colors.neutral[400]} />
              </View>
              <Text style={[styles.optionLabel, selected === key && { color: Colors.neutral[950] }]}>
                {label}
              </Text>
              <Text style={[styles.optionSub, selected === key && { color: Colors.neutral[600] }]}>
                {sub}
              </Text>
              {selected === key && (
                <View style={[styles.checkmark, { backgroundColor: color }]}>
                  <AppIcon name="check" size={14} color={Colors.white} weight="fill" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, !selected && styles.buttonDisabled]}
        onPress={handleFinish}
        disabled={!selected}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Ver minha indicação</Text>
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
    gap: 16,
    marginTop: 8,
  },
  option: {
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  optionSelected: {
    borderColor: Colors.brand[500],
    backgroundColor: Colors.brand[50],
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[700],
    textAlign: 'center',
  },
  optionSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
