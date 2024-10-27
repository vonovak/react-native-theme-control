import type { ColorValue, StatusBarProps } from 'react-native';

export type NavigationBarProps = Pick<StatusBarProps, 'barStyle'> & {
  backgroundColor?: ColorValue | undefined;
  dividerColor?: ColorValue | undefined;
};

export type NavbarAppearanceParams = {
  backgroundColor?: ColorValue | undefined;
  dividerColor?: ColorValue | undefined;
  barStyle?: 'dark-content' | 'light-content' | null;
};

export type ThemePreference = 'dark' | 'light' | 'system';
