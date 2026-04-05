import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { clayShadow, theme } from '@/lib/constants/theme';

type ClayCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function ClayCard({ children, style }: ClayCardProps) {
  return <View style={[styles.card, clayShadow, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.card,
    padding: theme.spacing.lg
  }
});
