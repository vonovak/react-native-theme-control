import { useEffect, useState } from 'react';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import { SetThemeOptions, ThemeControlModule } from './NativeThemeControl';
import { ThemePreference } from './types';

export * from './SystemBars';
export { NavigationBar } from './NavigationBar';
export { AppBackground, type AppBackgroundProps } from './AppBackground';
export * from './types';

const eventName = 'setThemePreference';

const themeSwitchEventEmitter = new EventEmitter();

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
