import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClayCard } from '@/components/ui/ClayCard';
import { ClaySunkenInput } from '@/components/ui/ClaySunkenInput';
import { signUp } from '@/features/auth/api/authApi';
import { theme } from '@/lib/constants/theme';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await signUp(email.trim(), password, fullName.trim());
      router.replace('/(tabs)/home');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <ClayCard style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Set up your college navigation profile</Text>

        <ClaySunkenInput
          accessibilityLabel="Full Name"
          onChangeText={setFullName}
          placeholder="Full Name"
          style={styles.input}
          value={fullName}
        />
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

        <Pressable onPress={onSubmit} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
        </Pressable>

        <Link href="/(auth)/sign-in" style={styles.link}>
          Already have an account? Sign in
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
    backgroundColor: theme.colors.tertiary,
    borderRadius: theme.radii.pill,
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800'
  },
  link: {
    color: theme.colors.primary,
    marginTop: theme.spacing.lg,
    textAlign: 'center'
  }
});
