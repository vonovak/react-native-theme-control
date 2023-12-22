import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';

import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Screen } from './Screen';
import {
  Button,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
} from 'react-native';
import { useLayoutEffect } from 'react';
import DocumentPicker from 'react-native-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuView } from '@react-native-menu/menu';
import { SimpleScreen } from './SimpleScreen';
import { AppBackground } from '../../src/AppBackground';

type RootStackParamList = {
  Home: undefined;
  ScreenTwo: undefined;
  SimpleScreen: undefined;
  ModalScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const ScreenOne = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  const isDarkMode = useColorScheme() === 'dark';
  const bgColor = isDarkMode ? '#2A2550' : '#FFF6EA';
  const textColor = isDarkMode ? 'white' : 'black';
  const dividerColor = textColor;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: textColor,
    });
  }, [navigation, bgColor, textColor]);

  return (
    <Screen
      barsBackground={isDarkMode ? '#9900F0' : '#A0BCC2'}
      bgColor={bgColor}
      textColor={textColor}
      dividerColor={dividerColor}
      navigate={() => {
        navigation.navigate('ScreenTwo');
      }}
    />
  );
};

const ScreenTwo = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'ScreenTwo'>) => {
  const isDarkMode = useColorScheme() === 'dark';
  const bgColor = isDarkMode ? '#4700D8' : '#7FB5FF';
  const textColor = isDarkMode ? 'white' : 'black';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: textColor,
    });
  }, [navigation, bgColor, textColor]);

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: bgColor,
      }}
    >
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <Screen
          barsBackground={isDarkMode ? '#005555' : '#EE5007'}
          bgColor={bgColor}
          textColor={textColor}
          navigate={() => {
            navigation.navigate('SimpleScreen');
          }}
        />
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
          <Text
            style={[{ padding: 10, textAlign: 'center', color: textColor }]}
          >
            open native menu that has the correct color background
          </Text>
        </MenuView>
        <TextInput
          style={{ height: 40, color: textColor }}
          value={'testing text input'}
        />
        <Button
          title="open picker for single file selection"
          onPress={async () => {
            try {
              await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
              });
            } catch (e) {
              // ignore
            }
          }}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={ScreenOne} />
      <Stack.Screen name="ScreenTwo" component={ScreenTwo} />
      <Stack.Screen name="SimpleScreen" component={SimpleScreen} />
      <Stack.Screen
        name="ModalScreen"
        component={SimpleScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AppStack />
      <AppBackground dark={'green'} light={'gray'} />
    </NavigationContainer>
  );
}
