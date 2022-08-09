import * as React from 'react';
import {
  Appearance,
  ColorSchemeName,
  processColor,
  useColorScheme,
} from 'react-native';
import type {
  NavbarAppearanceParams,
  NavigationBarProps as NavigationBarProps,
} from './types';
import {
  getThemePreference,
  SetNavbarAppearanceParams,
  ThemeControlModule,
} from './NativeModule';
import { useEffect } from 'react';

let delayedUpdateID: ReturnType<typeof setImmediate> | null = null;
let currentProps: NavigationBarProps | null = null;
const propsStack: NavigationBarProps[] = [];

const getBarStyleParam = (
  barStyle: NavigationBarProps['barStyle'],
  colorScheme: ColorSchemeName
): SetNavbarAppearanceParams['barStyle'] => {
  const preference = colorScheme || getThemePreference();
  if (!barStyle || barStyle === 'default') {
    return preference === 'dark' ? 'light-content' : 'dark-content';
  }
  return barStyle;
};

const didPropsChange = (
  oldProps: NavigationBarProps | null,
  lastEntry: NavigationBarProps
) => {
  return (
    oldProps?.dividerColor !== lastEntry.dividerColor ||
    oldProps?.backgroundColor !== lastEntry.backgroundColor ||
    oldProps?.barStyle !== lastEntry.barStyle
  );
};

function pushStackEntry(props: NavigationBarProps): NavigationBarProps {
  propsStack.push(props);
  updatePropsStack();
  return props;
}

function popStackEntry(entry: NavigationBarProps): void {
  const index = propsStack.indexOf(entry);
  if (index !== -1) {
    propsStack.splice(index, 1);
  }
  updatePropsStack();
}

function replaceStackEntry(
  entry: NavigationBarProps,
  newEntry: NavigationBarProps
): NavigationBarProps {
  const index = propsStack.indexOf(entry);
  if (index !== -1) {
    propsStack[index] = newEntry;
  }
  updatePropsStack();
  return newEntry;
}

function updatePropsStack() {
  // Send the update to the native module only once at the end of the frame.
  if (delayedUpdateID !== null) {
    clearImmediate(delayedUpdateID);
  }

  const updateNavbar = () => {
    const lastEntry = propsStack[propsStack.length - 1];

    if (lastEntry != null) {
      // Update only if style have changed or if current props are unavailable.
      if (didPropsChange(currentProps, lastEntry)) {
        const barStyle = getBarStyleParam(
          lastEntry.barStyle,
          Appearance.getColorScheme()
        );

        const params = {
          dividerColor: processColor(lastEntry.dividerColor) ?? null,
          backgroundColor: processColor(lastEntry.backgroundColor) ?? null,
          barStyle,
        };
        ThemeControlModule.setNavbarAppearance(params).catch(console.error);
      }

      // Update the current props values.
      currentProps = lastEntry;
    } else {
      // Reset current props when the stack is empty.
      currentProps = null;
    }
  };
  delayedUpdateID = setImmediate(updateNavbar);
}

export const NavigationBar = (props: NavigationBarProps) => {
  const colorScheme = useColorScheme();

  const barStyleParam = getBarStyleParam(props?.barStyle, colorScheme);

  const propsWithDefaultBarStyle: NavigationBarProps = {
    ...props,
    barStyle: barStyleParam,
  };

  const stackEntry = React.useRef<NavigationBarProps>(propsWithDefaultBarStyle);

  useEffect(() => {
    pushStackEntry(stackEntry.current);
    return () => {
      popStackEntry(stackEntry.current);
    };
  }, []);

  useEffect(() => {
    const entry = stackEntry.current;
    if (didPropsChange(entry, propsWithDefaultBarStyle)) {
      stackEntry.current = replaceStackEntry(entry, propsWithDefaultBarStyle);
    }
  });

  return null;
};

NavigationBar.setNavbarAppearance = ({
  dividerColor,
  backgroundColor,
  barStyle,
}: NavbarAppearanceParams): Promise<null> => {
  const barStyleParam = getBarStyleParam(barStyle, Appearance.getColorScheme());

  return ThemeControlModule.setNavbarAppearance({
    dividerColor: processColor(dividerColor) ?? null,
    backgroundColor: processColor(backgroundColor) ?? null,
    barStyle: barStyleParam,
  });
};
