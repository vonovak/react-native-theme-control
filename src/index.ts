import { useEffect, useState } from 'react';
export { type SetThemeOptions } from './spec/NativeThemeControl';
import {
  type SetThemeOptions,
  ThemeControlModule,
} from './spec/NativeThemeControl';
import { ThemePreference } from './types';
import { ThemeEventEmitter } from './ThemeEventEmitter';

export * from './SystemBars';
export { NavigationBar, setNavbarAppearance } from './NavigationBar';
export {
  AppBackground,
  type AppBackgroundProps,
  setAppBackground,
} from './AppBackground';
export * from './types';

const themeSwitchEventEmitter = new ThemeEventEmitter();

export function setThemePreference(
  style: ThemePreference,
  options: SetThemeOptions = {},
): void {
  ThemeControlModule.setTheme(style, options)
    .then(() => {
      themeSwitchEventEmitter.emit(style);
    })
    .catch(console.error);
}

export const getThemePreference = ThemeControlModule.getThemePreference;

export const useThemePreference = (): ThemePreference => {
  const [themePreference, setPreference] =
    useState<ThemePreference>(getThemePreference);

  useEffect(() => {
    const subscription = themeSwitchEventEmitter.addListener(setPreference);

    return subscription.remove;
  }, []);

  return themePreference;
};
