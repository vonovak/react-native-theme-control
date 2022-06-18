# react-native-theme-control

Control the native platform theme from react native.

This means you can not only control your React Native Views but also the theme of native elements, such as alerts, native menus, date pickers and so on.

Additionally, provides functionality to control the colors of the Android navbar.

## Motivation

[youtube video](https://youtu.be/NNYQj_T0Sf8)

In React Native, you can use the `useColorScheme()` hook, or other functions from the `Appearance` API to get information about the system theme.

Using that information, you can then render your Views in dark or light mode design. However, that information is read-only: you cannot influence what the `useColorScheme()` hook returns. What if you want to allow the user to choose the application theme? React Native core does not directly expose the APIs to do so.

Now, you might follow one of the many blog posts for theming React Native apps such as [here](https://blog.logrocket.com/comprehensive-guide-dark-mode-react-native/#dark-mode-react-native-using-context-api) or [here](https://medium.com/@ratebseirawan/react-native-dark-mode-done-right-13f83b39a4ca). The approach taken by the guides is to store the application theme in the JavaScript part of your app. However, this can easily leave your users with a broken experience because while the React Native views will be rendered correctly, the native views (Alert, Document picker, Date picker, Menu...) will not.


## This Package Is Sponsorware 💰💰💰

This package is only available to my GitHub Sponsors until I reach 55 sponsors.

Once the goal is reached, I will open the repo to the public.

Enjoy, and thanks for the support! ❤️

Sponsorware idea is not mine, learn more about **Sponsorware** at [github.com/sponsorware/docs](https://github.com/sponsorware/docs) 💰.

I simply adopted it because making open source is a lot of fun but is not sustainable without compensation.

## Documentation

Installation and usage instructions can be found [here](./docs/install.md).

The library api is documented in detail [here](./docs/readme-internal.md).

More usage examples can be found [in the example project](./example).

### Credits

Some naming inspiration for the Android Navbar components was taken from [react-native-bars](https://github.com/zoontek/react-native-bars).

## License

MPL-2.0
