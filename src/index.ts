import { getThemePreference, ThemeControlModule } from './NativeModule';
import { useLayoutEffect, useState } from 'react';
// TODO fix types
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import type { SetThemeOptions, ThemePreference } from './types';

export * from './SystemBars';
export { NavigationBar } from './NavigationBar';
export * from './types';
export { getThemePreference } from './NativeModule';

const eventType = 'setThemePreference';

// @ts-expect-error
const themeSwitchEventEmitter = new EventEmitter();

export function setThemePreference(
  style: ThemePreference,
  options: SetThemeOptions = {}
): void {
  themeSwitchEventEmitter.emit(eventType, style);
  ThemeControlModule.setTheme(style, options).catch(console.error);
}

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
