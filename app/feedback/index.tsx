import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ClayCard } from '@/components/ui/ClayCard';
import { FeedbackSentimentPicker } from '@/components/ui/FeedbackSentimentPicker';
import { submitFeedback } from '@/features/feedback/api/feedbackApi';
import { theme } from '@/lib/constants/theme';
import { feedbackSchema, type FeedbackFormValues } from '@/lib/zod/feedback';

const CATEGORIES: FeedbackFormValues['category'][] = ['general', 'report_error', 'suggestion'];

export default function FeedbackScreen() {
  const { building_id } = useLocalSearchParams<{ building_id?: string }>();
  const [submitError, setSubmitError] = useState('');

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
    try {
      await submitFeedback(values);
      router.replace('/(tabs)/home');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit feedback.');
    }
  });

  return (
    <View style={styles.root}>
      <Text style={styles.title}>User Feedback</Text>
      <Text style={styles.subtitle}>Share issues, suggestions, and navigation feedback.</Text>

      <ClayCard style={styles.formCard}>
        <Text style={styles.fieldLabel}>Category</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((option) => {
            const selected = option === category;
            return (
              <Pressable
                key={option}
                onPress={() => setValue('category', option, { shouldValidate: true })}
                style={[styles.categoryChip, selected && styles.categoryChipSelected]}
              >
                <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.fieldLabel}>Sentiment</Text>
        <FeedbackSentimentPicker
          onChange={(next) => setValue('sentiment', next, { shouldValidate: true })}
          value={sentiment}
        />

        <Text style={styles.fieldLabel}>Message</Text>
        <Controller
          control={control}
          name="message"
          render={({ field: { value, onChange } }) => (
            <TextInput
              multiline
              numberOfLines={6}
              onChangeText={onChange}
              placeholder="Describe your experience in detail"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.messageInput}
              value={value}
            />
          )}
        />

        {formState.errors.message ? <Text style={styles.errorText}>{formState.errors.message.message}</Text> : null}
        {submitError.length > 0 ? <Text style={styles.errorText}>{submitError}</Text> : null}

        <Pressable onPress={onSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </Pressable>
      </ClayCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.section
  },
  title: {
    color: theme.colors.primary,
    fontSize: 30,
    fontWeight: '900'
  },
  subtitle: {
    color: theme.colors.textMuted,
    marginTop: 6
  },
  formCard: {
    marginTop: theme.spacing.lg
  },
  fieldLabel: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: theme.spacing.md,
    textTransform: 'uppercase'
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10
  },
  categoryChip: {
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary
  },
  categoryText: {
    color: theme.colors.primary,
    fontWeight: '700'
  },
  categoryTextSelected: {
    color: '#ffffff'
  },
  messageInput: {
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.xl,
    color: theme.colors.primary,
    marginTop: 10,
    minHeight: 120,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    textAlignVertical: 'top'
  },
  errorText: {
    color: theme.colors.danger,
    marginTop: 8
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.tertiary,
    borderRadius: theme.radii.pill,
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800'
  }
});
