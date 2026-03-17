import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { AppIcon } from '@/components/ui/AppIcon';
import { ScreenFadeTransition } from '@/components/ui/ScreenFadeTransition';
import * as Haptics from 'expo-haptics';
import { Colors, shadows } from '@/constants/colors';
import { STORAGE_KEYS, UserProfile, AMOUNT_RANGES, type AmountRange, type LiquidityPreference, type RiskPreference } from '@/constants/storage';
import { useAppData } from '@/providers/AppDataProvider';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { WebContainer } from '@/components/web/WebContainer';

const LIQUIDITY_OPTS: { key: LiquidityPreference; label: string; sub: string }[] = [
  { key: 'imediata', label: 'Imediata', sub: 'Saque quando quiser' },
  { key: 'meses', label: 'Alguns meses', sub: 'Posso esperar um pouco' },
  { key: 'longo', label: 'Longo prazo', sub: 'Não preciso por enquanto' },
];

const RISK_OPTS: { key: RiskPreference; label: string; sub: string }[] = [
  { key: 'taxa', label: 'Maior rendimento', sub: 'Priorizo a melhor taxa' },
  { key: 'seguranca', label: 'Mais segurança', sub: 'Priorizo bancos conhecidos' },
];

export default function PerfilScreen() {
  const { currentCdiRate } = useAppData();
  const insets = useSafeAreaInsets();
  const { isDesktop } = useResponsiveLayout();
  const isWebDesktop = Platform.OS === 'web' && isDesktop;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formAmount, setFormAmount] = useState<AmountRange>('1k_5k');
  const [formLiquidity, setFormLiquidity] = useState<LiquidityPreference>('meses');
  const [formRisk, setFormRisk] = useState<RiskPreference>('taxa');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE).then((val) => {
      if (val) setProfile(JSON.parse(val));
    });
  }, []);

  const handleReset = () => {
    if (isWebDesktop) {
      // Toggle inline form
      if (!showForm) {
        // Pre-fill with current profile if exists
        if (profile) {
          setFormAmount(profile.availableAmount);
          setFormLiquidity(profile.liquidityPref);
          setFormRisk(profile.riskPref);
        }
      }
      setShowForm(!showForm);
      return;
    }
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
            try {
              await AsyncStorage.multiSet([
                [STORAGE_KEYS.ONBOARDING_COMPLETE, 'false'],
                [STORAGE_KEYS.USER_PROFILE, ''],
              ]);
              await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
              setProfile(null);
              router.replace('/(onboarding)/boas-vindas');
            } catch {
              Alert.alert('Erro', 'Nao foi possivel reiniciar o questionario agora.');
            }
          },
        },
      ]
    );
  };

  const handleFormSave = async () => {
    const newProfile: UserProfile = {
      availableAmount: formAmount,
      liquidityPref: formLiquidity,
      riskPref: formRisk,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(newProfile));
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
    setProfile(newProfile);
    setShowForm(false);
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
      case 'taxa': return 'Maior taxa possível';
      case 'seguranca': return 'Segurança em primeiro lugar';
      default: return '-';
    }
  };

  const investorProfile = profile?.riskPref === 'taxa' ? 'Perfil arrojado' : 'Perfil conservador';

  return (
    <ScreenFadeTransition>
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Header — full width */}
        <View style={[styles.header, { paddingTop: isDesktop ? 32 : insets.top + 20 }]}>
          <WebContainer style={{ paddingHorizontal: 20 }}>
            <Text style={styles.title}>Perfil</Text>
          </WebContainer>
        </View>

        <WebContainer>

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
            <Text style={styles.sectionLabel}>Suas preferências</Text>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Valor disponível</Text>
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
                <Text style={[styles.rateNum, { color: Colors.brand[500] }]}>{currentCdiRate}%</Text>
              </View>
              <View style={styles.rateDivider} />
              <View style={styles.rateItem}>
                <Text style={styles.rateName}>Poupança</Text>
                <Text style={styles.rateNum}>8,26%</Text>
              </View>
              <View style={styles.rateDivider} />
              <View style={styles.rateItem}>
                <Text style={styles.rateName}>IPCA</Text>
                <Text style={[styles.rateNum, { color: Colors.warning.DEFAULT }]}>4,26%</Text>
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
              <Text style={styles.menuLabel}>{isWebDesktop ? 'Definir perfil' : 'Refazer questionário'}</Text>
              <AppIcon name="chevron-right" size={16} color={Colors.neutral[300]} />
            </TouchableOpacity>
            {/* Inline form for web */}
            {isWebDesktop && showForm && (
              <View style={styles.inlineForm}>
                <Text style={styles.formLabel}>Quanto pretende investir?</Text>
                <View style={styles.formChipRow}>
                  {(Object.entries(AMOUNT_RANGES) as [AmountRange, { label: string }][]).map(([key, { label }]) => (
                    <TouchableOpacity
                      key={key}
                      style={[styles.formChip, formAmount === key && styles.formChipActive]}
                      onPress={() => setFormAmount(key)}
                    >
                      <Text style={[styles.formChipText, formAmount === key && styles.formChipTextActive]}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.formLabel}>Precisa de liquidez?</Text>
                <View style={styles.formChipRow}>
                  {LIQUIDITY_OPTS.map(({ key, label }) => (
                    <TouchableOpacity
                      key={key}
                      style={[styles.formChip, formLiquidity === key && styles.formChipActive]}
                      onPress={() => setFormLiquidity(key)}
                    >
                      <Text style={[styles.formChipText, formLiquidity === key && styles.formChipTextActive]}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.formLabel}>O que é mais importante?</Text>
                <View style={styles.formChipRow}>
                  {RISK_OPTS.map(({ key, label }) => (
                    <TouchableOpacity
                      key={key}
                      style={[styles.formChip, formRisk === key && styles.formChipActive]}
                      onPress={() => setFormRisk(key)}
                    >
                      <Text style={[styles.formChipText, formRisk === key && styles.formChipTextActive]}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.formSaveBtn} onPress={handleFormSave} activeOpacity={0.85}>
                  <Text style={styles.formSaveBtnText}>Salvar preferências</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.separator} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/sobre-rende-mais')}
              activeOpacity={0.7}
            >
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
        </WebContainer>
      </ScrollView>
    </View>
    </ScreenFadeTransition>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: Colors.neutral[950] },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  profileHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
    ...shadows.card,
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
  heroSub: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.neutral[500], marginTop: 3 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral[100],
    ...shadows.card,
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
  rateName: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.neutral[500] },
  rateNum: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.neutral[700] },
  ratesNote: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
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
  footerVersion: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.neutral[400] },
  footerDisclaimer: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
    textAlign: 'center',
    lineHeight: 17,
  },
  inlineForm: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
    gap: 16,
  },
  formLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  formChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
  },
  formChipActive: {
    borderColor: Colors.brand[500],
    backgroundColor: Colors.brand[50],
  },
  formChipText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[600],
  },
  formChipTextActive: {
    color: Colors.brand[600],
    fontFamily: 'Inter_600SemiBold',
  },
  formSaveBtn: {
    backgroundColor: Colors.brand[500],
    borderRadius: 12,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
  },
  formSaveBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.white,
  },
});
