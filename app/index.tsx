import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { getSession } from '@/features/auth/api/authApi';
import { clayShadow, theme } from '@/lib/constants/theme';
import { logger } from '@/services/logger';

export default function SplashScreen() {
  const redirectedRef = useRef(false);
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      })
    ]).start();
  }, [scaleAnim, opacityAnim]);

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
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim
          }
        ]}
      >
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="explore" size={56} color={theme.colors.tertiary} />
          </View>
        </View>

        {/* Brand Text */}
        <Text style={styles.brand}>Tactile Cartographer</Text>
        <Text style={styles.tagline}>Navigate Campus with Precision</Text>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <MaterialIcons name="location-on" size={20} color={theme.colors.tertiary} />
            <Text style={styles.featureText}>Real-Time Routes</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <MaterialIcons name="people" size={20} color={theme.colors.tertiary} />
            <Text style={styles.featureText}>Live Occupancy</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <MaterialIcons name="accessible" size={20} color={theme.colors.tertiary} />
            <Text style={styles.featureText}>Accessibility</Text>
          </View>
        </View>

        {/* Loading Indicator */}
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={theme.colors.tertiary} size="large" />
          <Text style={styles.loadingText}>Preparing your navigation experience...</Text>
        </View>
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Premium Stitch UI Design</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.screenPadding
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400
  },
  logoContainer: {
    marginBottom: theme.spacing['4xl'],
    alignItems: 'center'
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    ...clayShadow,
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 12
  },
  brand: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.primary,
    textAlign: 'center',
    letterSpacing: -0.8,
    marginBottom: theme.spacing.md
  },
  tagline: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: theme.spacing['4xl']
  },
  featuresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.radii['2xl'],
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing['5xl'],
    ...clayShadow,
    shadowOpacity: 0.08
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs
  },
  featureDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.outlineVariant,
    opacity: 0.3,
    marginHorizontal: theme.spacing.md
  },
  featureText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  loaderContainer: {
    alignItems: 'center',
    gap: theme.spacing.lg
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.outline,
    textAlign: 'center'
  },
  footer: {
    position: 'absolute',
    bottom: theme.spacing['4xl'],
    alignItems: 'center'
  },
  footerText: {
    fontSize: 10,
    fontWeight: '500',
    color: theme.colors.outlineVariant,
    letterSpacing: 0.5
  }
});
