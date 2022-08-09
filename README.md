# react-native-theme-control

The code is located [here](https://github.com/vonovak-org/react-native-theme-control) and is currently available to my sponsors only. This is further explained [below](README.md#this-package-is-sponsorware-).

You can sponsor me [here](https://github.com/sponsors/vonovak).
___

Control the native platform theme from react native, and persist it across application restarts.

This means you can not only control your React Native Views but also the theme of native elements. This was tested with alerts, native menus and date pickers on both Android and iOS, but should work more generally: see the iOS screenshots where keyboard background color is influenced too.

Integrating the package is easy: it exposes functions to control the theme, and you can read the active theme using `react-native.useColorScheme()`, which you're probably already using.

Additionally, the package provides functionality to control the appearance (background and border color, light / dark buttons) of the Android navbar.

<table>
  <tr><td><strong>light</strong></td><td><strong>dark</strong></td></tr>
  <tr>
    <td><p align="center"><img src="/img/light_mode.png" height="500"></p></td>
    <td><p align="center"><img src="/img/dark_mode.png" height="500"></p></td>
  </tr>
</table>

## Motivation

The use case for the package is explained in a youtube video:

[![Watch the video](https://img.youtube.com/vi/NNYQj_T0Sf8/sddefault.jpg)](https://youtu.be/NNYQj_T0Sf8)


In React Native, you can use the `useColorScheme()` hook, or other functions from the `Appearance` API to get information about the system theme.

Using that information, you can then render your Views in dark or light mode design. However, that information is read-only: you cannot influence what the `useColorScheme()` hook returns. What if you want to allow the user to choose the application theme? React Native core does not directly expose the APIs to do so.

You might follow one of the many blog posts for theming React Native apps such as [here](https://blog.logrocket.com/comprehensive-guide-dark-mode-react-native/#dark-mode-react-native-using-context-api) or [here](https://medium.com/@ratebseirawan/react-native-dark-mode-done-right-13f83b39a4ca). The approach taken by the guides is to store the application theme in the JavaScript part of your app. However, this can easily leave your users with a broken experience because while the React Native views will be rendered correctly, the native views (Alert, Document picker, Date picker, Menu...) will not.

This package provides a solution to change the application theme so that both react native and native components use the same theme - see the [relevant part of the video](https://youtu.be/NNYQj_T0Sf8?t=73).

### Expo support

Expo is supported via a config plugin.


## This Package Is Sponsorware 💰💰💰

This package is only available to my GitHub Sponsors until I reach 55 sponsors.

Once the goal is reached, I will open the repo to the public.

Enjoy, and thanks for the support! ❤️

Sponsorware idea is not mine, learn more about **Sponsorware** at [github.com/sponsorware/docs](https://github.com/sponsorware/docs) 💰.

I simply adopted it because making open source is a lot of fun but is not sustainable without compensation.

## Documentation

> Note: these links are available to my github sponsors only.

Installation and usage instructions can be found [here](https://github.com/vonovak-org/react-native-theme-control/tree/main/docs/install.md).

The library api is documented in detail [here](https://github.com/vonovak-org/react-native-theme-control/tree/main/docs/readme-internal.md).

More usage examples can be found [in the example project](https://github.com/vonovak-org/react-native-theme-control).
