import React from 'react';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/AppIcon';
import { Colors } from '@/constants/colors';
import { WebNavbar } from '@/components/web/WebNavbar';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

const isIOS = Platform.OS === 'ios';
const isWeb = Platform.OS === 'web';

function getNativeTabs() {
  if (!isIOS) return null;
  try {
    // Native-only module; avoid bundling for web.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('expo-router/unstable-native-tabs') as typeof import('expo-router/unstable-native-tabs');
  } catch {
    return null;
  }
}

function getSymbolView() {
  if (!isIOS) return null;
  try {
    // Native-only module; avoid bundling for web.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return (require('expo-symbols') as typeof import('expo-symbols')).SymbolView;
  } catch {
    return null;
  }
}

function isLiquidGlassEnabled(): boolean {
  if (!isIOS) return false;
  try {
    // Native-only module; avoid bundling for web.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { isLiquidGlassAvailable } = require('expo-glass-effect') as typeof import('expo-glass-effect');
    return isLiquidGlassAvailable();
  } catch {
    return false;
  }
}

function NativeTabLayout() {
  const nativeTabs = getNativeTabs();
  if (!nativeTabs) {
    return <ClassicTabLayout />;
  }
  const { NativeTabs, Icon, Label } = nativeTabs;
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
        <Label>Início</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="comparar">
        <Icon sf={{ default: 'arrow.left.arrow.right', selected: 'arrow.left.arrow.right' }} />
        <Label>Comparar</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="calcular">
        <Icon sf={{ default: 'percent', selected: 'percent' }} />
        <Label>Calcular</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="perfil">
        <Icon sf={{ default: 'person', selected: 'person.fill' }} />
        <Label>Perfil</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const insets = useSafeAreaInsets();
  const { isDesktop } = useResponsiveLayout();
  const SymbolView = getSymbolView();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: true,
        freezeOnBlur: true,
        tabBarActiveTintColor: Colors.brand[500],
        tabBarInactiveTintColor: Colors.neutral[500],
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter_600SemiBold',
          letterSpacing: 0.2,
        },
        sceneStyle: {
          backgroundColor: Colors.background,
        },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.neutral[100],
          elevation: 0,
          paddingBottom: insets.bottom,
          ...(isWeb && !isDesktop ? { height: 84 } : {}),
          ...(isDesktop ? { display: 'none' as const } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.surface }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) =>
            isIOS && SymbolView ? (
              <SymbolView name="chart.bar" tintColor={color} size={24} />
            ) : (
              <AppIcon name="bar-chart-2" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="comparar"
        options={{
          title: 'Comparar',
          tabBarIcon: ({ color }) =>
            isIOS && SymbolView ? (
              <SymbolView name="arrow.left.arrow.right" tintColor={color} size={24} />
            ) : (
              <AppIcon name="columns" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="calcular"
        options={{
          title: 'Calcular',
          tabBarIcon: ({ color }) =>
            isIOS && SymbolView ? (
              <SymbolView name="percent" tintColor={color} size={24} />
            ) : (
              <AppIcon name="percent" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) =>
            isIOS && SymbolView ? (
              <SymbolView name="person" tintColor={color} size={24} />
            ) : (
              <AppIcon name="user" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  const { isDesktop } = useResponsiveLayout();

  const tabs = isLiquidGlassEnabled()
    ? <NativeTabLayout />
    : <ClassicTabLayout />;

  if (isDesktop && isWeb) {
    return (
      <View style={{ flex: 1 }}>
        <WebNavbar />
        {tabs}
      </View>
    );
  }

  return tabs;
}
