import { addImports } from '@expo/config-plugins/build/android/codeMod';
import { Paths } from '@expo/config-plugins/build/ios';
import { mergeContents } from '@expo/config-plugins/build/utils/generateCode';
import {
  ConfigPlugin,
  withDangerousMod,
  withMainActivity,
} from 'expo/config-plugins';
import { promises } from 'fs';
import { sync as globSync } from 'glob';
import * as path from 'path';
const { writeFile } = promises;

const moduleName = '@terivo-dev/theamy';
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
    newSrc: '#import "RNThemeControl.h"',
    anchor: /#import "RCTAppDelegate.h"/,
    offset: 1,
    comment: '//',
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
    async (config) => {
      const delegatePath = getAppDelegateFilePath(
        config.modRequest.projectRoot,
      );
      const contents = Paths.getFileInfo(delegatePath).contents;
      const withImport = addAppDelegateImport(contents).contents;
      const withThemeRecovered = addThemeRecovery(withImport, options).contents;
      await writeFile(delegatePath, withThemeRecovered);
      return config;
    },
  ]);
};

function getAppDelegateFilePath(projectRoot: string): string {
  const rnLocation = path.dirname(require.resolve('react-native/package.json'));
  if (!rnLocation) {
    throw new Error(
      `${moduleName}: Could not locate React Native from root: "${projectRoot}"`,
    );
  }
  const [using, ...extra] = globSync('RCTAppDelegate.@(m|mm)', {
    absolute: true,
    cwd: path.join(rnLocation, 'Libraries/AppDelegate'),
    ignore: [],
  });

  if (!using) {
    throw new Error(
      `${moduleName}: Could not locate a valid RCTAppDelegate from root: "${projectRoot}"`,
    );
  }

  if (extra.length > 0) {
    console.warn(`${moduleName}: multiple candidates for RN path`, {
      tag: 'RCTAppDelegate',
      fileName: 'RCTAppDelegate',
      projectRoot,
      using,
      extra,
    });
  }

  return using;
}

/**
 * Apply theamy configuration for Expo projects.
 */
const withTheamy: ThemeConfigPlugin = (config, options = {}) => {
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

export default withTheamy;
