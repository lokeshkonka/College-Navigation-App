import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/lib/constants/theme';

type FeedbackSentimentPickerProps = {
  value: number;
  onChange: (next: number) => void;
};

export function FeedbackSentimentPicker({ value, onChange }: FeedbackSentimentPickerProps) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((score) => {
        const selected = value === score;
        return (
          <Pressable
            key={score}
            accessibilityLabel={`Set sentiment ${score}`}
            onPress={() => onChange(score)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{score}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: theme.spacing.md
  },
  option: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.pill,
    height: 36,
    justifyContent: 'center',
    width: 36
  },
  optionSelected: {
    backgroundColor: theme.colors.tertiary
  },
  optionText: {
    color: theme.colors.primary,
    fontWeight: '700'
  },
  optionTextSelected: {
    color: '#ffffff'
  }
});
