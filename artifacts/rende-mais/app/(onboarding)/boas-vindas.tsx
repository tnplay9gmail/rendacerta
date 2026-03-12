import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@/components/ui/AppIcon';
import { Colors } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

export default function BoasVindas() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}>
      <ProgressDots current={0} />

      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationCircle}>
          <AppIcon name="trending-up" size={80} color={Colors.brand[500]} />
        </View>
        <View style={styles.sparkle1}>
          <AppIcon name="star" size={16} color={Colors.brand[400]} />
        </View>
        <View style={styles.sparkle2}>
          <AppIcon name="circle" size={10} color={Colors.brand[200]} />
        </View>
        <View style={styles.floatCard}>
          <Text style={styles.floatCardText}>+13,2% ao ano</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.headline}>Seu dinheiro merece render mais</Text>
        <Text style={styles.body}>
          A gente compara os melhores bancos do Brasil pra você.{'\n'}Sem complicação. Sem enrolação.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(onboarding)/quanto-investir')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Começar</Text>
          <AppIcon name="arrow-right" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 48,
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
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    maxHeight: 280,
    position: 'relative',
  },
  illustrationCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle1: {
    position: 'absolute',
    top: 20,
    right: SCREEN_WIDTH / 2 - 110,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 30,
    left: SCREEN_WIDTH / 2 - 100,
  },
  floatCard: {
    position: 'absolute',
    bottom: 10,
    right: SCREEN_WIDTH / 2 - 130,
    backgroundColor: Colors.brand[500],
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    shadowColor: Colors.brand[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  floatCardText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  content: {
    gap: 12,
    marginBottom: 40,
  },
  headline: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
    lineHeight: 40,
  },
  body: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    lineHeight: 24,
  },
  footer: {
    gap: 12,
  },
  button: {
    backgroundColor: Colors.brand[500],
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
  },
});
