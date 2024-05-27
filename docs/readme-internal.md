# @vonovak/react-native-theme-control

## Table of contents

### Functions

- [setThemePreference](readme-internal.md#setthemepreference)
- [getThemePreference](readme-internal.md#getthemepreference)
- [useThemePreference](readme-internal.md#usethemepreference)
- [setNavbarAppearance](readme-internal.md#setnavbarappearance)
- [setAppBackground](readme-internal.md#setappbackground)

### React components

- [NavigationBar](readme-internal.md#navigationbar)
- [ThemeAwareStatusBar](readme-internal.md#themeawarestatusbar)
- [SystemBars](readme-internal.md#systembars)
- [AppBackground](readme-internal.md#appbackground)

### Type aliases

- [AppBackgroundProps](readme-internal.md#appbackgroundprops)
- [SystemBarsProps](readme-internal.md#systembarsprops)
- [NavigationBarProps](readme-internal.md#navigationbarprops)
- [NavbarAppearanceParams](readme-internal.md#navbarappearanceparams)
- [ThemePreference](readme-internal.md#themepreference)
- [SetThemeOptions](readme-internal.md#setthemeoptions)
- [AppBackgroundProps](readme-internal.md#appbackgroundprops)

## Functions

### setThemePreference

▸ **setThemePreference**(`style`, `options?`): `void`

Sets the theme preference, which also influences the value returned by `useColorScheme()` hook.
can be `system`, `light` or `dark`.

`system` means that the theme preference is determined by the system.

#### Parameters

| Name | Type |
| :------ | :------ |
| `style` | [`ThemePreference`](readme-internal.md#themepreference) |
| `options` | [`SetThemeOptions`](readme-internal.md#setthemeoptions) |

### getThemePreference

▸ **getThemePreference**(): [`ThemePreference`](readme-internal.md#themepreference)

Function that returns the current theme preference

### setNavbarAppearance

> **setNavbarAppearance**(`params`): `Promise`\<`null`\>

Set the appearance of the navigation bar imperatively

## Parameters

• **\_params**: [`NavbarAppearanceParams`](../type-aliases/NavbarAppearanceParams.md)

## Returns

`Promise`\<`null`\>

### setAppBackground

> **setAppBackground**(`bgColor`): `Promise`\<`boolean`\>

Set the application background imperatively

## Parameters

• **bgColor**: `ColorValue`

## Returns

`Promise`\<`boolean`\>

___

### useThemePreference

▸ **useThemePreference**(): [`ThemePreference`](readme-internal.md#themepreference)

A React hook that returns the current theme preference, which might be `dark`, `light` (if you have set the theme before by calling `setAppearance`) or `system`.

___

## React components

### NavigationBar

▸ **NavigationBar**(`props`): ``null``

Android-only component, which controls the navigation bar appearance: the background color, divider color and whether the navbar buttons are light or dark.
If active color scheme is dark, then the button icons will be rendered as light by default. You can override this behavior by passing a custom `barStyle` prop.

Multiple `NavigationBar` components can be mounted in the app, and always the last one will be used.

If you want to control the appearance imperatively, call `setNavbarAppearance()`.

- `dark-content` means dark icons on a light navigation bar
- `light-content` means light icons on a dark navigation bar

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`NavigationBarProps`](readme-internal.md#navigationbarprops) |


If you want to control the appearance imperatively, call `NavigationBar.setNavbarAppearance()`.

| Name | Type                                                                                                      |
| :------ |:----------------------------------------------------------------------------------------------------------|
| `setNavbarAppearance` | (`params`: [`NavbarAppearanceParams`](readme-internal.md#navbarappearanceparams)) => `Promise`<``null``\> |

___

### ThemeAwareStatusBar

▸ **ThemeAwareStatusBar**(`props`): `Element`

Thin wrapper on top of react-native's `StatusBar` that automatically determines the `barStyle` prop based on the active theme.
Specifically, if active color scheme is dark, then status bar icons will be rendered as light.
However, you can override this behavior by passing a custom `barStyle` prop.

#### Parameters

| Name    | Type |
|:--------| :------ |
| `props` | [`ThemeAwareStatusBarProps`](readme-internal.md#themeawarestatusbarprops) |

___

### AppBackground

▸ **AppBackground**(`props`): ``null``

Sets the background color of the UIApplication window (iOS) or the current Activity (Android).
This is useful with React Navigation to prevent [white flashes when navigating](https://github.com/react-navigation/react-navigation/issues/10951) on Android, or to control the background color users see when presenting a modal on iOS.

You need to specify the background color for light and dark mode separately.

Multiple `AppBackground` components can be mounted in the app, and always the last one will be used.

If you want to control the appearance imperatively, call `setAppBackground()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`AppBackgroundProps`](readme-internal.md#appbackgroundprops) |

#### Returns

``null``

### SystemBars

▸ **SystemBars**(`props`): `Element`

Combines the `NavigationBar` and `ThemeAwareStatusBar` into a single component.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`SystemBarsProps`](readme-internal.md#systembarsprops) |


## Type aliases

### ThemeAwareStatusBarProps

Ƭ **ThemeAwareStatusBarProps**: `StatusBarProps`

Props of [ThemeAwareStatusBar](readme-internal.md#themeawarestatusbar)

___

### AppBackgroundProps

Ƭ **AppBackgroundProps**: `Object`

Background color of the application window (iOS) or the current Activity (Android), for light and dark mode separately.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dark` | `ColorValue` |
| `light` | `ColorValue` |
___

### SystemBarsProps

Ƭ **SystemBarsProps**: [`ThemeAwareStatusBarProps`](readme-internal.md#themeawarestatusbarprops) & `Pick`\<[`NavigationBarProps`](readme-internal.md#navigationbarprops), ``"dividerColor"``\>

Props of [SystemBars](readme-internal.md#systembars)

---

### NavigationBarProps

Ƭ **NavigationBarProps**: `Pick`<`StatusBarProps`, ``"barStyle"``> & { `backgroundColor?`: `ColorValue` ; `dividerColor?`: `ColorValue`  }

Params that control the appearance of the Android navigation bar.

Also props of the [NavigationBar](readme-internal.md#navigationbar) component.

#### Type declaration

| Name               | Type              |
|:-------------------|:------------------|
| `backgroundColor?` | `ColorValue`      |
| `dividerColor?`    | `ColorValue`      |
| `barStyle?`        | `"light-content" \| "dark-content" \| "default" \| undefined` |

___

### NavbarAppearanceParams

Ƭ **NavbarAppearanceParams**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `backgroundColor?` | `ColorValue` |
| `dividerColor?` | `ColorValue` |
| `barStyle?` | ``"dark-content"`` \| ``"light-content"`` \| ``null`` |

___

### ThemePreference

Ƭ **ThemePreference**: ``"dark"`` | ``"light"`` | ``"system"``

___

### SetThemeOptions

Ƭ **SetThemeOptions**: `Object`

* `persistTheme`: whether to persist the theme preference across app restarts. Defaults to true. Note that you need to make changes to the native code to make this work (see installation instructions).

* `restartActivity`: whether to restart the Android activity when the theme changes. Defaults to false. Setting to true is not recommended, but might be useful for debugging.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `persistTheme?` | `boolean` |
| `restartActivity?` | `boolean` |
