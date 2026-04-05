import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClayCard } from '@/components/ui/ClayCard';
import { ClaySunkenInput } from '@/components/ui/ClaySunkenInput';
import { signIn } from '@/features/auth/api/authApi';
import { theme } from '@/lib/constants/theme';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)/home');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <ClayCard style={styles.card}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Continue to your campus assistant</Text>

        <ClaySunkenInput
          accessibilityLabel="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          style={styles.input}
          value={email}
        />
        <ClaySunkenInput
          accessibilityLabel="Password"
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
        />

        {error.length > 0 ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable disabled={!canSubmit} onPress={onSubmit} style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]}>
          <Text style={styles.primaryButtonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </Pressable>

        <Link href="/(auth)/sign-up" style={styles.link}>
          Create a new account
        </Link>
      </ClayCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.section
  },
  card: {
    width: '100%'
  },
  title: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: '900'
  },
  subtitle: {
    color: theme.colors.textMuted,
    marginTop: 6
  },
  input: {
    marginTop: theme.spacing.md
  },
  error: {
    color: theme.colors.danger,
    marginTop: theme.spacing.md
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.pill,
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  primaryButtonDisabled: {
    opacity: 0.55
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800'
  },
  link: {
    color: theme.colors.tertiary,
    marginTop: theme.spacing.lg,
    textAlign: 'center'
  }
});
