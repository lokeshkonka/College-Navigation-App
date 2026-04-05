import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/lib/constants/theme';

type ChipVariant = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
type ChipSize = 'small' | 'medium' | 'large';

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  icon?: ComponentProps<typeof MaterialIcons>['name'];
  onPress?: () => void;
  onClose?: () => void;
  style?: any;
}

export function Chip({
  label,
  variant = 'primary',
  size = 'medium',
  icon,
  onPress,
  onClose,
  style
}: ChipProps) {
  const Container = onPress ? Pressable : View;

  const getChipStyle = () => {
    const baseStyle = [styles.base];

    // Size styles
    if (size === 'small') baseStyle.push(styles.small);
    if (size === 'medium') baseStyle.push(styles.medium);
    if (size === 'large') baseStyle.push(styles.large);

    // Variant styles
    if (variant === 'primary') baseStyle.push(styles.primary);
    if (variant === 'secondary') baseStyle.push(styles.secondary);
    if (variant === 'tertiary') baseStyle.push(styles.tertiary);
    if (variant === 'success') baseStyle.push(styles.success);
    if (variant === 'warning') baseStyle.push(styles.warning);
    if (variant === 'error') baseStyle.push(styles.error);

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text];

    // Size text styles
    if (size === 'small') baseStyle.push(styles.textSmall);
    if (size === 'medium') baseStyle.push(styles.textMedium);
    if (size === 'large') baseStyle.push(styles.textLarge);

    // Variant text styles
    if (variant === 'primary') baseStyle.push(styles.textPrimary);
    if (variant === 'secondary') baseStyle.push(styles.textSecondary);
    if (variant === 'tertiary') baseStyle.push(styles.textTertiary);
    if (variant === 'success') baseStyle.push(styles.textSuccess);
    if (variant === 'warning') baseStyle.push(styles.textWarning);
    if (variant === 'error') baseStyle.push(styles.textError);

    return baseStyle;
  };

  const getIconSize = () => {
    if (size === 'small') return 14;
    if (size === 'medium') return 16;
    return 18;
  };

  const getIconColor = () => {
    if (variant === 'primary') return theme.colors.primary;
    if (variant === 'secondary') return theme.colors.onSurfaceVariant;
    if (variant === 'tertiary') return theme.colors.onTertiaryContainer;
    if (variant === 'success') return theme.colors.success;
    if (variant === 'warning') return theme.colors.warning;
    return theme.colors.error;
  };

  return (
    <Container
      // @ts-ignore - Pressable prop only applies when Container is Pressable
      onPress={onPress}
      style={({ pressed }: any) => [
        ...getChipStyle(),
        pressed && onPress && styles.pressed,
        style
      ]}
    >
      <View style={styles.content}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={getIconSize()}
            color={getIconColor()}
            style={styles.icon}
          />
        )}
        <Text style={getTextStyle()}>{label}</Text>
        {onClose && (
          <Pressable onPress={onClose} style={styles.closeButton}>
            <MaterialIcons
              name="close"
              size={getIconSize()}
              color={getIconColor()}
            />
          </Pressable>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radii.chip,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start'
  },
  small: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md
  },
  medium: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg
  },
  large: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl
  },
  primary: {
    backgroundColor: theme.colors.primaryFixed
  },
  secondary: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant
  },
  tertiary: {
    backgroundColor: theme.colors.tertiaryContainer
  },
  success: {
    backgroundColor: theme.colors.tertiaryContainer
  },
  warning: {
    backgroundColor: theme.colors.errorContainer,
    opacity: 0.7
  },
  error: {
    backgroundColor: theme.colors.errorContainer
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }]
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5
  },
  textSmall: {
    fontSize: 10,
    lineHeight: 14,
    textTransform: 'uppercase'
  },
  textMedium: {
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase'
  },
  textLarge: {
    fontSize: 13,
    lineHeight: 18,
    textTransform: 'uppercase'
  },
  textPrimary: {
    color: theme.colors.onPrimaryContainer
  },
  textSecondary: {
    color: theme.colors.onSurfaceVariant
  },
  textTertiary: {
    color: theme.colors.onTertiaryContainer
  },
  textSuccess: {
    color: theme.colors.onTertiaryContainer
  },
  textWarning: {
    color: theme.colors.onErrorContainer
  },
  textError: {
    color: theme.colors.onErrorContainer
  },
  icon: {
    marginRight: 2
  },
  closeButton: {
    marginLeft: 2
  }
});
