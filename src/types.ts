import type { ColorValue, StatusBarProps } from 'react-native';

/**
 * Params that control the appearance of the Android navigation bar.
 *
 * Also props of the {@link NavigationBar} component.
 * */
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
/**
 * `persistTheme`: whether to persist the theme preference across app restarts. Defaults to true. Note that you need to make changes to the native code to make this work (see installation instructions).
 *
 * `restartActivity`: whether to restart the Android activity when the theme changes. Defaults to false. Setting to true is not recommended, but might be useful for debugging.
 */
export type SetThemeOptions = {
  persistTheme?: boolean;
  restartActivity?: boolean;
};
