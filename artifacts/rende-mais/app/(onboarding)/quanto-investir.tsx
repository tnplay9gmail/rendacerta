import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '@/components/ui/AppIcon';
import { Colors } from '@/constants/colors';
import { AmountRange, STORAGE_KEYS } from '@/constants/storage';

const OPTIONS: { key: AmountRange; label: string; sub: string }[] = [
  { key: 'ate_1k', label: 'Até R$ 1.000', sub: 'Perfeito para começar' },
  { key: '1k_5k', label: 'R$ 1.000 a R$ 5.000', sub: 'Boa faixa de entrada' },
  { key: '5k_20k', label: 'R$ 5.000 a R$ 20.000', sub: 'Boas opções disponíveis' },
  { key: '20k_50k', label: 'R$ 20.000 a R$ 50.000', sub: 'Mais possibilidades' },
  { key: 'acima_50k', label: 'Acima de R$ 50.000', sub: 'Melhores taxas do mercado' },
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

export default function QuantoInvestir() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<AmountRange | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);
  const ctaTopYRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const currentScrollYRef = useRef(0);
  const hasAutoScrolledRef = useRef(false);

  const autoScrollToCta = useCallback(() => {
    if (hasAutoScrolledRef.current) return;

    const viewportHeight = viewportHeightRef.current;
    const contentHeight = contentHeightRef.current;
    const ctaTop = ctaTopYRef.current;

    if (viewportHeight <= 0 || contentHeight <= 0 || ctaTop <= 0) return;

    const maxScroll = Math.max(0, contentHeight - viewportHeight);
    const targetScrollY = Math.max(0, Math.min(ctaTop - 20, maxScroll));
    const isAlreadyNearTarget = Math.abs(currentScrollYRef.current - targetScrollY) < 24;

    hasAutoScrolledRef.current = true;
    if (isAlreadyNearTarget) return;

    scrollRef.current?.scrollTo({ y: targetScrollY, animated: true });
  }, []);

  const handleSelect = (key: AmountRange) => {
    Haptics.selectionAsync();
    setSelected(key);
    setTimeout(() => {
      autoScrollToCta();
    }, 120);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    currentScrollYRef.current = event.nativeEvent.contentOffset.y;
  };

  const handleNext = async () => {
    if (!selected) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    const profile = existing ? JSON.parse(existing) : {};
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify({ ...profile, availableAmount: selected })
    );
    router.push('/(onboarding)/por-quanto-tempo');
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={[
        styles.containerContent,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onLayout={(event) => {
        viewportHeightRef.current = event.nativeEvent.layout.height;
      }}
      onContentSizeChange={(_, height) => {
        contentHeightRef.current = height;
      }}
    >
      <ProgressDots current={1} />

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <AppIcon name="arrow-left" size={22} color={Colors.neutral[700]} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.headline}>Quanto você quer deixar rendendo?</Text>
        <Text style={styles.body}>
          Não precisa ser tudo. Começa com o que você tem disponível.
        </Text>

        <View style={styles.options}>
          {OPTIONS.map(({ key, label, sub }) => (
            <TouchableOpacity
              key={key}
              style={[styles.option, selected === key && styles.optionSelected]}
              onPress={() => handleSelect(key)}
              activeOpacity={0.8}
            >
              <View style={styles.optionInner}>
                <View>
                  <Text style={[styles.optionLabel, selected === key && styles.optionLabelSelected]}>
                    {label}
                  </Text>
                  <Text style={[styles.optionSub, selected === key && styles.optionSubSelected]}>
                    {sub}
                  </Text>
                </View>
                <View style={[styles.radio, selected === key && styles.radioSelected]}>
                  {selected === key && <View style={styles.radioDot} />}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View
        onLayout={(event) => {
          ctaTopYRef.current = event.nativeEvent.layout.y;
        }}
      >
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  containerContent: {
    paddingHorizontal: 24,
    flexGrow: 1,
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
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Colors.brand[500],
    width: 24,
  },
  dotInactive: {
    backgroundColor: Colors.neutral[200],
  },
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
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
    borderRadius: 14,
    padding: 16,
    backgroundColor: Colors.surface,
  },
  optionSelected: {
    borderColor: Colors.brand[500],
    backgroundColor: Colors.brand[50],
  },
  optionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
  },
  optionLabelSelected: {
    color: Colors.brand[600],
  },
  optionSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    marginTop: 2,
  },
  optionSubSelected: {
    color: Colors.brand[500],
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.brand[500],
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.brand[500],
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
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
  },
});
