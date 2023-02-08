
# react-native-theme-control

iOS 13 or newer is required for theming logic. However, the package builds with iOS 10 and newer.

Version 2 supports RN 0.70 and newer. Version 2 can also be used with Expo >=47.

For version 1, the minimum required RN version is 0.66.1. Version 1 can also be used with Expo >=45 and < 47.

## Installation

```bash
yarn add @vonovak/react-native-theme-control
```

OR

```bash
npm i @vonovak/react-native-theme-control
```

Then, run `npx pod-install` and rebuild your iOS and Android projects.

### Expo

add `@vonovak/react-native-theme-control` to the `plugins` entry in expo config file, e.g.:

`"plugins": ["@vonovak/react-native-theme-control"]`

## Native files setup:

There are manual installation steps that need to be performed:

**Do not do this if you're using the expo config plugin!**

### Android

* in `MainApplication.java`:

```diff
+ import eu.reactnativetraining.ThemeControlModule;

//...

@Override
public void onCreate() {
  super.onCreate();
+  ThemeControlModule.Companion.recoverApplicationTheme(getApplicationContext());

  SoLoader.init(this, /* native exopackage */ false);
  initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
}
```

If you want, `androidxCoreVersion` can be set to the version of the androidx core you want to use.

### iOS

* in `AppDelegate.m`

```diff
+ #import "RNThemeControl.h"

//...
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
+  [RNThemeControl recoverApplicationTheme];

  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  return YES;
}
```


## Usage example

More examples can be found [in the example project](../example).

```tsx
import * as React from 'react';

import { Text, useColorScheme, View } from 'react-native';
import {
  setThemePreference,
  SystemBars,
  ThemePreference,
  useThemePreference,
} from '@vonovak/react-native-theme-control';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

export function SimpleScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const themePreference = useThemePreference();
  const bgColor = isDarkMode ? '#2A2550' : '#FFF6EA';
  const textColor = isDarkMode ? 'white' : 'black';
  const barsBackground = isDarkMode ? '#9900F0' : '#A0BCC2';
  const dividerColor = textColor;

  const textColorStyle = { color: textColor };

  const values: Array<ThemePreference> = ['light', 'dark', 'auto'];

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
      <SegmentedControl
        style={{ width: '100%' }}
        values={values}
        selectedIndex={values.indexOf(themePreference)}
        onChange={({ nativeEvent }) => {
          setThemePreference(nativeEvent.value as ThemePreference);
        }}
      />
      <Text style={textColorStyle}>useColorScheme(): {colorScheme}</Text>
      <Text style={textColorStyle}>
        useThemePreference(): {themePreference}
      </Text>
    </View>
  );
}
```

## Troubleshooting

#### Android activity restarts upon theme change

Make sure that inside of the `AndroidManifest.xml` file, the `android:configChanges` include `uiMode`. For example:

```
android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
```

#### Android scroll bar's color is not changing

The list components might need to re-render once the theme changes for the scroll bars to re-draw.

For example, if you're using `FlatList`, you can add a `key` prop to it, and change the value of the `key` prop when the theme changes. For example:

```tsx
const colorScheme = useColorScheme();

<FlatList
  key={colorScheme}
/>
```
