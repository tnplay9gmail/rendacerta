import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  ScrollView,
  Switch,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { AppIcon } from '@/components/ui/AppIcon';
import { LiquidityType, InvestmentType } from '@/constants/data';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.82;

export interface FilterState {
  investmentType: InvestmentType | 'todos';
  liquidity: LiquidityType | 'todos';
  minRate: number;
  fgcOnly: boolean;
  noTaxOnly: boolean;
  maxMinimum: number;
}

export const DEFAULT_FILTERS: FilterState = {
  investmentType: 'todos',
  liquidity: 'todos',
  minRate: 0,
  fgcOnly: false,
  noTaxOnly: false,
  maxMinimum: 0,
};

interface FilterSheetProps {
  visible: boolean;
  filters: FilterState;
  onApply: (f: FilterState) => void;
  onClose: () => void;
}

const INVESTMENT_OPTIONS: { key: InvestmentType | 'todos'; label: string; sub: string }[] = [
  { key: 'todos', label: 'Todos', sub: 'Qualquer tipo' },
  { key: 'CDB', label: 'CDB', sub: 'Com imposto de renda' },
  { key: 'LCI', label: 'LCI', sub: 'Isento de IR · imóveis' },
  { key: 'LCA', label: 'LCA', sub: 'Isento de IR · agro' },
];

const LIQUIDITY_OPTIONS: { key: LiquidityType | 'todos'; label: string; sub: string }[] = [
  { key: 'todos', label: 'Qualquer', sub: '' },
  { key: 'D+0', label: 'Imediata', sub: 'Saque quando quiser' },
  { key: 'D+1', label: 'D+1', sub: 'Disponível amanhã' },
  { key: 'D+30', label: 'D+30', sub: 'Disponível em 30 dias' },
];

const RATE_OPTIONS = [
  { value: 0, label: 'Qualquer' },
  { value: 100, label: '100%+ CDI' },
  { value: 110, label: '110%+ CDI' },
  { value: 115, label: '115%+ CDI' },
  { value: 120, label: '120%+ CDI' },
];

const MINIMUM_OPTIONS = [
  { value: 0, label: 'Qualquer' },
  { value: 500, label: 'Até R$ 500' },
  { value: 1000, label: 'Até R$ 1.000' },
  { value: 5000, label: 'Até R$ 5.000' },
];

export function FilterSheet({ visible, filters, onApply, onClose }: FilterSheetProps) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [draft, setDraft] = React.useState<FilterState>(filters);

  useEffect(() => {
    if (visible) {
      setDraft(filters);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 200 }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateY, { toValue: SHEET_HEIGHT, useNativeDriver: true, damping: 20, stiffness: 200 }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const set = <K extends keyof FilterState>(key: K, val: FilterState[K]) => {
    Haptics.selectionAsync();
    setDraft((d) => ({ ...d, [key]: val }));
  };

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(DEFAULT_FILTERS);

  const activeCount = [
    draft.investmentType !== 'todos',
    draft.liquidity !== 'todos',
    draft.minRate > 0,
    draft.fgcOnly,
    draft.noTaxOnly,
    draft.maxMinimum > 0,
  ].filter(Boolean).length;

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose} statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        {/* Glass header */}
        <BlurView intensity={70} tint="light" style={styles.sheetHeader}>
          <View style={styles.glassOverlay} />
          <View style={styles.sheetHandle} />
          <View style={styles.sheetTitleRow}>
            <Text style={styles.sheetTitle}>Filtros</Text>
            {hasChanges && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>{activeCount} ativo{activeCount !== 1 ? 's' : ''}</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => { Haptics.selectionAsync(); setDraft(DEFAULT_FILTERS); }}
              style={styles.resetBtn}
            >
              <Text style={styles.resetText}>Limpar</Text>
            </TouchableOpacity>
          </View>
        </BlurView>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

          {/* Investment type */}
          <View style={styles.group}>
            <Text style={styles.groupLabel}>Tipo de produto</Text>
            {INVESTMENT_OPTIONS.map(({ key, label, sub }) => (
              <TouchableOpacity
                key={key}
                style={[styles.option, draft.investmentType === key && styles.optionSelected]}
                onPress={() => set('investmentType', key)}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <Text style={[styles.optionLabel, draft.investmentType === key && styles.optionLabelSelected]}>{label}</Text>
                  {sub ? <Text style={styles.optionSub}>{sub}</Text> : null}
                </View>
                {draft.investmentType === key && (
                  <View style={styles.checkCircle}>
                    <AppIcon name="check" size={13} color={Colors.white} weight="fill" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Liquidity */}
          <View style={styles.group}>
            <Text style={styles.groupLabel}>Liquidez</Text>
            <View style={styles.chipRow}>
              {LIQUIDITY_OPTIONS.map(({ key, label, sub }) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.chip, draft.liquidity === key && styles.chipSelected]}
                  onPress={() => set('liquidity', key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipLabel, draft.liquidity === key && styles.chipLabelSelected]}>{label}</Text>
                  {sub ? <Text style={[styles.chipSub, draft.liquidity === key && styles.chipSubSelected]}>{sub}</Text> : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Min rate */}
          <View style={styles.group}>
            <Text style={styles.groupLabel}>Taxa mínima</Text>
            <View style={styles.chipRow}>
              {RATE_OPTIONS.map(({ value, label }) => (
                <TouchableOpacity
                  key={value}
                  style={[styles.pill, draft.minRate === value && styles.pillSelected]}
                  onPress={() => set('minRate', value)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, draft.minRate === value && styles.pillTextSelected]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Aplicação mínima */}
          <View style={styles.group}>
            <Text style={styles.groupLabel}>Aplicação mínima</Text>
            <View style={styles.chipRow}>
              {MINIMUM_OPTIONS.map(({ value, label }) => (
                <TouchableOpacity
                  key={value}
                  style={[styles.pill, draft.maxMinimum === value && styles.pillSelected]}
                  onPress={() => set('maxMinimum', value)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, draft.maxMinimum === value && styles.pillTextSelected]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Toggles */}
          <View style={styles.group}>
            <Text style={styles.groupLabel}>Características</Text>
            <View style={styles.toggleCard}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleLeft}>
                  <View style={[styles.toggleIcon, { backgroundColor: Colors.fgc.light }]}>
                    <AppIcon name="shield" size={16} color={Colors.fgc.badge} />
                  </View>
                  <View>
                    <Text style={styles.toggleLabel}>Protegido pelo FGC</Text>
                    <Text style={styles.toggleSub}>Garantia até R$ 250 mil</Text>
                  </View>
                </View>
                <Switch
                  value={draft.fgcOnly}
                  onValueChange={(v) => set('fgcOnly', v)}
                  trackColor={{ false: Colors.neutral[200], true: Colors.brand[400] }}
                  thumbColor={draft.fgcOnly ? Colors.brand[500] : Colors.white}
                />
              </View>
              <View style={styles.toggleSep} />
              <View style={styles.toggleRow}>
                <View style={styles.toggleLeft}>
                  <View style={[styles.toggleIcon, { backgroundColor: Colors.brand[50] }]}>
                    <AppIcon name="tag" size={16} color={Colors.brand[500]} />
                  </View>
                  <View>
                    <Text style={styles.toggleLabel}>Sem imposto de renda</Text>
                    <Text style={styles.toggleSub}>LCI, LCA e isentos</Text>
                  </View>
                </View>
                <Switch
                  value={draft.noTaxOnly}
                  onValueChange={(v) => set('noTaxOnly', v)}
                  trackColor={{ false: Colors.neutral[200], true: Colors.brand[400] }}
                  thumbColor={draft.noTaxOnly ? Colors.brand[500] : Colors.white}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Glass CTA */}
        <BlurView intensity={80} tint="light" style={styles.ctaBar}>
          <View style={styles.ctaGlassOverlay} />
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onApply(draft); }}
            activeOpacity={0.85}
          >
            <Text style={styles.applyText}>Ver resultados</Text>
          </TouchableOpacity>
        </BlurView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.40)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#F5F5F7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  sheetHeader: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
  },
  activeBadge: {
    backgroundColor: Colors.brand[500],
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 10,
  },
  activeBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.white,
  },
  resetBtn: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  resetText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[400],
  },
  scrollContent: {
    flex: 1,
  },
  group: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  groupLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[400],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: Colors.brand[400],
    backgroundColor: Colors.brand[50],
  },
  optionLeft: { flex: 1 },
  optionLabel: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[700],
  },
  optionLabelSelected: { color: Colors.brand[600] },
  optionSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  chipSelected: { borderColor: Colors.brand[400], backgroundColor: Colors.brand[50] },
  chipLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.neutral[600] },
  chipLabelSelected: { color: Colors.brand[600] },
  chipSub: { fontSize: 10, fontFamily: 'Inter_400Regular', color: Colors.neutral[400], marginTop: 2 },
  chipSubSelected: { color: Colors.brand[400] },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  pillSelected: { borderColor: Colors.brand[400], backgroundColor: Colors.brand[50] },
  pillText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.neutral[600] },
  pillTextSelected: { color: Colors.brand[600], fontFamily: 'Inter_700Bold' },
  toggleCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.neutral[950] },
  toggleSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.neutral[400], marginTop: 2 },
  toggleSep: { height: 1, backgroundColor: Colors.neutral[100], marginLeft: 64 },
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  ctaGlassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(245,245,247,0.80)',
  },
  applyBtn: {
    backgroundColor: Colors.neutral[950],
    borderRadius: 16,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    letterSpacing: 0.2,
  },
});
