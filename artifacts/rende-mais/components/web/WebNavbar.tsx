import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import { usePathname, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface NavItem {
  label: string;
  href: string;
  icon: AppIconName;
  matchPrefix: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Início', href: '/(tabs)', icon: 'bar-chart-2', matchPrefix: '/(tabs)' },
  { label: 'Comparar', href: '/(tabs)/comparar', icon: 'columns', matchPrefix: '/comparar' },
  { label: 'Calcular', href: '/(tabs)/calcular', icon: 'percent', matchPrefix: '/calcular' },
  { label: 'Perfil', href: '/(tabs)/perfil', icon: 'user', matchPrefix: '/perfil' },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.matchPrefix === '/(tabs)') {
    return pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index';
  }
  return pathname.includes(item.matchPrefix);
}

export function WebNavbar() {
  const { isMobile } = useResponsiveLayout();
  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  if (isMobile || Platform.OS !== 'web') return null;

  return (
    <View style={styles.navbar}>
      <View style={styles.inner}>
        {/* Brand */}
        <TouchableOpacity
          style={styles.brand}
          onPress={() => router.push('/(tabs)')}
          activeOpacity={0.8}
        >
          <Image
            source={require('@/assets/images/logo1greenbg.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>
            Rende<Text style={styles.brandHighlight}>Mais</Text>
          </Text>
        </TouchableOpacity>

        {/* Nav Links */}
        <View style={styles.navLinks}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item);
            const hovered = hoveredHref === item.href;
            return (
              <Pressable
                key={item.href}
                style={({ pressed }) => [
                  styles.navLink,
                  hovered && styles.navLinkHover,
                  active && styles.navLinkActive,
                  pressed && styles.navLinkPressed,
                ]}
                onPress={() => router.push(item.href as '/(tabs)')}
                onHoverIn={() => setHoveredHref(item.href)}
                onHoverOut={() => setHoveredHref((prev) => (prev === item.href ? null : prev))}
              >
                <AppIcon
                  name={item.icon}
                  size={18}
                  color={active ? Colors.brand[600] : hovered ? Colors.neutral[800] : Colors.neutral[500]}
                />
                <Text style={[styles.navLinkText, hovered && styles.navLinkTextHover, active && styles.navLinkTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
    position: 'sticky' as unknown as undefined,
    top: 0,
    zIndex: 100,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    maxWidth: 960,
    width: '100%' as unknown as number,
    marginHorizontal: 'auto' as unknown as number,
    paddingHorizontal: 40,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer' as unknown as undefined,
  },
  logoImage: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  brandName: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
    letterSpacing: -0.3,
  },
  brandHighlight: {
    color: Colors.brand[500],
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    cursor: 'pointer' as unknown as undefined,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'transparent',
    transitionDuration: '160ms' as unknown as undefined,
    transitionProperty: 'background-color, border-color, box-shadow, transform' as unknown as undefined,
    transitionTimingFunction: 'ease' as unknown as undefined,
  },
  navLinkHover: {
    backgroundColor: Colors.neutral[50],
    borderColor: Colors.neutral[200],
    boxShadow: '0 8px 20px rgba(24,24,27,0.06)' as unknown as undefined,
    transform: [{ translateY: -1 }],
  },
  navLinkActive: {
    backgroundColor: Colors.brand[100],
  },
  navLinkPressed: {
    opacity: 0.8,
  },
  navLinkText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: Colors.neutral[600],
  },
  navLinkTextHover: {
    color: Colors.neutral[800],
  },
  navLinkTextActive: {
    color: Colors.brand[600],
    fontFamily: 'Inter_600SemiBold',
  },
});
