import { getThemePreference, ThemeControlModule } from './NativeModule';
import { useLayoutEffect, useState } from 'react';
import type { EventEmitter as VendoredEmitter } from 'react-native';
// @ts-ignore
import EventEmitter from 'react-native/Libraries/vendor/emitter/_EventEmitter';
import type { SetThemeOptions, ThemePreference } from './types';

const themeSwitchEventEmitter: VendoredEmitter = new EventEmitter();

export * from './SystemBars';
export { NavigationBar } from './NavigationBar';
export * from './types';
export { getThemePreference } from './NativeModule';
const eventType = 'setThemePreference';

/**
 * Sets the theme preference which influences the value returned by `useColorScheme()` hook.
 * can be `auto`, `light` or `dark`.
 *
 * `auto` means that the theme preference is determined by the system.
 * */
export function setThemePreference(
  style: ThemePreference,
  options: SetThemeOptions = {}
): void {
  themeSwitchEventEmitter.emit(eventType, style);
  ThemeControlModule.setTheme(style, options);
}

/**
 * A React hook that returns the current theme preference, which might be `dark`, `light` (if you have set it before by calling `setThemePreference`) or `auto`.
 * */
export const useThemePreference = (): ThemePreference => {
  const [themePreference, setPreference] =
    useState<ThemePreference>(getThemePreference);

  useLayoutEffect(() => {
    const subscription = themeSwitchEventEmitter.addListener(
      eventType,
      setPreference
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return themePreference;
};
