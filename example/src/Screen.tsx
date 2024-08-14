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
// @ts-ignore
import SegmentedControl from '@react-native-segmented-control/segmented-control/js/SegmentedControl.js';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

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
    true,
  );
  const themePreference = useThemePreference();

  const textColorStyle = { color: textColor };
  const nextTheme = isDarkMode ? 'light' : 'dark';
  const [show, setShow] = useState(false);

  const values: Array<ThemePreference> = ['light', 'dark', 'system'];
  const changeAppearance = (newAppearance: string) => {
    setThemePreference(newAppearance as ThemePreference, {
      persistTheme,
    });
  };

  const navigation = useNavigation();

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
        onChange={({ nativeEvent }: { nativeEvent: any }) => {
          changeAppearance(nativeEvent.value);
        }}
      />
      <Text style={textColorStyle}>useColorScheme(): {colorScheme}</Text>
      <Text style={textColorStyle}>
        useThemePreference(): {themePreference}
      </Text>
      <Button
        title="open ModalScreen"
        onPress={() => {
          // @ts-ignore
          navigation.navigate('ModalScreen');
        }}
      />
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
      <Button
        onPress={() => {
          setShow(true);
          setTimeout(() => setShow(false), 3000);
        }}
        title="open+close date picker"
      />

      {Platform.OS === 'android' && (
        <Button
          onPress={() => {
            setThemePreference(nextTheme, {
              restartActivity: true,
            });
          }}
          title="toggle theme with android activity restart"
        />
      )}
      {show && (
        <DateTimePicker
          value={new Date()}
          mode={'date'}
          is24Hour={true}
          onChange={undefined}
          style={{ width: '100%', height: 200 }}
          display={'spinner'}
        />
      )}
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
