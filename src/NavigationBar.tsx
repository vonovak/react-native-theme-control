/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NavbarAppearanceParams, NavigationBarProps } from './types';

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
