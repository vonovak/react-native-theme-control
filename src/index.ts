import { useEffect, useState } from 'react';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
export { type SetThemeOptions } from './spec/NativeThemeControl';
import {
  type SetThemeOptions,
  ThemeControlModule,
} from './spec/NativeThemeControl';
import { ThemePreference } from './types';
import { Appearance, Platform } from 'react-native';

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

function createThemeSwitchPromise() {
  if (Platform.OS === 'ios') {
    return Promise.resolve(undefined);
  }
  // workaround instead of https://github.com/facebook/react-native/pull/46017
  return new Promise((resolve) => {
    // either the appearance changes or the timeout is reached (when switching to / from "system")
    const timeoutId = setTimeout(() => {
      resolve(undefined);
    }, 150);

    const subscription = Appearance.addChangeListener(() => {
      clearTimeout(timeoutId);
      subscription.remove();
      resolve(undefined);
    });
  });
}

export function setThemePreference(
  style: ThemePreference,
  options: SetThemeOptions = {},
): void {
  ThemeControlModule.setTheme(style, options)
    .then(createThemeSwitchPromise)
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
