import { StatusBar, StatusBarProps, useColorScheme } from 'react-native';
import * as React from 'react';
import type { NavigationBarProps } from './types';
import { NavigationBar } from './NavigationBar';

/**
 * Props of {@link ThemeAwareStatusBar}
 * */
export type ThemeAwareStatusBarProps = StatusBarProps;

/**
 * Thin wrapper on top of react-native's `StatusBar` that automatically determines the `barStyle` prop based on the active theme.
 * Specifically, if active color scheme is dark, then status bar icons will be rendered as light.
 * However, you can override this behavior by passing a custom `barStyle` prop.
 * */
export const ThemeAwareStatusBar = ({
  barStyle,
  ...props
}: ThemeAwareStatusBarProps) => {
  const isDarkMode = useColorScheme() === 'dark';

  // dark-content means dark icons on a light status bar
  // light-content means light icons on a dark status bar
  const barStyleDefault = isDarkMode ? 'light-content' : 'dark-content';
  const actualBarStyle =
    barStyle === 'default' ? barStyleDefault : barStyle || barStyleDefault;

  return <StatusBar barStyle={actualBarStyle} {...props} />;
};

/**
 * Props of {@link SystemBars}
 * */
export type SystemBarsProps = ThemeAwareStatusBarProps &
  Pick<NavigationBarProps, 'dividerColor'>;

/**
 * Combines the `NavigationBar` and `ThemeAwareStatusBar` into a single component.
 * */
export const SystemBars = (props: SystemBarsProps) => {
  return (
    <>
      <ThemeAwareStatusBar {...props} />
      <NavigationBar {...props} />
    </>
  );
};
