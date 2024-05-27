import { ColorValue, useColorScheme } from 'react-native';
import * as React from 'react';

export type AppBackgroundProps = {
  dark: ColorValue;
  light: ColorValue;
};
import { MountedValue } from './MountedValue';
import { ThemeControlModule } from './spec/NativeThemeControl';

const arePropsEqual = (oldProps: ColorValue | null, lastEntry: ColorValue) => {
  return oldProps === lastEntry;
};

/**
 * Set the application background imperatively
 * */
export const setAppBackground = (bgColor: ColorValue): Promise<boolean> => {
  return ThemeControlModule.setAppBackground(bgColor);
};

const setAppBackgroundInternal = (bg: ColorValue) => {
  setAppBackground(bg).catch(console.error);
};

export const AppBackground = (props: AppBackgroundProps) => {
  const { dark, light } = props;
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? dark : light;

  return (
    <MountedValue<ColorValue>
      latestProps={bgColor}
      arePropsEqual={arePropsEqual}
      onPropsChanged={setAppBackgroundInternal}
    />
  );
};
