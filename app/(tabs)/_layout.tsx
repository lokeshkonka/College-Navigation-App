import { Tabs } from 'expo-router';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { getSession } from '@/features/auth/api/authApi';
import { getProfile } from '@/features/profile/api/profileApi';
import { isAdminRole } from '@/lib/auth';
import { theme } from '@/lib/constants/theme';

export default function TabLayout() {
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    staleTime: 30_000
  });

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.replace('/(auth)/sign-in');
    }
  }, [isSessionLoading, session]);

  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 2 * 60_000
  });

  if (isSessionLoading) {
    return (
      <View style={styles.loadingRoot}>
        <ActivityIndicator color={theme.colors.tertiary} size="large" />
      </View>
    );
  }

  if (!session) {
    return null;
  }

  const showAdminTab = Boolean(data && isAdminRole(data.role));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tertiary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          height: 64
        },
        tabBarLabelStyle: {
          fontWeight: '700',
          marginBottom: 8
        }
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="map" options={{ title: 'Map' }} />
      {showAdminTab ? <Tabs.Screen name="admin" options={{ title: 'Admin' }} /> : null}
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingRoot: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center'
  }
});
