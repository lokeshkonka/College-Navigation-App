import { Stack, router } from 'expo-router';
import { useEffect } from 'react';

import { getSession } from '@/features/auth/api/authApi';
import { useQuery } from '@tanstack/react-query';

export default function AuthLayout() {
  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    staleTime: 30_000
  });

  useEffect(() => {
    if (!isLoading && session) {
      router.replace('/(tabs)/home');
    }
  }, [isLoading, session]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
