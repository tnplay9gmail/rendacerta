import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BANKS, CURRENT_CDI_RATE, type Bank } from '@/constants/data';
import { STORAGE_KEYS, type UserProfile } from '@/constants/storage';
import { DEFAULT_ADS_CONFIG, type AdEventType, type AdFormat, type AdPlacement, type AdsConfig } from '@/services/adMonetization';
import {
  fetchRemoteCatalog,
  isSupabaseConfigured,
  trackAdEvent,
  trackAffiliateClickEvent,
} from '@/services/supabaseCatalog';

type CatalogCachePayload = {
  banks: Bank[];
  currentCdiRate: number;
  cachedAt: string;
  contentVersion: string | null;
  adsConfig?: AdsConfig;
};

type AppDataContextValue = {
  banks: Bank[];
  currentCdiRate: number;
  adsConfig: AdsConfig;
  isCatalogLoading: boolean;
  isBackendEnabled: boolean;
  lastSyncAt: string | null;
  refreshCatalog: () => Promise<void>;
  trackAffiliateClick: (params: {
    bank: Bank;
    sourceScreen: string;
    sourceComponent?: string;
  }) => Promise<void>;
  trackAdEvent: (params: {
    placement: AdPlacement;
    screen: string;
    adFormat: AdFormat;
    eventType: AdEventType;
    sourceComponent?: string;
    valueMicros?: number;
    currencyCode?: string;
  }) => Promise<void>;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [banks, setBanks] = useState<Bank[]>(BANKS);
  const [currentCdiRate, setCurrentCdiRate] = useState(CURRENT_CDI_RATE);
  const [adsConfig, setAdsConfig] = useState<AdsConfig>(DEFAULT_ADS_CONFIG);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [isCatalogLoading, setCatalogLoading] = useState(true);

  const isBackendEnabled = isSupabaseConfigured();

  async function loadCachedCatalog(): Promise<void> {
    const cachedRaw = await AsyncStorage.getItem(STORAGE_KEYS.REMOTE_CATALOG_CACHE);
    if (!cachedRaw) {
      return;
    }

    try {
      const cached = JSON.parse(cachedRaw) as CatalogCachePayload;
      if (Array.isArray(cached.banks) && cached.banks.length > 0) {
        setBanks(cached.banks);
      }
      if (typeof cached.currentCdiRate === 'number') {
        setCurrentCdiRate(cached.currentCdiRate);
      }
      if (cached.cachedAt) {
        setLastSyncAt(cached.cachedAt);
      }
      if (cached.adsConfig) {
        setAdsConfig({ ...DEFAULT_ADS_CONFIG, ...cached.adsConfig });
      }
    } catch {
      await AsyncStorage.removeItem(STORAGE_KEYS.REMOTE_CATALOG_CACHE);
    }
  }

  async function persistCache(payload: CatalogCachePayload): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.REMOTE_CATALOG_CACHE, JSON.stringify(payload));
  }

  async function refreshCatalog(): Promise<void> {
    if (!isBackendEnabled) {
      return;
    }

    const remoteCatalog = await fetchRemoteCatalog();
    if (!remoteCatalog) {
      return;
    }

    const syncAt = new Date().toISOString();
    setBanks(remoteCatalog.banks);
    setCurrentCdiRate(remoteCatalog.currentCdiRate);
    setAdsConfig(remoteCatalog.adsConfig);
    setLastSyncAt(syncAt);

    await persistCache({
      banks: remoteCatalog.banks,
      currentCdiRate: remoteCatalog.currentCdiRate,
      cachedAt: syncAt,
      contentVersion: remoteCatalog.contentVersion,
      adsConfig: remoteCatalog.adsConfig,
    });
  }

  useEffect(() => {
    let active = true;

    async function bootstrap(): Promise<void> {
      try {
        await loadCachedCatalog();
      } catch (error) {
        console.warn('Falha ao carregar catalogo remoto:', error);
      } finally {
        if (active) {
          setCatalogLoading(false);
        }
      }

      // Refresh remote data in background, without blocking the splash.
      void refreshCatalog().catch((error) => {
        console.warn('Falha ao atualizar catalogo remoto:', error);
      });
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  async function trackAffiliateClick(params: {
    bank: Bank;
    sourceScreen: string;
    sourceComponent?: string;
  }): Promise<void> {
    try {
      const profileRaw = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      const profile = profileRaw ? (JSON.parse(profileRaw) as UserProfile) : null;

      await trackAffiliateClickEvent({
        bank: params.bank,
        sourceScreen: params.sourceScreen,
        sourceComponent: params.sourceComponent,
        profile,
      });
    } catch (error) {
      console.warn('Falha ao registrar clique de afiliado:', error);
    }
  }

  async function handleTrackAdEvent(params: {
    placement: AdPlacement;
    screen: string;
    adFormat: AdFormat;
    eventType: AdEventType;
    sourceComponent?: string;
    valueMicros?: number;
    currencyCode?: string;
  }): Promise<void> {
    try {
      await trackAdEvent(params);
    } catch (error) {
      console.warn('Falha ao registrar evento de anuncio:', error);
    }
  }

  const value = useMemo<AppDataContextValue>(
    () => ({
      banks,
      currentCdiRate,
      adsConfig,
      isCatalogLoading,
      isBackendEnabled,
      lastSyncAt,
      refreshCatalog,
      trackAffiliateClick,
      trackAdEvent: handleTrackAdEvent,
    }),
    [banks, currentCdiRate, adsConfig, isCatalogLoading, isBackendEnabled, lastSyncAt],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData precisa estar dentro de <AppDataProvider>');
  }
  return context;
}
