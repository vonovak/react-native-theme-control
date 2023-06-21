import type { ColorValue, StatusBarProps } from 'react-native';

export type NavigationBarProps = Pick<StatusBarProps, 'barStyle'> & {
  backgroundColor?: ColorValue;
  dividerColor?: ColorValue;
};

export type NavbarAppearanceParams = {
  backgroundColor?: ColorValue;
  dividerColor?: ColorValue;
  barStyle?: 'dark-content' | 'light-content' | null;
};

export type ThemePreference = 'dark' | 'light' | 'auto';
