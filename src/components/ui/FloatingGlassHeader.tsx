import { Platform, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';

import { theme, titleText } from '@/lib/constants/theme';

type FloatingGlassHeaderProps = {
  title: string;
  rightSlot?: ReactNode;
};

export function FloatingGlassHeader({ title, rightSlot }: FloatingGlassHeaderProps) {
  return (
    <View style={styles.shell}>
      <Text style={styles.title}>{title}</Text>
      <View>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.70)',
    borderRadius: theme.radii.pill,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 }
        }
      : {
          elevation: 4
        })
  },
  title: {
    ...titleText,
    fontSize: 18
  }
});
