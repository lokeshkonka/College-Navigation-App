import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, TextInput as RNTextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { claySunkenShadow, theme } from '@/lib/constants/theme';

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: ComponentProps<typeof MaterialIcons>['name'];
  rightIcon?: ComponentProps<typeof MaterialIcons>['name'];
  onRightIconPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function TextInput({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  rightIcon,
  onRightIconPress,
  accessibilityLabel,
  style
}: TextInputProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        error && styles.inputContainerError,
        disabled && styles.inputContainerDisabled
      ]}>
        {leftIcon && (
          <MaterialIcons
            name={leftIcon}
            size={20}
            color={theme.colors.outline}
            style={styles.leftIcon}
          />
        )}
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.outlineVariant}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          accessibilityLabel={accessibilityLabel || label || placeholder}
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            multiline && styles.inputMultiline
          ]}
        />
        {rightIcon && (
          <MaterialIcons
            name={rightIcon}
            size={20}
            color={theme.colors.outline}
            style={styles.rightIcon}
            onPress={onRightIconPress}
          />
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.input,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    ...claySunkenShadow
  },
  inputContainerError: {
    borderWidth: 1,
    borderColor: theme.colors.error
  },
  inputContainerDisabled: {
    opacity: 0.6
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.onSurface,
    padding: 0
  },
  inputWithLeftIcon: {
    marginLeft: theme.spacing.sm
  },
  inputWithRightIcon: {
    marginRight: theme.spacing.sm
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.sm
  },
  leftIcon: {
    marginRight: theme.spacing.xs
  },
  rightIcon: {
    marginLeft: theme.spacing.xs
  },
  error: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.error,
    marginTop: theme.spacing.sm
  }
});
