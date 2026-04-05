import { Tabs } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { getProfile } from '@/features/profile/api/profileApi';
import { isAdminRole } from '@/lib/auth';
import { theme } from '@/lib/constants/theme';

export default function TabLayout() {
  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 2 * 60_000
  });

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
