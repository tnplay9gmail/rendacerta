export const STORAGE_KEYS = {
  ONBOARDING_COMPLETE: 'onboarding_complete',
  USER_PROFILE: 'user_profile',
  FAVORITES: 'favorites',
} as const;

export type AmountRange = 'ate_1k' | '1k_5k' | '5k_20k' | '20k_50k' | 'acima_50k';
export type LiquidityPreference = 'imediata' | 'meses' | 'longo';
export type RiskPreference = 'taxa' | 'seguranca';

export interface UserProfile {
  availableAmount: AmountRange;
  liquidityPref: LiquidityPreference;
  riskPref: RiskPreference;
}

export const AMOUNT_RANGES: Record<AmountRange, { label: string; value: number }> = {
  ate_1k: { label: 'Ate R$ 1.000', value: 500 },
  '1k_5k': { label: 'R$ 1.000 a R$ 5.000', value: 3000 },
  '5k_20k': { label: 'R$ 5.000 a R$ 20.000', value: 12500 },
  '20k_50k': { label: 'R$ 20.000 a R$ 50.000', value: 35000 },
  acima_50k: { label: 'Acima de R$ 50.000', value: 80000 },
};
