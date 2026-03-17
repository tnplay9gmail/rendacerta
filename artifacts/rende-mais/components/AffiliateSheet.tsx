import React, { useRef, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Linking,
  Dimensions,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '@/components/ui/AppIcon';
import { Bank } from '@/constants/data';
import { Colors, shadows } from '@/constants/colors';
import { BankLogo } from './BankLogo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface AffiliateSheetProps {
  bank: Bank | null;
  visible: boolean;
  sourceScreen: string;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function AffiliateSheet({ bank, visible, sourceScreen: _sourceScreen, onClose }: AffiliateSheetProps) {
  const scale = useRef(new Animated.Value(0.94)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const { isDesktop } = useResponsiveLayout();
  const isWebDesktop = Platform.OS === 'web' && isDesktop;
  const [continueHovered, setContinueHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);

  useLayoutEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          damping: 20,
          stiffness: 260,
          mass: 0.75,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.96,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (bank?.affiliateUrl) {
      await Linking.openURL(bank.affiliateUrl);
    }
    onClose();
  };

  if (!bank) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          style={[
            styles.modalCard,
            {
              maxHeight: SCREEN_HEIGHT - insets.top - insets.bottom - 36,
              opacity: cardOpacity,
              transform: [{ scale }],
            },
          ]}
        >
          <View style={styles.bankRow}>
            <BankLogo bank={bank} size={48} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetTitle}>Abrindo o site da {bank.name}...</Text>
              <Text style={styles.sheetDesc}>
                Você vai ser redirecionado para criar sua conta. Pode levar alguns segundos.
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <AppIcon name="shield" size={16} color={Colors.brand[500]} />
            <Text style={styles.infoText}>
              Parceiro verificado pelo Rende Mais. Seus dados são protegidos.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.continueButton, continueHovered && isWebDesktop && styles.continueButtonHover]}
            onPress={handleContinue}
            activeOpacity={0.85}
            {...(isWebDesktop
              ? {
                  onMouseEnter: () => setContinueHovered(true),
                  onMouseLeave: () => setContinueHovered(false),
                }
              : {})}
          >
            <Text style={styles.continueText}>Continuar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={[styles.cancelButton, cancelHovered && isWebDesktop && styles.cancelButtonHover]}
            {...(isWebDesktop
              ? {
                  onMouseEnter: () => setCancelHovered(true),
                  onMouseLeave: () => setCancelHovered(false),
                }
              : {})}
          >
            <Text style={[styles.cancelText, cancelHovered && isWebDesktop && styles.cancelTextHover]}>Cancelar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.48)',
  },
  modalCard: {
    backgroundColor: Colors.surface,
    width: '100%' as unknown as number,
    maxWidth: 460,
    borderRadius: 20,
    padding: 20,
    paddingTop: 20,
    ...shadows.level3,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
  },
  sheetDesc: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    marginTop: 3,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.brand[50],
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[700],
  },
  continueButton: {
    backgroundColor: Colors.brand[500],
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    transitionDuration: '160ms' as unknown as undefined,
    transitionProperty: 'background-color, border-color, box-shadow, transform' as unknown as undefined,
    transitionTimingFunction: 'ease' as unknown as undefined,
  },
  continueButtonHover: {
    backgroundColor: Colors.brand[600],
    boxShadow: '0 8px 22px rgba(22,163,74,0.24)' as unknown as undefined,
    transform: [{ translateY: -1 }],
  },
  continueText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    transitionDuration: '160ms' as unknown as undefined,
    transitionProperty: 'background-color, color' as unknown as undefined,
    transitionTimingFunction: 'ease' as unknown as undefined,
  },
  cancelButtonHover: {
    backgroundColor: Colors.neutral[50],
  },
  cancelText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[500],
  },
  cancelTextHover: {
    color: Colors.neutral[700],
  },
});
