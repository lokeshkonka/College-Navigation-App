import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ClayCard } from '@/components/ui/ClayCard';
import { TextInput } from '@/components/ui/TextInput';
import { signUp } from '@/features/auth/api/authApi';
import { theme } from '@/lib/constants/theme';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = fullName.trim().length > 0 && email.trim().length > 0 && password.length > 0 && !loading;

  const onSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setError('');
    setInfo('');
    try {
      const result = await signUp(email.trim(), password, fullName.trim());
      if (result.needsEmailConfirmation) {
        setInfo('Account created. Please confirm your email, then sign in.');
        setTimeout(() => {
          router.replace('/(auth)/sign-in');
        }, 2000);
        return;
      }

      router.replace('/(tabs)/home');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoIcon}>🧭</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>Get Started</Text>
            <Text style={styles.heroSubtitle}>
              Create your account and start navigating campus like a pro
            </Text>
          </View>

          {/* Form Card */}
          <ClayCard style={styles.formCard}>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
              label="Full Name"
              autoCapitalize="words"
              leftIcon="person"
              accessibilityLabel="Full Name"
              style={styles.input}
            />

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              label="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
              accessibilityLabel="Email"
              style={styles.input}
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              label="Password"
              secureTextEntry={!showPassword}
              leftIcon="lock"
              rightIcon={showPassword ? 'visibility' : 'visibility-off'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              accessibilityLabel="Password"
              style={styles.input}
            />

            {/* Password requirements */}
            <View style={styles.passwordHint}>
              <Text style={styles.passwordHintText}>
                • Minimum 8 characters
              </Text>
            </View>

            {error.length > 0 && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {info.length > 0 && (
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>{info}</Text>
              </View>
            )}

            <Button
              onPress={onSubmit}
              variant="tertiary"
              size="large"
              disabled={!canSubmit}
              loading={loading}
              icon="arrow-forward"
              iconPosition="right"
              fullWidth
              style={styles.primaryButton}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Link href="/(auth)/sign-in" asChild>
              <Button
                onPress={() => {}}
                variant="ghost"
                size="medium"
                fullWidth
              >
                Already have an account? Sign in
              </Button>
            </Link>
          </ClayCard>

          {/* Footer */}
          <Text style={styles.footerText}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  scrollContent: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing['6xl'],
    paddingBottom: theme.spacing['3xl']
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: theme.spacing['4xl']
  },
  logoContainer: {
    marginBottom: theme.spacing['2xl']
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: theme.radii.xl,
    backgroundColor: theme.colors.tertiaryContainer,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoIcon: {
    fontSize: 40
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: -1
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: theme.spacing.xl
  },
  formCard: {
    marginBottom: theme.spacing.xl
  },
  input: {
    marginBottom: theme.spacing.lg
  },
  passwordHint: {
    marginBottom: theme.spacing.lg
  },
  passwordHintText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18
  },
  errorContainer: {
    backgroundColor: theme.colors.errorContainer,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onErrorContainer,
    lineHeight: 18
  },
  infoContainer: {
    backgroundColor: theme.colors.tertiaryContainer,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onTertiaryContainer,
    lineHeight: 18
  },
  primaryButton: {
    marginTop: theme.spacing.lg
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xl
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
    opacity: 0.3
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.outline,
    marginHorizontal: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.outlineVariant,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: theme.spacing.xl
  }
});
