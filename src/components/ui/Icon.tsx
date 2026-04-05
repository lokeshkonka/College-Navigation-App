import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from '@/lib/constants/theme';

type IconName = ComponentProps<typeof MaterialIcons>['name'];
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IconColor = keyof typeof theme.colors;

interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: IconColor | string;
  filled?: boolean;
  style?: any;
}

const sizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40
};

export function Icon({
  name,
  size = 'md',
  color = 'primary',
  filled = false,
  style
}: IconProps) {
  const iconSize = sizeMap[size];
  const iconColor = color in theme.colors
    ? theme.colors[color as IconColor]
    : color;

  return (
    <View style={[styles.container, style]}>
      <MaterialIcons
        name={name}
        size={iconSize}
        color={iconColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
