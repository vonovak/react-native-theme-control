import * as React from 'react';

import {
  StyleSheet,
  Text,
  Button,
  useColorScheme,
  View,
  Platform,
  Switch,
  ColorValue,
} from 'react-native';
import {
  setThemePreference,
  SystemBars,
  ThemePreference,
  useThemePreference,
} from '@vonovak/react-native-theme-control';
import { MenuView } from '@react-native-menu/menu';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

type Props = {
  barsBackground: ColorValue;
  textColor: ColorValue;
  dividerColor?: ColorValue;
  bgColor: ColorValue;
  navigate?: () => void;
};

export function Screen({
  barsBackground,
  textColor,
  bgColor,
  navigate,
  dividerColor,
}: Props) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [persistTheme, togglePersistTheme] = React.useReducer(
    (state: boolean) => !state,
    true
  );
  const themePreference = useThemePreference();

  const textColorStyle = { color: textColor };
  const nextTheme = isDarkMode ? 'light' : 'dark';

  const values: Array<ThemePreference> = ['light', 'dark', 'auto'];
  const changeAppearance = (newAppearance: string) => {
    setThemePreference(newAppearance as ThemePreference, { persistTheme });
  };
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
      <SegmentedControl
        style={{ width: '100%' }}
        values={values}
        selectedIndex={values.indexOf(themePreference)}
        onChange={({ nativeEvent }) => {
          changeAppearance(nativeEvent.value);
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

      <MenuView
        title="Menu Title"
        actions={[
          {
            id: 'add',
            title: 'Native menu item 1',
          },
          {
            id: 'share',
            title: 'Native menu item 2',
          },
        ]}
      >
        <Text style={[styles.label, textColorStyle]}>
          open native menu that has the correct color background
        </Text>
      </MenuView>
      {navigate && <Button onPress={navigate} title="go to next screen" />}

      {Platform.OS === 'android' && (
        <Button
          onPress={() => {
            setThemePreference(nextTheme, { restartActivity: true });
          }}
          title="toggle theme with android activity restart"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  label: { padding: 10, textAlign: 'center' },
});
