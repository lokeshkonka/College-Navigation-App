import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { clayShadow, theme } from '@/lib/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ComponentProps<typeof MaterialIcons>['name'];
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: any;
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    const baseStyle = [styles.base];

    // Size styles
    if (size === 'small') baseStyle.push(styles.small);
    if (size === 'medium') baseStyle.push(styles.medium);
    if (size === 'large') baseStyle.push(styles.large);

    // Variant styles
    if (variant === 'primary') baseStyle.push(styles.primary);
    if (variant === 'secondary') baseStyle.push(styles.secondary);
    if (variant === 'tertiary') baseStyle.push(styles.tertiary);
    if (variant === 'ghost') baseStyle.push(styles.ghost);
    if (variant === 'danger') baseStyle.push(styles.danger);

    // State styles
    if (isDisabled) baseStyle.push(styles.disabled);
    if (fullWidth) baseStyle.push(styles.fullWidth);

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
    if (variant === 'ghost') baseStyle.push(styles.textGhost);
    if (variant === 'danger') baseStyle.push(styles.textDanger);

    return baseStyle;
  };

  const getIconSize = () => {
    if (size === 'small') return 16;
    if (size === 'medium') return 20;
    return 24;
  };

  const getIconColor = () => {
    if (variant === 'primary') return '#ffffff';
    if (variant === 'tertiary') return '#ffffff';
    if (variant === 'danger') return '#ffffff';
    if (variant === 'secondary') return theme.colors.primary;
    return theme.colors.primary;
  };

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        ...getButtonStyle(),
        pressed && !isDisabled ? styles.pressed : undefined,
        style
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={getIconColor()} size="small" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <MaterialIcons
                color={getIconColor()}
                name={icon}
                size={getIconSize()}
                style={styles.iconLeft}
              />
            )}
            <Text style={getTextStyle()}>{children}</Text>
            {icon && iconPosition === 'right' && (
              <MaterialIcons
                color={getIconColor()}
                name={icon}
                size={getIconSize()}
                style={styles.iconRight}
              />
            )}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  small: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg
  },
  medium: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl
  },
  large: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing['2xl']
  },
  primary: {
    backgroundColor: theme.colors.primary,
    ...clayShadow
  },
  secondary: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: theme.colors.outlineVariant,
    ...clayShadow
  },
  tertiary: {
    backgroundColor: theme.colors.tertiary,
    ...clayShadow
  },
  ghost: {
    backgroundColor: 'transparent'
  },
  danger: {
    backgroundColor: theme.colors.error,
    ...clayShadow
  },
  disabled: {
    opacity: 0.5
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }]
  },
  fullWidth: {
    width: '100%'
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontWeight: '700'
  },
  textSmall: {
    fontSize: 13,
    lineHeight: 16
  },
  textMedium: {
    fontSize: 15,
    lineHeight: 20
  },
  textLarge: {
    fontSize: 17,
    lineHeight: 24
  },
  textPrimary: {
    color: '#ffffff'
  },
  textSecondary: {
    color: theme.colors.primary
  },
  textTertiary: {
    color: '#ffffff'
  },
  textGhost: {
    color: theme.colors.primary
  },
  textDanger: {
    color: '#ffffff'
  },
  iconLeft: {
    marginRight: theme.spacing.sm
  },
  iconRight: {
    marginLeft: theme.spacing.sm
  }
});
