import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Linking,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '@/components/ui/AppIcon';
import { Bank } from '@/constants/data';
import { Colors, shadows } from '@/constants/colors';
import { BankLogo } from './BankLogo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AffiliateSheetProps {
  bank: Bank | null;
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function AffiliateSheet({ bank, visible, onClose }: AffiliateSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 250,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
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
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          style={[styles.sheet, { paddingBottom: insets.bottom + 16, transform: [{ translateY }] }]}
        >
          <View style={styles.handle} />

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

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.85}>
            <Text style={styles.continueText}>Continuar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 12,
    ...shadows.level3,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.neutral[300],
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
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
  },
  continueText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[500],
  },
});
