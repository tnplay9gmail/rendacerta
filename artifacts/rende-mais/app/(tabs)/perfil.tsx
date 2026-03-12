import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { AppIcon } from '@/components/ui/AppIcon';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { STORAGE_KEYS, UserProfile, AMOUNT_RANGES } from '@/constants/storage';
import { CURRENT_CDI_RATE } from '@/constants/data';


export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE).then((val) => {
      if (val) setProfile(JSON.parse(val));
    });
  }, []);


  const handleReset = () => {
    Alert.alert(
      'Refazer as perguntas?',
      'Você vai responder novamente ao questionário inicial.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Refazer',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
            router.replace('/(onboarding)/boas-vindas');
          },
        },
      ]
    );
  };

  const getLiquidityLabel = () => {
    switch (profile?.liquidityPref) {
      case 'imediata': return 'Saque quando quiser';
      case 'meses': return 'Posso esperar alguns meses';
      case 'longo': return 'Mais de 1 ano';
      default: return '-';
    }
  };

  const getRiskLabel = () => {
    switch (profile?.riskPref) {
      case 'taxa': return 'Maior taxa possivel';
      case 'seguranca': return 'Seguranca em primeiro lugar';
      default: return '-';
    }
  };


  const investorProfile = profile?.riskPref === 'taxa' ? 'Perfil arrojado' : 'Perfil conservador';

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        {/* Investor type */}
        <View style={styles.section}>
          <View style={styles.profileHero}>
            <View style={styles.avatar}>
              <AppIcon name="user" size={28} color={Colors.brand[500]} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>{investorProfile}</Text>
              <Text style={styles.heroSub}>Baseado nas suas respostas</Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        {profile && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Suas preferencias</Text>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Valor disponivel</Text>
                <Text style={styles.rowValue}>
                  {profile.availableAmount ? AMOUNT_RANGES[profile.availableAmount].label : '-'}
                </Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Prazo</Text>
                <Text style={styles.rowValue}>{getLiquidityLabel()}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Prioridade</Text>
                <Text style={styles.rowValue}>{getRiskLabel()}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Market rates */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Taxas hoje</Text>
          <View style={styles.card}>
            <View style={styles.ratesRow}>
              <View style={styles.rateItem}>
                <Text style={styles.rateName}>CDI</Text>
                <Text style={[styles.rateNum, { color: Colors.brand[500] }]}>{CURRENT_CDI_RATE}%</Text>
              </View>
              <View style={styles.rateDivider} />
              <View style={styles.rateItem}>
                <Text style={styles.rateName}>Poupança</Text>
                <Text style={styles.rateNum}>6,17%</Text>
              </View>
              <View style={styles.rateDivider} />
              <View style={styles.rateItem}>
                <Text style={styles.rateName}>IPCA</Text>
                <Text style={[styles.rateNum, { color: Colors.warning.DEFAULT }]}>4,83%</Text>
              </View>
            </View>
            <Text style={styles.ratesNote}>Valores anuais · referência de março/2026</Text>
          </View>
        </View>

        {/* FGC explainer */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>O que é o FGC?</Text>
          <View style={[styles.card, { padding: 18 }]}>
            <View style={styles.fgcTop}>
              <View style={styles.fgcIcon}>
                <AppIcon name="shield" size={18} color={Colors.fgc.badge} />
              </View>
              <Text style={styles.fgcTitle}>Fundo Garantidor de Créditos</Text>
            </View>
            <Text style={styles.fgcBody}>
              Garante até{' '}
              <Text style={styles.fgcHighlight}>R$ 250 mil por banco</Text>. Se a instituição tiver algum problema, o governo devolve seu dinheiro. É uma proteção criada pelo Banco Central.
            </Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Configurações</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem} onPress={handleReset} activeOpacity={0.7}>
              <AppIcon name="sliders" size={18} color={Colors.neutral[500]} />
              <Text style={styles.menuLabel}>Refazer questionário</Text>
              <AppIcon name="chevron-right" size={16} color={Colors.neutral[300]} />
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.menuItem} onPress={() => {}} activeOpacity={0.7}>
              <AppIcon name="info" size={18} color={Colors.neutral[500]} />
              <Text style={styles.menuLabel}>Sobre o Rende Mais</Text>
              <AppIcon name="chevron-right" size={16} color={Colors.neutral[300]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerVersion}>Rende Mais v1.0.0</Text>
          <Text style={styles.footerDisclaimer}>
            As taxas exibidas são indicativas e podem variar. Não constituem recomendação de investimento.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: Colors.neutral[950] },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[400],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  profileHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { flex: 1 },
  heroTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: Colors.neutral[950] },
  heroSub: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.neutral[400], marginTop: 3 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  rowLabel: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.neutral[500] },
  rowValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  separator: { height: 1, backgroundColor: Colors.neutral[100] },
  ratesRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
  },
  rateItem: { flex: 1, alignItems: 'center', gap: 4 },
  rateDivider: { width: 1, backgroundColor: Colors.neutral[100] },
  rateName: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.neutral[400] },
  rateNum: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.neutral[700] },
  ratesNote: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[300],
    textAlign: 'center',
    paddingBottom: 14,
  },
  fgcTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  fgcIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.fgc.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fgcTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.neutral[950] },
  fgcBody: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.neutral[500], lineHeight: 22 },
  fgcHighlight: { fontFamily: 'Inter_700Bold', color: Colors.fgc.badge },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.neutral[950] },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 32,
    alignItems: 'center',
    gap: 8,
  },
  footerVersion: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.neutral[300] },
  footerDisclaimer: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[300],
    textAlign: 'center',
    lineHeight: 17,
  },
});
