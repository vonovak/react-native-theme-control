import * as React from 'react';
import {
  Appearance,
  ColorSchemeName,
  processColor,
  useColorScheme,
} from 'react-native';
import type {
  NavbarAppearanceParams,
  NavigationBarProps as NavigationBarProps,
} from './types';

import {
  SetNavbarAppearanceParams,
  ThemeControlModule,
} from './spec/NativeThemeControl';
import { MountedValue } from './MountedValue';
import { useMemo } from 'react';

const getBarStyleParam = (
  barStyle: NavigationBarProps['barStyle'],
  colorScheme: ColorSchemeName,
): SetNavbarAppearanceParams['barStyle'] => {
  if (!barStyle || barStyle === 'default') {
    const preference = colorScheme || ThemeControlModule.getThemePreference();
    return preference === 'dark' ? 'light-content' : 'dark-content';
  }
  return barStyle;
};

const didPropsChange = (
  oldProps: NavigationBarProps | null,
  lastEntry: NavigationBarProps,
) => {
  return (
    oldProps?.dividerColor !== lastEntry.dividerColor ||
    oldProps?.backgroundColor !== lastEntry.backgroundColor ||
    oldProps?.barStyle !== lastEntry.barStyle
  );
};

const onPropsChanged = (lastEntry: NavigationBarProps) => {
  const barStyle = getBarStyleParam(
    lastEntry.barStyle,
    Appearance.getColorScheme(),
  );

  const params = {
    dividerColor: processColor(lastEntry.dividerColor) ?? null,
    backgroundColor: processColor(lastEntry.backgroundColor) ?? null,
    barStyle,
  };
  ThemeControlModule.setNavbarAppearance(params).catch(console.error);
};

export const NavigationBar = (props: NavigationBarProps) => {
  const colorScheme = useColorScheme();
  const { barStyle, backgroundColor, dividerColor } = props;

  const propsWithDefaultBarStyle: NavigationBarProps = useMemo(() => {
    const barStyleParam = getBarStyleParam(barStyle, colorScheme);
    return {
      backgroundColor,
      dividerColor,
      barStyle: barStyleParam,
    };
  }, [barStyle, colorScheme, dividerColor, backgroundColor]);

  return (
    <MountedValue<NavigationBarProps>
      latestProps={propsWithDefaultBarStyle}
      arePropsEqual={didPropsChange}
      onPropsChanged={onPropsChanged}
    />
  );
};

export const setNavbarAppearance = ({
  dividerColor,
  backgroundColor,
  barStyle,
}: NavbarAppearanceParams): Promise<null> => {
  const barStyleParam = getBarStyleParam(barStyle, Appearance.getColorScheme());

  return ThemeControlModule.setNavbarAppearance({
    dividerColor: processColor(dividerColor) ?? null,
    backgroundColor: processColor(backgroundColor) ?? null,
    barStyle: barStyleParam,
  });
};

NavigationBar.setNavbarAppearance = (
  params: NavbarAppearanceParams,
): Promise<null> => {
  console.warn(
    'NavigationBar.setNavbarAppearance is deprecated. Use setNavbarAppearance instead.',
  );
  return setNavbarAppearance(params);
};
