/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NavbarAppearanceParams, NavigationBarProps } from './types';

/**
 * Android-only component, which controls the navigation bar appearance: the background color, divider color and whether the navbar buttons are light or dark.
 * If active color scheme is dark, then the button icons will be rendered as light by default. You can override this behavior by passing a custom `barStyle` prop.
 *
 * If you want to control the appearance imperatively, call `NavigationBar.setNavbarAppearance()`.
 * */
// @ts-ignore
export function NavigationBar(props: NavigationBarProps) {
  // function is better for generating docs using typedoc
  return null;
}

NavigationBar.setNavbarAppearance = (
  // @ts-ignore
  params: NavbarAppearanceParams
): Promise<null> => {
  return Promise.resolve(null);
};
