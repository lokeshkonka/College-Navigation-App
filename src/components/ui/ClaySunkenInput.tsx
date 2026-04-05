import { TextInput, type TextInputProps, StyleSheet } from 'react-native';

import { theme } from '@/lib/constants/theme';

export function ClaySunkenInput(props: TextInputProps) {
  return <TextInput placeholderTextColor={theme.colors.textMuted} style={styles.input} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.pill,
    color: theme.colors.primary,
    fontSize: 16,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  }
});
