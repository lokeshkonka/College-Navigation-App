import type { TextStyle, ViewStyle } from 'react-native';

export const theme = {
  colors: {
    background: '#f8f9fb',
    surface: '#ffffff',
    surfaceContainer: '#eaeef2',
    surfaceSunken: '#dbe4ea',
    primary: '#586062',
    tertiary: '#006c56',
    textMuted: '#586065',
    danger: '#b42318'
  },
  radii: {
    card: 24,
    xl: 20,
    lg: 16,
    pill: 999
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
    section: 32
  }
} as const;

export const clayShadow: ViewStyle = {
  shadowColor: '#4c5456',
  shadowOffset: { width: 0, height: 16 },
  shadowOpacity: 0.08,
  shadowRadius: 24,
  elevation: 6
};

export const titleText: TextStyle = {
  color: theme.colors.primary,
  fontWeight: '800'
};
