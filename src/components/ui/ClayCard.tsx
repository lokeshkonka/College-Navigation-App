import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { clayShadow, theme } from '@/lib/constants/theme';

type ClayCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'elevated' | 'flat' | 'outlined';
}>;

export function ClayCard({ children, style, onPress, variant = 'elevated' }: ClayCardProps) {
  const Container = onPress ? Pressable : View;

  const getVariantStyle = () => {
    if (variant === 'flat') return styles.flat;
    if (variant === 'outlined') return styles.outlined;
    return {};
  };

  return (
    <Container
      onPress={onPress}
      style={({ pressed }: { pressed?: boolean }) => [
        styles.card,
        variant === 'elevated' && clayShadow,
        getVariantStyle(),
        pressed && onPress && styles.pressed,
        style
      ]}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.radii.card,
    padding: theme.spacing.cardPadding
  },
  flat: {
    backgroundColor: theme.colors.surfaceContainerLow,
    elevation: 0
  },
  outlined: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    elevation: 0
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }]
  }
});
