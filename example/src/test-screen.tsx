import * as React from 'react';

import {
  StyleSheet,
  Text,
  Button,
  useColorScheme,
  View,
  Switch,
  ColorValue,
} from 'react-native';
import {
  setThemePreference,
  SystemBars,
  useThemePreference,
} from '@vonovak/react-native-theme-control';

type Props = {
  barsBackground: ColorValue;
  textColor: ColorValue;
  dividerColor?: ColorValue;
  bgColor: ColorValue;
};

export default function Screen({
  barsBackground,
  textColor,
  bgColor,
  dividerColor,
}: Props) {
  const colorScheme = useColorScheme();
  const [persistTheme, togglePersistTheme] = React.useReducer(
    (state: boolean) => !state,
    true,
  );
  const themePreference = useThemePreference();

  const textColorStyle = { color: textColor };

  return (
    <View
      style={[
        {
          backgroundColor: bgColor,
        },
        styles.container,
      ]}
    >
      <SystemBars
        backgroundColor={barsBackground}
        dividerColor={dividerColor}
        barStyle={'default'}
      />
      <Button
        title={`set theme to light`}
        onPress={() => {
          setThemePreference('light');
        }}
      />
      <Button
        title={`set theme to dark`}
        onPress={() => {
          setThemePreference('dark');
        }}
      />
      <Button
        title={`set theme to system`}
        onPress={() => {
          setThemePreference('system');
        }}
      />

      <Text style={textColorStyle}>useColorScheme(): {colorScheme}</Text>
      <Text style={textColorStyle}>
        useThemePreference(): {themePreference}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '100%',
        }}
      >
        <Switch
          thumbColor={persistTheme ? 'green' : 'grey'}
          onValueChange={togglePersistTheme}
          value={persistTheme}
        />
        <Text style={textColorStyle}>
          Persist theme across restarts: {String(persistTheme)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    rowGap: 20,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  label: { padding: 10, textAlign: 'center' },
});
