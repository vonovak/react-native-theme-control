import { addImports } from '@expo/config-plugins/build/android/codeMod';
import { mergeContents } from '@expo/config-plugins/build/utils/generateCode';
import {
  ConfigPlugin,
  withDangerousMod,
  withMainActivity,
} from 'expo/config-plugins';
import { readFileSync, writeFileSync } from 'fs';
import { sync as globSync } from 'glob';
import * as path from 'path';

const moduleName = '@vonovak/react-native-theme-control';
const themeRecoveryTag = '-theme-recovery';

type Options = {
  mode?: 'userPreference' | 'light' | 'dark';
};
type ThemeConfigPlugin = ConfigPlugin<Options>;
const withMainActivityThemeRecovery: ThemeConfigPlugin = (config, options) => {
  return withMainActivity(config, (config) => {
    const src = addImports(
      config.modResults.contents,
      ['eu.reactnativetraining.ThemeControlModule'],
      config.modResults.language === 'java',
    );

    const themeRecoveryCode = (() => {
      if (options.mode === 'light') {
        return 'ThemeControlModule.Companion.forceTheme(androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_NO);';
      }
      if (options.mode === 'dark') {
        return 'ThemeControlModule.Companion.forceTheme(androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_YES);';
      }
      return 'ThemeControlModule.Companion.recoverApplicationTheme(getApplicationContext());';
    })();

    config.modResults.contents = mergeContents({
      src,
      tag: moduleName + themeRecoveryTag,
      newSrc: `    ${themeRecoveryCode}`,
      anchor: /(?<=^.*super\.onCreate.*$)/m,
      offset: 1,
      comment: '//',
    }).contents;

    return config;
  });
};

const addAppDelegateImport = (src: string) => {
  return mergeContents({
    tag: moduleName + '-import',
    src,
    newSrc: `#if __has_include(<RNThemeControl.h>)
    #import <RNThemeControl.h>
#else
    #import "RNThemeControl.h"
#endif`,
    anchor: /#import "RCTAppDelegate.h"/,
    offset: 1,
    comment: '//',
  });
};
const addHeaderSearchPath = (src: string) => {
  const pkgLocation = path.dirname(
    require.resolve(`${moduleName}/package.json`),
  );

  return mergeContents({
    tag: moduleName + '-header',
    src,
    newSrc: `"${pkgLocation}/ios",`,
    anchor: /header_search_paths = \[/,
    offset: 1,
    comment: '#',
  });
};

const addThemeRecovery = (src: string, options: Options) => {
  const themeRecoveryCode = (() => {
    if (options.mode === 'light') {
      return '[RNThemeControl forceTheme:UIUserInterfaceStyleLight];';
    }
    if (options.mode === 'dark') {
      return '[RNThemeControl forceTheme:UIUserInterfaceStyleDark];';
    }
    return '[RNThemeControl recoverApplicationTheme];';
  })();

  return mergeContents({
    tag: moduleName + themeRecoveryTag,
    src,
    newSrc: themeRecoveryCode,
    anchor: /rootViewController.view = rootView;/,
    offset: 1,
    comment: '//',
  });
};

const withIosPlugin: ThemeConfigPlugin = (config, options) => {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const rctAppDelegatePath = getAppDelegateFilePath(
        config.modRequest.projectRoot,
        'RCTAppDelegate.@(m|mm)',
      );
      const withImport = addAppDelegateImport(
        readFileSync(rctAppDelegatePath, 'utf8'),
      ).contents;
      const withThemeRecovered = addThemeRecovery(withImport, options).contents;
      writeFileSync(rctAppDelegatePath, withThemeRecovered);

      const appDelegatePodspecPath = getAppDelegateFilePath(
        config.modRequest.projectRoot,
        'React-RCTAppDelegate.podspec',
      );
      const podspecContent = readFileSync(appDelegatePodspecPath, 'utf8');
      const withHeaderSearchPath = addHeaderSearchPath(podspecContent).contents;
      writeFileSync(appDelegatePodspecPath, withHeaderSearchPath);
      return config;
    },
  ]);
};

function getAppDelegateFilePath(projectRoot: string, fileName: string): string {
  const rnLocation = path.dirname(require.resolve('react-native/package.json'));
  if (!rnLocation) {
    throw new Error(
      `${moduleName}: Could not locate React Native from root: "${projectRoot}"`,
    );
  }
  const [using, ...extra] = globSync(fileName, {
    absolute: true,
    cwd: path.join(rnLocation, 'Libraries/AppDelegate'),
    ignore: [],
  });

  if (!using) {
    throw new Error(
      `${moduleName}: Could not locate a valid ${fileName} from root: "${projectRoot}"`,
    );
  }

  if (extra.length > 0) {
    console.warn(`${moduleName}: multiple candidates for RN path`, {
      tag: 'RCTAppDelegate',
      fileName,
      projectRoot,
      using,
      extra,
    });
  }

  return using;
}

/**
 * Apply react-native-theme-control configuration for Expo projects.
 */
const withThemeControl: ThemeConfigPlugin = (config, options = {}) => {
  if (
    options.mode &&
    !['userPreference', 'light', 'dark'].includes(options.mode)
  ) {
    throw new Error(
      `${moduleName}: Invalid mode "${options.mode}". Valid modes are "userPreference", "light" and "dark".`,
    );
  }
  config = withIosPlugin(config, options);
  config = withMainActivityThemeRecovery(config, options);
  return config;
};

export default withThemeControl;
