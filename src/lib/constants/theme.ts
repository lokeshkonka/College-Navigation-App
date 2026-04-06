import type { TextStyle, ViewStyle } from 'react-native';

// Complete Stitch UI Design System - "The Tactile Cartographer"
export const theme = {
  colors: {
    // Surface colors - Layered depth system
    background: '#f8f9fb',
    surface: '#f8f9fb',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f1f4f7',
    surfaceContainer: '#eaeef2',
    surfaceContainerHigh: '#e2e9ee',
    surfaceContainerHighest: '#dbe4ea',
    surfaceDim: '#d1dce2',
    surfaceBright: '#f8f9fb',
    surfaceVariant: '#dbe4ea',
    surfaceSunken: '#dbe4ea', // For sunken inputs

    // Primary colors
    primary: '#586062',
    primaryDim: '#4c5456',
    primaryContainer: '#dde4e6',
    primaryFixed: '#dde4e6',
    primaryFixedDim: '#cfd6d8',
    onPrimary: '#f2f9fb',
    onPrimaryContainer: '#4c5355',
    onPrimaryFixed: '#394043',
    onPrimaryFixedVariant: '#565d5f',

    // Secondary colors
    secondary: '#566165',
    secondaryDim: '#4a5559',
    secondaryContainer: '#d9e4e9',
    secondaryFixed: '#d9e4e9',
    secondaryFixedDim: '#cbd6db',
    onSecondary: '#f0fbff',
    onSecondaryContainer: '#495357',
    onSecondaryFixed: '#364145',
    onSecondaryFixedVariant: '#525d61',

    // Tertiary colors (Teal wayfinding)
    tertiary: '#006c56',
    tertiaryDim: '#005f4b',
    tertiaryContainer: '#70fdd5',
    tertiaryFixed: '#70fdd5',
    tertiaryFixedDim: '#60eec7',
    onTertiary: '#e4fff3',
    onTertiaryContainer: '#005f4b',
    onTertiaryFixed: '#004b3a',
    onTertiaryFixedVariant: '#006a54',

    // Error colors
    error: '#9f403d',
    errorDim: '#4e0309',
    errorContainer: '#fe8983',
    onError: '#fff7f6',
    onErrorContainer: '#752121',

    // Neutral text colors
    onSurface: '#2b3438',
    onSurfaceVariant: '#586065',
    onBackground: '#2b3438',

    // Outline colors
    outline: '#737c81',
    outlineVariant: '#aab3b9',

    // Inverse colors
    inverseSurface: '#0c0f10',
    inverseOnSurface: '#9b9d9f',
    inversePrimary: '#f1f8fa',

    // Semantic colors
    textMuted: '#586065',
    danger: '#b42318',
    success: '#006c56',
    warning: '#9f403d',

    // Surface tint
    surfaceTint: '#586062'
  },

  // Border radius scale
  radii: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
    pill: 999,
    full: 9999,
    // Named radii for components
    card: 16,
    button: 999,
    input: 999,
    chip: 999
  },

  // Spacing scale (following 8px base grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
    section: 32,
    // Component-specific spacing
    cardPadding: 20,
    screenPadding: 24,
    iconGap: 12
  },

  // Typography scale
  typography: {
    displayLarge: {
      fontSize: 57,
      fontWeight: '800' as const,
      lineHeight: 64
    },
    displayMedium: {
      fontSize: 45,
      fontWeight: '800' as const,
      lineHeight: 52
    },
    displaySmall: {
      fontSize: 36,
      fontWeight: '800' as const,
      lineHeight: 44
    },
    headlineLarge: {
      fontSize: 32,
      fontWeight: '800' as const,
      lineHeight: 40
    },
    headlineMedium: {
      fontSize: 28,
      fontWeight: '800' as const,
      lineHeight: 36
    },
    headlineSmall: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32
    },
    titleLarge: {
      fontSize: 22,
      fontWeight: '700' as const,
      lineHeight: 28
    },
    titleMedium: {
      fontSize: 18,
      fontWeight: '700' as const,
      lineHeight: 24
    },
    titleSmall: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 20
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16
    },
    labelLarge: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 20,
      letterSpacing: 0.1
    },
    labelMedium: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 16,
      letterSpacing: 0.5
    },
    labelSmall: {
      fontSize: 11,
      fontWeight: '600' as const,
      lineHeight: 16,
      letterSpacing: 0.5
    }
  }
} as const;

// Clay raised shadow - for elevated cards
export const clayShadow: ViewStyle = {
  shadowColor: '#2b3438',
  shadowOffset: { width: 0, height: 20 },
  shadowOpacity: 0.06,
  shadowRadius: 40,
  elevation: 6
};

// Clay extruded shadow - for prominent elements
export const clayExtrudedShadow: ViewStyle = {
  shadowColor: '#2b3438',
  shadowOffset: { width: 0, height: 20 },
  shadowOpacity: 0.06,
  shadowRadius: 40,
  elevation: 8
};

// Sunken shadow - for inputs
export const claySunkenShadow: ViewStyle = {
  shadowColor: '#2b3438',
  shadowOffset: { width: 2, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 0
};

// Glass effect for floating nav
export const glassEffect: ViewStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 20 },
  shadowOpacity: 0.08,
  shadowRadius: 40,
  elevation: 10
};

// Typography presets
export const titleText: TextStyle = {
  color: theme.colors.primary,
  fontWeight: '800'
};

export const headlineText: TextStyle = {
  color: theme.colors.primary,
  fontWeight: '900',
  letterSpacing: -0.5
};

export const labelText: TextStyle = {
  color: theme.colors.outlineVariant,
  fontSize: 12,
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: 1.2
};
