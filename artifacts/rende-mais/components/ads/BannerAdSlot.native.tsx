import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, shadows } from '@/constants/colors';
import { useAppData } from '@/providers/AppDataProvider';
import { getBannerAdUnitId } from '@/services/mobileAds';

export function BannerAdSlot() {
  const unitId = getBannerAdUnitId();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { adsConfig, trackAdEvent } = useAppData();
  const [isLoaded, setLoaded] = useState(false);
  const impressionLoggedRef = useRef(false);
  const clickLoggedRef = useRef(false);
  const adWidth = Math.max(280, Math.floor(width - 24));

  if (!adsConfig.adsEnabled || !adsConfig.homeBannerEnabled || !unitId) {
    return null;
  }

  return (
    <View style={[styles.shell, { bottom: insets.bottom + 62 }]} pointerEvents="box-none">
      <View style={styles.card}>
        <Text style={styles.label}>Patrocinado</Text>
        <View style={styles.adWrap}>
          <BannerAd
            unitId={unitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            width={adWidth}
            requestOptions={{ networkExtras: { collapsible: 'bottom' } }}
            onAdLoaded={() => {
              setLoaded(true);
              if (impressionLoggedRef.current) return;
              impressionLoggedRef.current = true;
              void trackAdEvent({
                placement: 'home_banner_bottom',
                screen: 'home',
                adFormat: 'banner',
                eventType: 'impression',
              });
            }}
            onAdFailedToLoad={() => setLoaded(false)}
            onAdOpened={() => {
              if (clickLoggedRef.current) return;
              clickLoggedRef.current = true;
              void trackAdEvent({
                placement: 'home_banner_bottom',
                screen: 'home',
                adFormat: 'banner',
                eventType: 'click',
              });
            }}
            onPaid={(paid) => {
              void trackAdEvent({
                placement: 'home_banner_bottom',
                screen: 'home',
                adFormat: 'banner',
                eventType: 'paid',
                valueMicros: paid.value,
                currencyCode: paid.currency,
              });
            }}
          />
          {!isLoaded ? <View style={styles.loadingState} /> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 74,
    zIndex: 12,
  },
  card: {
    borderRadius: 16,
    backgroundColor: Colors.glass.surface,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 0,
    overflow: 'hidden',
    ...shadows.glass,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Colors.neutral[500],
    marginBottom: 6,
    marginLeft: 12,
  },
  adWrap: {
    width: '100%',
    alignItems: 'center',
  },
  loadingState: {
    height: 52,
    width: '100%',
  },
});
