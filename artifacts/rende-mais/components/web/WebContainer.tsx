import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface WebContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Override the default max width */
  maxWidth?: number;
}

/**
 * Centers content with a max width on desktop/tablet.
 * On mobile, renders children as-is with no extra wrapping.
 */
export function WebContainer({ children, style, maxWidth }: WebContainerProps) {
  const { contentMaxWidth } = useResponsiveLayout();
  const effectiveMax = maxWidth ?? contentMaxWidth;

  if (!effectiveMax) {
    // Mobile – no wrapper needed
    return <>{children}</>;
  }

  return (
    <View style={[styles.container, { maxWidth: effectiveMax }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%' as unknown as number,
    marginHorizontal: 'auto' as unknown as number,
    paddingHorizontal: 40,
  },
});
