# @vonovak/react-native-theme-control

Version >= 7 supports RN 0.79+ and Expo 53+

## Table of Contents

- [Installation](#installation)
  - [Expo](#expo)
  - [Native files setup](#native-files-setup)
    - [Android](#android)
    - [iOS](#ios)
      - [Modify the AppDelegate](#modify-the-appdelegate)
- [Usage example](#usage-example)
- [Troubleshooting](#troubleshooting)
  - [Android activity restarts upon theme change](#android-activity-restarts-upon-theme-change)
  - [Android scroll bar's color is not changing](#android-scroll-bars-color-is-not-changing)

## Installation

```bash
yarn add @vonovak/react-native-theme-control
```

OR

```bash
npm i @vonovak/react-native-theme-control
```

### Expo

If you want to enable theme persistence across app restarts, or force a light / dark mode, add `@vonovak/react-native-theme-control` to the `plugins` entry in your Expo config file.

For example, the following will enable theme persistence across app restarts:

```json
{
  "expo": {
    "plugins": ["@vonovak/react-native-theme-control"]
  }
}
```

If you want to force light / dark mode always, to resolve issues [like this](https://github.com/react-native-datetimepicker/datetimepicker/issues/746), then specify the theme like this:

```json
{
  "expo": {
    "plugins": [
      [
        "@vonovak/react-native-theme-control",
        {
          "mode": "light"
        }
      ]
    ]
  }
}
```

**Available mode values:**

- `'light'` - Forces light mode
- `'dark'` - Forces dark mode
- `'userPreference'` - Uses system preference (default)

After configuring the plugin, run `npx expo prebuild --clean` and rebuild your iOS and Android projects.

### Native files setup

**⚠️ Do not do this if you're using Expo!**

There are manual installation steps that need to be performed in vanilla React Native Projects:

#### Android

Add the following to your `MainApplication.kt` (or `MainApplication.java`):

```kotlin
import eu.reactnativetraining.ThemeControlModule;

//...

@Override
public void onCreate() {
  super.onCreate();
  ThemeControlModule.Companion.recoverApplicationTheme(applicationContext);

  SoLoader.init(this, /* native exopackage */ false);
}
```

**Forcing specific themes:**

To force dark mode:

```kotlin
ThemeControlModule.Companion.forceTheme(androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_YES);
```

To force light mode:

```kotlin
ThemeControlModule.Companion.forceTheme(androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_NO);
```

**Note:** You can optionally set `androidxCoreVersion` to specify the version of androidx core you want to use.

#### iOS

##### Modify the AppDelegate

Recovering the application theme involves modification of native files. The following is required:

1. **Add to bridging header** (usually `ios/YourProjectName-Bridging-Header.h`):

```objc
#import <RNThemeControl.h>
```

2. **Modify AppDelegate.swift** in `didFinishLaunchingWithOptions`:

```diff
#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
+    RNThemeControl.recoverApplicationTheme()
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif
```

**Forcing specific themes:**

For testing purposes, you can use:

```objc
RNThemeControl.forceTheme
```

However, for production apps, it's recommended to [edit the plist file](https://stackoverflow.com/a/58034262/2070942) instead.

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

  const values: Array<ThemePreference> = ['light', 'dark', 'system'];

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

### Android activity restarts upon theme change

Make sure that inside the `AndroidManifest.xml` file, the `android:configChanges` include `uiMode`. For example:

```xml
android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
```

**Note:** Restarting the activity might be necessary for some theme-related changes to occur, for example, for [PlatformColor](https://reactnative.dev/docs/platformcolor) changes to take effect.

### Android scroll bar's color is not changing

The list components might need to re-render once the theme changes for the scroll bars to re-draw.

For example, if you're using `FlatList`, you can add a `key` prop to it, and change the value of the `key` prop when the theme changes:

```tsx
const colorScheme = useColorScheme();

<FlatList key={colorScheme} />;
```
