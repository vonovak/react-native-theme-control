# react-native-theme-control

iOS 13 or newer is required for theming logic. However, the package builds with iOS 10 and newer.

Version 3 supports RN >= 0.71 and Expo 48.

Version 2 supports RN 0.70 and Expo 47.

For version 1, the minimum required RN version is 0.66.1. Version 1 can also be used with Expo >=45 and < 47.

## Installation

```bash
yarn add @terivo-dev/theamy
```

OR

```bash
npm i @terivo-dev/theamy
```

Then, run `npx pod-install` and rebuild your iOS and Android projects.

### Expo

Note that there is a known issue when using the `expo-dev-client` package - it interferes with this package in development.
However, production builds work fine. This issue will be fixed in the future.

add `@terivo-dev/theamy` to the `plugins` entry in expo config file, e.g.:

`"plugins": ["@terivo-dev/theamy"]`

if you want to force light / dark mode always, to resolve issues [like this](https://github.com/react-native-datetimepicker/datetimepicker/issues/746) then specify the theme like this:

```
"plugins": [
  [
    "@terivo-dev/theamy", {
      "mode": "light"
    }
  ]
]
```

The `mode` values are `'light' | 'dark' | 'userPreference'` ('userPreference') is default.

Make sure that `userInterfaceStyle` in `expo` entry in expo config file is set to `automatic` or that it's not present at all.

```json
{
  "expo": {
    "userInterfaceStyle": "automatic"
  }
}
```

## Native files setup:

There are manual installation steps that need to be performed:

**Do not do this if you're using the expo config plugin!**

### Android

- in `MainApplication.java`:

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

If you want to force dark / light theme always, use:

`ThemeControlModule.Companion.forceTheme(androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_YES);`

or

`ThemeControlModule.Companion.forceTheme(androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_NO);`

If you want, `androidxCoreVersion` can be set to the version of the androidx core you want to use.

### iOS

## for RN >= 0.71

The AppDelegate no longer contains the code that we need to modify to make theming work. Instead, we need to modify the `RCTAppDelegate.mm` file located in `node_modules/react-native/Libraries/AppDelegate`.

Use the same modification as shown below for RN 0.70, and apply it to the node_modules file. Use tools such as `yarn patch` or `patch-package` to maintain the change.

## for RN <= 0.70

- in `AppDelegate.m`

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

If you want to force dark / light theme always, [prefer editing the plist file](https://stackoverflow.com/a/58034262/2070942) or use:

`[RNThemeControl forceTheme:UIUserInterfaceStyleDark];`

or

`[RNThemeControl forceTheme:UIUserInterfaceStyleLight];`

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
} from '@terivo-dev/theamy';
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

<FlatList key={colorScheme} />;
```
