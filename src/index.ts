import { useLayoutEffect, useState } from 'react';
// TODO fix types
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import { EventEmitter as EventEmitterType } from 'react-native';
import { SetThemeOptions, ThemeControlModule } from './NativeThemeControl';
import { ThemePreference } from './types';

export * from './SystemBars';
export { NavigationBar } from './NavigationBar';
export * from './types';

const eventName = 'setThemePreference';

// @ts-expect-error
const themeSwitchEventEmitter = new EventEmitter() as EventEmitterType;

export function setThemePreference(
  style: ThemePreference,
  options: SetThemeOptions = {},
): void {
  themeSwitchEventEmitter.emit(eventName, style);
  ThemeControlModule.setTheme(style, options).catch(console.error);
}

export const getThemePreference = ThemeControlModule.getThemePreference;

export const useThemePreference = (): ThemePreference => {
  const [themePreference, setPreference] =
    useState<ThemePreference>(getThemePreference);

  useLayoutEffect(() => {
    const subscription = themeSwitchEventEmitter.addListener(
      eventName,
      setPreference,
    );

    return () => subscription.remove();
  }, []);

  return themePreference;
};
