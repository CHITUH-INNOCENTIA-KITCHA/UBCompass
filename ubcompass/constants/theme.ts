import { MD3LightTheme } from 'react-native-paper';

const ubGreen = '#006400';
const ubGreenDeep = '#0B3D0B';
const ubGreenSoft = '#E8F4E8';
const ubGold = '#D4A017';
const ubCream = '#F7FAF5';

export const Colors = {
  brand: {
    primary: ubGreen,
    primaryDark: ubGreenDeep,
    primarySoft: ubGreenSoft,
    accent: ubGold,
    background: ubCream,
    surface: '#FFFFFF',
    border: '#D7E3D0',
    text: '#17301A',
    textMuted: '#5F7261',
    mapWater: '#CFE8FF',
    mapLand: '#E8F3E4',
    route: '#F57C00',
  },
  light: {
    text: '#17301A',
    background: ubCream,
    tint: ubGreen,
    icon: '#5F7261',
    tabIconDefault: '#6C806D',
    tabIconSelected: ubGreen,
  },
  dark: {
    text: '#FFFFFF',
    background: ubGreenDeep,
    tint: '#FFFFFF',
    icon: '#D7E3D0',
    tabIconDefault: '#D7E3D0',
    tabIconSelected: '#FFFFFF',
  },
};

export const UBTheme = {
  ...MD3LightTheme,
  roundness: 24,
  colors: {
    ...MD3LightTheme.colors,
    primary: ubGreen,
    onPrimary: '#FFFFFF',
    primaryContainer: '#B7D9B0',
    onPrimaryContainer: ubGreenDeep,
    secondary: '#3C7A3F',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#D3EBCF',
    onSecondaryContainer: '#17301A',
    tertiary: ubGold,
    onTertiary: '#1E1E1E',
    tertiaryContainer: '#FFE9AE',
    onTertiaryContainer: '#433000',
    background: ubCream,
    onBackground: '#17301A',
    surface: '#FFFFFF',
    onSurface: '#17301A',
    surfaceVariant: '#EEF5EA',
    onSurfaceVariant: '#516351',
    outline: '#C3D1BC',
    outlineVariant: '#D7E3D0',
    error: '#B3261E',
    onError: '#FFFFFF',
    errorContainer: '#F9DEDC',
    onErrorContainer: '#410E0B',
    elevation: {
      level0: 'transparent',
      level1: '#F6FBF4',
      level2: '#EFF7EC',
      level3: '#E8F4E5',
      level4: '#E3F0E0',
      level5: '#DDEBDA',
    },
  },
};

export type UBThemeType = typeof UBTheme;
