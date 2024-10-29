# react-native-theme-control

Control the native platform theme from React Native.

✅ Control theme of RN Views, as well as native UI controls (alerts, native menus, date pickers... on both Android and iOS)

✅ Recover the previously set theme upon app startup, and **apply it before your app starts rendering**

✅ Control the color of the UIApplication Window (iOS) and the current Activity (Android) using [`AppBackground`](https://github.com/vonovak-org/react-native-theme-control/blob/main/docs/readme-internal.md#appbackground)

✅ Supports Expo via a config plugin

✅ [New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page) supported

Additionally, provides functionality to control the appearance (background and border color, light / dark buttons) of the Android navbar.

The package is tested with RN >= 0.66.1 (last tested with RN 74, Expo 51). See [RN version support](docs/install.md).

### Example

Notice the color of scroll bar and keyboard in the screenshots below.

| light mode                | dark mode               | application background in modal    |
| ------------------------- | ----------------------- |------------------------------------|
| ![light](./img/light.png) | ![dark](./img/dark.png) | ![app background](./img/modal.png) |

## Motivation

The use case for the package is explained in a [youtube video](https://youtu.be/NNYQj_T0Sf8).

In React Native, you can use the `useColorScheme()` hook, or other functions from the `Appearance` API to get information about the system theme.

Note: as of RN 72, the following paragraph isn't true anymore (there is `setColorScheme` now). However, RN does not maintain the selected color scheme across restarts and doesn't contain other goodies in this package.

Using that information, you can then render your Views in dark or light mode design. However, that information is read-only: you cannot influence what the `useColorScheme()` hook returns. What if you want to allow the user to choose the application theme? React Native core does not directly expose the APIs to do so.

You might follow one of the many blog posts for theming React Native apps such as [here](https://blog.logrocket.com/comprehensive-guide-dark-mode-react-native/#dark-mode-react-native-using-context-api) or [here](https://medium.com/@ratebseirawan/react-native-dark-mode-done-right-13f83b39a4ca). The approach taken by the guides is to store the application theme in the JavaScript part of your app. However, this can easily leave your users with a broken experience because while the React Native views will be rendered correctly, the native views (Alert, Document picker, Date picker, Menu...) will not.

This package provides a solution to change the application theme so that both react native and native components use the same theme - see the [relevant part of the video](https://youtu.be/NNYQj_T0Sf8?t=73).

## Documentation

Installation and usage instructions can be found [here](./docs/install.md).

The library api is documented in detail [here](./docs/readme-internal.md).

More usage examples can be found [in the example project](./example).

### Say thanks

If you find the package useful, consider giving a star to the repository or [sponsoring](https://github.com/sponsors/vonovak?frequency=one-time&sponsor=vonovak).

### Credits

Some naming inspiration for the Android Navbar components was taken from [react-native-bars](https://github.com/zoontek/react-native-bars).

## License

MIT
