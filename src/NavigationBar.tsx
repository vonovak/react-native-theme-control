import type { NavbarAppearanceParams, NavigationBarProps } from './types';

export function NavigationBar(_props: NavigationBarProps) {
  // function is better for generating docs using typedoc
  return null;
}

/**
 * Set the appearance of the navigation bar imperatively
 * */
export const setNavbarAppearance = (_params: NavbarAppearanceParams) =>
  Promise.resolve(null);

/**
 * @hidden
 * */
NavigationBar.setNavbarAppearance = (
  _params: NavbarAppearanceParams,
): Promise<null> => {
  console.warn(
    'NavigationBar.setNavbarAppearance is deprecated. Use setNavbarAppearance instead.',
  );
  return setNavbarAppearance(_params);
};
