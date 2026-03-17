import 'react-native-url-polyfill/auto';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Colors } from '@/constants/colors';
import { AppDataProvider, useAppData } from '@/providers/AppDataProvider';
import { initializeMobileAds } from '@/services/mobileAds';

void SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

/** Inject Geist font and global web styles on web only */
function useWebStyles() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const doc = typeof document !== 'undefined' ? document : null;
    if (!doc) return;

    // Preconnect for Google Fonts
    const preconnect1 = doc.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    doc.head.appendChild(preconnect1);

    const preconnect2 = doc.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.setAttribute('crossorigin', '');
    doc.head.appendChild(preconnect2);

    // Load Geist from Google Fonts — full weight range
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap';
    doc.head.appendChild(link);

    // Map Inter font-family names to Geist, and add global web styles
    const style = doc.createElement('style');
    style.textContent = `
      @font-face { font-family: 'Inter_400Regular'; src: local('Geist'); font-weight: 400; }
      @font-face { font-family: 'Inter_500Medium'; src: local('Geist'); font-weight: 500; }
      @font-face { font-family: 'Inter_600SemiBold'; src: local('Geist'); font-weight: 600; }
      @font-face { font-family: 'Inter_700Bold'; src: local('Geist'); font-weight: 700; }

      * { font-family: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

      /* Global cursor pointer for interactive elements */
      [role="button"], button, a, [data-clickable] { cursor: pointer !important; }

      /* Smooth transitions */
      * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

      /* Viewport meta */
      html { scroll-behavior: smooth; }
      body { overflow-x: hidden; }

      /* Remove default outlines — use green border on inputs instead */
      :focus-visible { outline: none !important; }
      input:focus, textarea:focus {
        outline: none !important;
        box-shadow: none !important;
        border-color: #16A34A !important;
      }

      /* Tab slide transition for desktop */
      @media (min-width: 768px) {
        [data-testid="tabContent"], main > div {
          animation: slideIn 0.18s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
      }
    `;
    doc.head.appendChild(style);

    // Viewport meta tag
    let viewportMeta = doc.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = doc.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      doc.head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5');

    // Theme color
    let themeMeta = doc.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = doc.createElement('meta');
      themeMeta.setAttribute('name', 'theme-color');
      doc.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute('content', '#09090B');

    // Description
    let descMeta = doc.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = doc.createElement('meta');
      descMeta.setAttribute('name', 'description');
      doc.head.appendChild(descMeta);
    }
    descMeta.setAttribute(
      'content',
      'Compare as melhores taxas de CDB, LCA e LCI dos bancos brasileiros. Calculadora de investimentos gratuita.',
    );

    // Title
    doc.title = 'RendeMais — Onde seu dinheiro rende mais';
  }, []);
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="banco/[id]" options={{ headerShown: false, presentation: 'card' }} />
    </Stack>
  );
}

function RootApp({ isFontsReady }: { isFontsReady: boolean }) {
  const { isCatalogLoading } = useAppData();
  useWebStyles();

  useEffect(() => {
    void initializeMobileAds().catch(() => {});
  }, []);

  useEffect(() => {
    if (isFontsReady && !isCatalogLoading) {
      void SplashScreen.hideAsync().catch(() => {});
    }
  }, [isFontsReady, isCatalogLoading]);

  if (!isFontsReady || isCatalogLoading) {
    // Keep native splash visible until app bootstrap is complete.
    return null;
  }

  return <RootLayoutNav />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const isFontsReady = fontsLoaded || Boolean(fontError);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppDataProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RootApp isFontsReady={isFontsReady} />
            </GestureHandlerRootView>
          </AppDataProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
