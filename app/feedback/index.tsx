import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ClayCard } from '@/components/ui/ClayCard';
import { FeedbackSentimentPicker } from '@/components/ui/FeedbackSentimentPicker';
import { FloatingHeader } from '@/components/ui/FloatingHeader';
import { submitFeedback } from '@/features/feedback/api/feedbackApi';
import { theme } from '@/lib/constants/theme';
import { feedbackSchema, type FeedbackFormValues } from '@/lib/zod/feedback';

const CATEGORIES: Array<{ value: FeedbackFormValues['category']; label: string; icon: string }> = [
  { value: 'general', label: 'General', icon: 'chat' },
  { value: 'report_error', label: 'Report Error', icon: 'error' },
  { value: 'suggestion', label: 'Suggestion', icon: 'lightbulb' }
];

export default function FeedbackScreen() {
  const { building_id } = useLocalSearchParams<{ building_id?: string }>();
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, setValue, watch, formState } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      category: 'general',
      sentiment: 3,
      message: '',
      building_id
    }
  });

  const category = watch('category');
  const sentiment = watch('sentiment');

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await submitFeedback(values);
      router.replace('/(tabs)/home');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}
    >
      <FloatingHeader title="User Feedback" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="feedback" size={32} color={theme.colors.tertiary} />
          </View>
          <Text style={styles.pageTitle}>Share Your Feedback</Text>
          <Text style={styles.pageSubtitle}>
            Help us improve your navigation experience by sharing issues, suggestions, and feedback.
          </Text>
        </View>

        {/* Form Card */}
        <ClayCard style={styles.formCard}>
          {/* Category Selection */}
          <Text style={styles.fieldLabel}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((option) => {
              const selected = option.value === category;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setValue('category', option.value, { shouldValidate: true })}
                  style={({ pressed }) => [
                    styles.categoryCard,
                    selected && styles.categoryCardSelected,
                    pressed && styles.categoryCardPressed
                  ]}
                >
                  <MaterialIcons
                    name={option.icon as unknown as keyof typeof MaterialIcons.glyphMap}
                    size={24}
                    color={selected ? theme.colors.onTertiary : theme.colors.primary}
                  />
                  <Text style={[styles.categoryLabel, selected && styles.categoryLabelSelected]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Sentiment Picker */}
          <Text style={styles.fieldLabel}>How was your experience?</Text>
          <View style={styles.sentimentContainer}>
            <FeedbackSentimentPicker
              onChange={(next) => setValue('sentiment', next, { shouldValidate: true })}
              value={sentiment}
            />
          </View>

          {/* Message Input */}
          <Text style={styles.fieldLabel}>Your Message</Text>
          <Controller
            control={control}
            name="message"
            render={({ field: { value, onChange } }) => (
              <View style={styles.messageInputContainer}>
                <TextInput
                  multiline
                  numberOfLines={6}
                  onChangeText={onChange}
                  placeholder="Describe your experience in detail..."
                  placeholderTextColor={theme.colors.outlineVariant}
                  style={styles.messageInput}
                  value={value}
                  textAlignVertical="top"
                />
              </View>
            )}
          />

          {/* Error Messages */}
          {formState.errors.message && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error" size={16} color={theme.colors.onErrorContainer} />
              <Text style={styles.errorText}>{formState.errors.message.message}</Text>
            </View>
          )}

          {submitError.length > 0 && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error" size={16} color={theme.colors.onErrorContainer} />
              <Text style={styles.errorText}>{submitError}</Text>
            </View>
          )}

          {/* Submit Button */}
          <Button
            onPress={onSubmit}
            variant="tertiary"
            size="large"
            loading={isSubmitting}
            disabled={isSubmitting || !formState.isValid}
            icon="send"
            iconPosition="right"
            fullWidth
            style={styles.submitButton}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </ClayCard>

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          Your feedback helps us create better navigation experiences for everyone on campus.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingTop: 110,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: 120
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing['4xl']
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.tertiaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.5
  },
  pageSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: theme.spacing.xl
  },
  formCard: {
    marginBottom: theme.spacing.xl
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md
  },
  categoryCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  categoryCardSelected: {
    backgroundColor: theme.colors.tertiary,
    borderColor: theme.colors.tertiary
  },
  categoryCardPressed: {
    opacity: 0.7
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'center'
  },
  categoryLabelSelected: {
    color: theme.colors.onTertiary
  },
  sentimentContainer: {
    marginBottom: theme.spacing.md
  },
  messageInputContainer: {
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing.md,
    shadowColor: '#2b3438',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0
  },
  messageInput: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.onSurface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    minHeight: 140
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.errorContainer,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onErrorContainer,
    flex: 1
  },
  submitButton: {
    marginTop: theme.spacing.lg
  },
  footerNote: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.outlineVariant,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: theme.spacing.xl
  }
});
