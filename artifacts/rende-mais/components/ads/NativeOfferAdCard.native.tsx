import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  NativeAd,
  NativeAdEventType,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
} from 'react-native-google-mobile-ads';

import { AppIcon } from '@/components/ui/AppIcon';
import { Colors } from '@/constants/colors';
import { useAppData } from '@/providers/AppDataProvider';
import { getNativeAdUnitId } from '@/services/mobileAds';

export function NativeOfferAdCard() {
  const unitId = getNativeAdUnitId();
  const { adsConfig, trackAdEvent } = useAppData();
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const impressionLoggedRef = useRef(false);
  const clickLoggedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let activeAd: NativeAd | null = null;

    async function loadAd() {
      if (!adsConfig.adsEnabled || !adsConfig.homeNativeEnabled || !unitId) {
        return;
      }

      try {
        const loadedAd = await NativeAd.createForAdRequest(unitId);
        if (!isMounted) {
          loadedAd.destroy();
          return;
        }

        activeAd = loadedAd;
        setNativeAd(loadedAd);
      } catch {
        if (isMounted) {
          setLoadFailed(true);
        }
      }
    }

    void loadAd();

    return () => {
      isMounted = false;
      activeAd?.destroy();
    };
  }, [adsConfig.adsEnabled, adsConfig.homeNativeEnabled, unitId]);

  useEffect(() => {
    if (!nativeAd) {
      return;
    }

    const impressionSubscription = nativeAd.addAdEventListener(NativeAdEventType.IMPRESSION, () => {
      if (impressionLoggedRef.current) return;
      impressionLoggedRef.current = true;
      void trackAdEvent({
        placement: 'home_native_feed',
        screen: 'home',
        adFormat: 'native',
        eventType: 'impression',
      });
    });

    const clickSubscription = nativeAd.addAdEventListener(NativeAdEventType.CLICKED, () => {
      if (clickLoggedRef.current) return;
      clickLoggedRef.current = true;
      void trackAdEvent({
        placement: 'home_native_feed',
        screen: 'home',
        adFormat: 'native',
        eventType: 'click',
      });
    });

    return () => {
      impressionSubscription.remove();
      clickSubscription.remove();
      nativeAd.destroy();
    };
  }, [nativeAd, trackAdEvent]);

  if (!adsConfig.adsEnabled || !adsConfig.homeNativeEnabled || !unitId || loadFailed || !nativeAd) {
    return null;
  }

  return (
    <View style={styles.shell}>
      <Text style={styles.sponsoredLabel}>Patrocinado</Text>
      <NativeAdView nativeAd={nativeAd} style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.identityRow}>
            <View style={styles.logoWrap}>
              {nativeAd.icon?.url ? (
                <NativeAsset assetType={NativeAssetType.ICON}>
                  <Image source={{ uri: nativeAd.icon.url }} style={styles.logoImage} resizeMode="contain" />
                </NativeAsset>
              ) : (
                <View style={styles.logoFallback}>
                  <Text style={styles.logoFallbackText}>AD</Text>
                </View>
              )}
            </View>
            <View style={styles.bankMeta}>
              <NativeAsset assetType={NativeAssetType.HEADLINE}>
                <Text numberOfLines={2} style={styles.bankName}>
                  {nativeAd.headline}
                </Text>
              </NativeAsset>
              <Text style={styles.byline}>Parceiro patrocinado</Text>
            </View>
          </View>
        </View>

        <View style={styles.rateBlock}>
          <Text style={styles.rateValue}>Oferta</Text>
          <Text style={styles.rateUnit}>sugerida</Text>
        </View>

        <NativeAsset assetType={NativeAssetType.BODY}>
          <Text numberOfLines={3} style={styles.body}>
            {nativeAd.body}
          </Text>
        </NativeAsset>

        <View style={styles.tags}>
          <View style={styles.tag}>
            <AppIcon name="shield" size={11} color={Colors.brand[600]} />
            <Text style={styles.tagText}>Anuncio verificado</Text>
          </View>
        </View>

        <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
          <View style={styles.cta}>
            <Text style={styles.ctaText}>{nativeAd.callToAction || 'Saiba mais'}</Text>
          </View>
        </NativeAsset>
      </NativeAdView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginBottom: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    backgroundColor: Colors.glass.surface,
    overflow: 'hidden',
  },
  sponsoredLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 0,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.glass.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  logoFallback: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFallbackText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[700],
  },
  bankMeta: {
    flex: 1,
    gap: 4,
  },
  bankName: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[950],
  },
  byline: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[500],
  },
  rateBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 10,
  },
  rateValue: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[900],
    letterSpacing: -1,
  },
  rateUnit: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
  },
  body: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    lineHeight: 20,
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.brand[50],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.brand[600],
  },
  cta: {
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  ctaText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[700],
  },
});

