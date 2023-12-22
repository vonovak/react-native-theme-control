import { useEffect } from 'react';
import { ColorValue, useColorScheme } from 'react-native';
import { ThemeControlModule } from './NativeThemeControl';

export type AppBackgroundProps = {
  dark: ColorValue;
  light: ColorValue;
};
export const AppBackground = ({ dark, light }: AppBackgroundProps) => {
  const colorScheme = useColorScheme();
  useEffect(() => {
    const bgColor = colorScheme === 'dark' ? dark : light;
    ThemeControlModule.setAppBackground(bgColor).catch(console.error);
  }, [colorScheme, dark, light]);
  return null;
};
