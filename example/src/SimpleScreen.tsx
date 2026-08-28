import * as React from 'react';

import { Button, Text, useColorScheme, View } from 'react-native';
import {
  setThemePreference,
  SystemBars,
  ThemePreference,
  useThemePreference,
} from '@vonovak/react-native-theme-control';

const themePreferences: Array<ThemePreference> = ['light', 'dark', 'system'];

export type ThemePickerProps = {
  values: Array<ThemePreference>;
  selected: ThemePreference;
  onSelect: (value: ThemePreference) => void;
};

export type SimpleScreenProps = {
  /**
   * Render the theme picker. Defaults to plain react-native buttons, so this
   * screen works in an app that installs nothing but this library. The Expo SDK
   * compatibility workflow copies this file into a blank app and uses that
   * default; the example app passes a native segmented control instead.
   */
  renderThemePicker?: (props: ThemePickerProps) => React.ReactNode;
};

export function SimpleScreen({ renderThemePicker }: SimpleScreenProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const themePreference = useThemePreference();
  const bgColor = isDarkMode ? '#2A2550' : '#FFF6EA';
  const textColor = isDarkMode ? 'white' : 'black';
  const barsBackground = isDarkMode ? '#9900F0' : '#A0BCC2';
  const dividerColor = textColor;

  const textColorStyle = { color: textColor };

  const pickerProps: ThemePickerProps = {
    values: themePreferences,
    selected: themePreference,
    onSelect: setThemePreference,
  };

  return (
    <View
      style={{
        backgroundColor: bgColor,
        flexGrow: 1,
        flexShrink: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}
    >
      <SystemBars
        backgroundColor={barsBackground}
        dividerColor={dividerColor}
      />
      {renderThemePicker ? (
        renderThemePicker(pickerProps)
      ) : (
        <ThemeButtons {...pickerProps} />
      )}
      <Text style={textColorStyle}>useColorScheme(): {colorScheme}</Text>
      <Text style={textColorStyle}>
        useThemePreference(): {themePreference}
      </Text>
    </View>
  );
}

function ThemeButtons({ values, selected, onSelect }: ThemePickerProps) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {values.map((value) => (
        <Button
          key={value}
          title={value === selected ? `[ ${value} ]` : value}
          onPress={() => onSelect(value)}
        />
      ))}
    </View>
  );
}

export default SimpleScreen;
