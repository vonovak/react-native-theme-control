import {
  ColorValue,
  processColor,
  ProcessedColorValue,
  TurboModule,
} from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import { ThemePreference } from './types';

type NativeSetNavbarAppearanceParams = {
  backgroundColor: WithDefault<number, null>;
  dividerColor: WithDefault<number, null>;
  barStyle: WithDefault<string, null>;
};

export type SetThemeOptions = {
  persistTheme?: boolean;
  restartActivity?: boolean;
};
export interface Spec extends TurboModule {
  // we use "Object" to have backwards compatibility with paper
  // eslint-disable-next-line @typescript-eslint/ban-types
  setTheme(style: string, options: Object): Promise<null>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setAppBackground(options: Object): Promise<boolean>;
  setNavbarAppearance(params: NativeSetNavbarAppearanceParams): Promise<null>;
  getThemePreference: () => string;
}

const WeaklyTypedThemeControlModule =
  TurboModuleRegistry.getEnforcing<Spec>('RNThemeControl');

// @ts-expect-error - we use stricter typings than codegen
export const getThemePreference: () => ThemePreference = () => {
  return WeaklyTypedThemeControlModule.getThemePreference();
};

export type SetNavbarAppearanceParams = {
  backgroundColor: ProcessedColorValue | null;
  dividerColor: ProcessedColorValue | null;
  barStyle: 'dark-content' | 'light-content' | null;
};
const setNavbarAppearance = (params: SetNavbarAppearanceParams) => {
  // @ts-expect-error - we use stricter typings than codegen
  return WeaklyTypedThemeControlModule.setNavbarAppearance(params);
};

const setTheme = (style: string, options: SetThemeOptions): Promise<null> => {
  return WeaklyTypedThemeControlModule.setTheme(style, options);
};

const setAppBackground = (appBackground: ColorValue): Promise<boolean> => {
  return WeaklyTypedThemeControlModule.setAppBackground({
    appBackground: processColor(appBackground),
  });
};

export const ThemeControlModule = {
  setTheme,
  getThemePreference,
  setNavbarAppearance,
  setAppBackground,
} as const;
