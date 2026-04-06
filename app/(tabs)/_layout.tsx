import { Tabs, usePathname } from 'expo-router';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { BottomNavBar } from '@/components/ui/BottomNavBar';
import { getSession } from '@/features/auth/api/authApi';
import { getProfile } from '@/features/profile/api/profileApi';
import { isAdminRole } from '@/lib/auth';
import { theme } from '@/lib/constants/theme';

export default function TabLayout() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('home');

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

  // Update active tab based on pathname
  useEffect(() => {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment && ['home', 'map', 'admin', 'profile'].includes(lastSegment)) {
      setActiveTab(lastSegment);
    }
  }, [pathname]);

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

  // Build tabs array for BottomNavBar
  const tabs = [
    {
      name: 'home',
      icon: 'home' as const,
      label: 'Home',
      onPress: () => router.push('/(tabs)/home')
    },
    {
      name: 'map',
      icon: 'map' as const,
      label: 'Map',
      onPress: () => router.push('/(tabs)/map')
    },
    ...(showAdminTab
      ? [
          {
            name: 'admin',
            icon: 'admin-panel-settings' as const,
            label: 'Admin',
            onPress: () => router.push('/(tabs)/admin')
          }
        ]
      : []),
    {
      name: 'profile',
      icon: 'person' as const,
      label: 'Profile',
      onPress: () => router.push('/(tabs)/profile')
    }
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' } // Hide default tab bar
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="map" />
        {showAdminTab ? <Tabs.Screen name="admin" /> : null}
        <Tabs.Screen name="profile" />
      </Tabs>
      <BottomNavBar tabs={tabs} activeTab={activeTab} />
    </>
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
