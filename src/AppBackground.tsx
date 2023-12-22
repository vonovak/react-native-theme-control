import { useEffect } from 'react';
import { ColorValue, useColorScheme } from 'react-native';
import { ThemeControlModule } from './NativeThemeControl';

export type AppBackgroundProps = {
  dark: ColorValue;
  light: ColorValue;
};
export const AppBackground = (props: AppBackgroundProps) => {
  const { dark, light } = props;
  const colorScheme = useColorScheme();
  useEffect(() => {
    const bgColor = colorScheme === 'dark' ? dark : light;
    ThemeControlModule.setAppBackground(bgColor).catch(console.error);
  }, [colorScheme, dark, light]);
  return null;
};
