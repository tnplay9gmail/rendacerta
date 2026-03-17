import type { ExpoConfig } from 'expo/config';

const ANDROID_TEST_APP_ID = 'ca-app-pub-3940256099942544~3347511713';
const IOS_TEST_APP_ID = 'ca-app-pub-3940256099942544~1458002511';

const config: ExpoConfig = {
  name: 'RendeMais',
  slug: 'rende-mais',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/logo1greenbg.png',
  scheme: 'rende-mais',
  userInterfaceStyle: 'dark',
  newArchEnabled: false,
  splash: {
    image: './assets/images/logo1greenbg.png',
    resizeMode: 'contain',
    backgroundColor: '#09090B',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.rendemais.app',
  },
  android: {
    package: 'com.rendemais.app',
    versionCode: 1,
    permissions: [
      'INTERNET',
      'ACCESS_NETWORK_STATE',
      'VIBRATE',
      'com.google.android.gms.permission.AD_ID',
    ],
    blockedPermissions: [
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.CAMERA',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.RECORD_AUDIO',
      'android.permission.SYSTEM_ALERT_WINDOW',
    ],
    adaptiveIcon: {
      foregroundImage: './assets/images/logo1greenbg.png',
      backgroundColor: '#2BFDC7',
    },
  },
  web: {
    favicon: './assets/images/logo1greenbg.png',
    name: 'RendeMais — Onde seu dinheiro rende mais',
    description:
      'Compare as melhores taxas de CDB, LCA e LCI dos bancos brasileiros. Calculadora de investimentos gratuita.',
    lang: 'pt-BR',
    themeColor: '#09090B',
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-web-browser',
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: process.env.EXPO_PUBLIC_ADMOB_APP_ID_ANDROID ?? ANDROID_TEST_APP_ID,
        iosAppId: process.env.EXPO_PUBLIC_ADMOB_APP_ID_IOS ?? IOS_TEST_APP_ID,
        userTrackingUsageDescription:
          'Usamos um identificador do dispositivo para exibir anuncios mais relevantes e medir o desempenho da publicidade.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: false,
  },
  extra: {
    eas: {
      projectId: '9ac23cf9-5947-4d08-90eb-caafc753713f',
    },
  },
};

export default config;
