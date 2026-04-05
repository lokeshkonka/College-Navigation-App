import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { AppProviders } from '@/components/providers/AppProviders';
import { theme } from '@/lib/constants/theme';
import { validateRuntimeEnv } from '@/lib/env';

const envValidation = validateRuntimeEnv({
  EXPO_PUBLIC_SUPABASE_URL: process.env['EXPO_PUBLIC_SUPABASE_URL'],
  EXPO_PUBLIC_SUPABASE_KEY: process.env['EXPO_PUBLIC_SUPABASE_KEY']
});

export default function RootLayout() {
  if (!envValidation.success) {
    return (
      <View style={styles.envErrorContainer}>
        <Text style={styles.envErrorTitle}>Environment setup error</Text>
        {envValidation.error.issues.map((issue) => (
          <Text key={`${issue.path.join('.')}-${issue.message}`} style={styles.envErrorText}>
            {issue.path.join('.')}: {issue.message}
          </Text>
        ))}
      </View>
    );
  }

  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="search" />
        <Stack.Screen name="building/[id]" />
        <Stack.Screen name="route" />
        <Stack.Screen name="feedback" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="admin-link" />
      </Stack>
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  envErrorContainer: {
    backgroundColor: theme.colors.background,
    flex: 1,
    gap: theme.spacing.sm,
    justifyContent: 'center',
    padding: theme.spacing.section
  },
  envErrorTitle: {
    color: theme.colors.danger,
    fontSize: 24,
    fontWeight: '800'
  },
  envErrorText: {
    color: theme.colors.primary,
    fontSize: 14
  }
});
