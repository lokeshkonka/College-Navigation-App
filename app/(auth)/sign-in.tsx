import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ClayCard } from '@/components/ui/ClayCard';
import { TextInput } from '@/components/ui/TextInput';
import { resendConfirmationEmail, signIn } from '@/features/auth/api/authApi';
import { theme } from '@/lib/constants/theme';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    setError('');
    setInfo('');
    setEmailNotConfirmed(false);
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)/home');
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Could not sign in.';
      const normalizedMessage = message.toLowerCase();
      if (normalizedMessage.includes('email not confirmed') || normalizedMessage.includes('email_not_confirmed')) {
        setEmailNotConfirmed(true);
        setError('Your email is not confirmed yet. Check your inbox and verify your account first.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onResendConfirmation = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Enter your email first, then tap resend confirmation.');
      return;
    }

    setResendLoading(true);
    setInfo('');
    try {
      await resendConfirmationEmail(trimmedEmail);
      setInfo('Confirmation email sent. Please check your inbox (and spam folder).');
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : 'Could not resend confirmation email.');
    } finally {
      setResendLoading(false);
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
            <Text style={styles.heroTitle}>Welcome Back</Text>
            <Text style={styles.heroSubtitle}>
              Sign in to continue your campus navigation
            </Text>
          </View>

          {/* Form Card */}
          <ClayCard style={styles.formCard}>
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

            {emailNotConfirmed && (
              <Button
                onPress={onResendConfirmation}
                variant="secondary"
                size="medium"
                disabled={resendLoading}
                loading={resendLoading}
                fullWidth
                style={styles.button}
              >
                {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
              </Button>
            )}

            <Button
              onPress={onSubmit}
              variant="primary"
              size="large"
              disabled={!canSubmit}
              loading={loading}
              icon="arrow-forward"
              iconPosition="right"
              fullWidth
              style={styles.primaryButton}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Link href="/(auth)/sign-up" asChild>
              <Button
                onPress={() => {}}
                variant="ghost"
                size="medium"
                fullWidth
              >
                Create a new account
              </Button>
            </Link>
          </ClayCard>

          {/* Footer */}
          <Text style={styles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
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
  button: {
    marginBottom: theme.spacing.md
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
