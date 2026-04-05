import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PropsWithChildren } from 'react';
import { useQuery } from '@tanstack/react-query';

import { ClayCard } from '@/components/ui/ClayCard';
import { getProfile } from '@/features/profile/api/profileApi';
import { isAdminRole } from '@/lib/auth';
import { theme } from '@/lib/constants/theme';

export function AdminGate({ children }: PropsWithChildren) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });

  if (isPending) {
    return (
      <View style={styles.centered}>
        <Text style={styles.stateText}>Checking admin access...</Text>
      </View>
    );
  }

  if (isError || !data || !isAdminRole(data.role)) {
    return (
      <View style={styles.centered}>
        <ClayCard style={styles.deniedCard}>
          <Text style={styles.deniedTitle}>Admin access required</Text>
          <Text style={styles.deniedBody}>This section is available only for admin and super admin roles.</Text>
          <Pressable onPress={() => router.replace('/(tabs)/home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go to Home</Text>
          </Pressable>
        </ClayCard>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  centered: {
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg
  },
  stateText: {
    color: theme.colors.primary,
    textAlign: 'center'
  },
  deniedCard: {
    gap: theme.spacing.md
  },
  deniedTitle: {
    color: theme.colors.danger,
    fontSize: 20,
    fontWeight: '900'
  },
  deniedBody: {
    color: theme.colors.textMuted,
    lineHeight: 20
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.pill,
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.md
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '800'
  }
});
