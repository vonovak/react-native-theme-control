import type { NavbarAppearanceParams, NavigationBarProps } from './types';

export function NavigationBar(_props: NavigationBarProps) {
  // function is better for generating docs using typedoc
  return null;
}

NavigationBar.setNavbarAppearance = (
  _params: NavbarAppearanceParams,
): Promise<null> => {
  return Promise.resolve(null);
};
