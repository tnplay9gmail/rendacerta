import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Colors } from '@/constants/colors';

type ScreenFadeTransitionProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  durationMs?: number;
  offsetY?: number;
};

export function ScreenFadeTransition({
  children,
  style,
  durationMs = 190,
  offsetY = 4,
}: ScreenFadeTransitionProps) {
  const isFocused = useIsFocused();
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isFocused) return;

    // Keep the screen almost fully opaque to avoid white background flashes.
    opacity.setValue(0.92);
    translateY.setValue(offsetY);

    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: durationMs,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: durationMs,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
    return () => {
      animation.stop();
    };
  }, [isFocused, durationMs, offsetY, opacity, translateY]);

  return (
    <Animated.View style={[styles.container, style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
