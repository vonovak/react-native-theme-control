import { NativeModules, ProcessedColorValue } from 'react-native';
import type { SetThemeOptions, ThemePreference } from './types';

export type SetNavbarAppearanceParams = {
  backgroundColor: ProcessedColorValue | null;
  dividerColor: ProcessedColorValue | null;
  barStyle: 'dark-content' | 'light-content' | null;
};

type ThemeControlModuleType = {
  setTheme(style: ThemePreference, options: SetThemeOptions): Promise<null>;
  setNavbarAppearance(params: SetNavbarAppearanceParams): Promise<null>;
  getThemePreference: () => ThemePreference;
};

const { RNThemeControl } = NativeModules;

export const ThemeControlModule = RNThemeControl as ThemeControlModuleType;

/**
 * Function that returns the current theme preference
 * */
export const getThemePreference: () => ThemePreference = () =>
  ThemeControlModule.getThemePreference();
