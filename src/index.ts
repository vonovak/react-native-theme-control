import { useEffect, useState } from 'react';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
export { type SetThemeOptions } from './spec/NativeThemeControl';
import {
  type SetThemeOptions,
  ThemeControlModule,
} from './spec/NativeThemeControl';
import { ThemePreference } from './types';

export * from './SystemBars';
export { NavigationBar, setNavbarAppearance } from './NavigationBar';
export {
  AppBackground,
  type AppBackgroundProps,
  setAppBackground,
} from './AppBackground';
export * from './types';

const eventName = 'setThemePreference';

const themeSwitchEventEmitter = new EventEmitter();

export function setThemePreference(
  style: ThemePreference,
  options: SetThemeOptions = {},
): void {
  ThemeControlModule.setTheme(style, options)
    .then(() => {
      themeSwitchEventEmitter.emit(eventName, style);
    })
    .catch(console.error);
}

export const getThemePreference = ThemeControlModule.getThemePreference;

export const useThemePreference = (): ThemePreference => {
  const [themePreference, setPreference] =
    useState<ThemePreference>(getThemePreference);

  useEffect(() => {
    const subscription = themeSwitchEventEmitter.addListener(
      eventName,
      setPreference,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return themePreference;
};
