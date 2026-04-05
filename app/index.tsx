import { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { getSession } from '@/features/auth/api/authApi';
import { theme } from '@/lib/constants/theme';
import { logger } from '@/services/logger';

export default function SplashScreen() {
  const redirectedRef = useRef(false);

  useEffect(() => {
    let active = true;

    const fallbackTimeout = setTimeout(() => {
      if (!redirectedRef.current && active) {
        redirectedRef.current = true;
        router.replace('/(auth)/sign-in');
      }
    }, 5000);

    const bootstrap = async () => {
      try {
        const session = await getSession();
        if (!active || redirectedRef.current) {
          return;
        }

        redirectedRef.current = true;
        if (session) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(auth)/sign-in');
        }
      } catch (error) {
        logger.error('Session bootstrap failed', error);
        if (!redirectedRef.current && active) {
          redirectedRef.current = true;
          router.replace('/(auth)/sign-in');
        }
      }
    };

    bootstrap();

    return () => {
      active = false;
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return (
    <View style={styles.root}>
      <Text style={styles.brand}>Tactile Cartographer</Text>
      <Text style={styles.subtitle}>Campus navigation with live occupancy and route intelligence</Text>
      <ActivityIndicator color={theme.colors.tertiary} size="large" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.section
  },
  brand: {
    color: theme.colors.primary,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center'
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center'
  },
  loader: {
    marginTop: 20
  }
});
