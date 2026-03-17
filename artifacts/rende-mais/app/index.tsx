import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { Colors } from '@/constants/colors';
import { STORAGE_KEYS } from '@/constants/storage';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    // Skip onboarding on web — go straight to tabs
    if (Platform.OS === 'web') {
      setOnboardingDone(true);
      setLoading(false);
      return;
    }
    AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE).then((val) => {
      setOnboardingDone(val === 'true');
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.brand[500]} size="large" />
      </View>
    );
  }

  if (onboardingDone) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(onboarding)/boas-vindas" />;
}
