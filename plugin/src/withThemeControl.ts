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

const themeControlName = '@vonovak/react-native-theme-control';
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
      tag: themeControlName + themeRecoveryTag,
      newSrc: `    ${themeRecoveryCode}`,
      anchor: /(?<=^.*super\.onCreate.*$)/m,
      offset: 1,
      comment: '//',
    }).contents;

    return config;
  });
};

const addImportToAppDelegate = (src: string) => {
  return mergeContents({
    tag: themeControlName + '-import',
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
    require.resolve(`${themeControlName}/package.json`),
  );

  return mergeContents({
    tag: themeControlName + '-header',
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
    tag: themeControlName + themeRecoveryTag,
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
      const projectRoot = config.modRequest.projectRoot;
      patchExpoDevLauncherController(projectRoot);
      patchAppDelegate(projectRoot, options);
      patchPodspecForUseFrameworks(projectRoot);
      return config;
    },
  ]);
};
function patchExpoDevLauncherController(projectRoot: string) {
  // this is only for the expo dev client, which overrides system theme and rewrites what we have set up
  // TODO this should really be fixed in expo itself
  try {
    const devLauncherPath = getDevLauncherPath(projectRoot);
    const fileContents = readFileSync(devLauncherPath, 'utf8');
    const fileContents2 = fileContents.replace(
      /(RCTOverrideAppearancePreference\((.*?)\);)/g,
      '//$1',
    );
    writeFileSync(devLauncherPath, fileContents2, 'utf8');
  } catch (err) {
    console.warn(
      `${themeControlName}: Could not patch Expo Dev Launcher, this is not a fatal error, it'll only influence the dev client`,
    );
  }
}

function patchAppDelegate(projectRoot: string, options: Options) {
  const rctAppDelegatePath = getAppDelegateFilePath(
    projectRoot,
    'RCTAppDelegate.@(m|mm)',
  );
  const withThemeControlImported = addImportToAppDelegate(
    readFileSync(rctAppDelegatePath, 'utf8'),
  ).contents;
  const withThemeRecovered = addThemeRecovery(
    withThemeControlImported,
    options,
  ).contents;
  writeFileSync(rctAppDelegatePath, withThemeRecovered);
}

function patchPodspecForUseFrameworks(projectRoot: string) {
  const appDelegatePodspecPath = getAppDelegateFilePath(
    projectRoot,
    'React-RCTAppDelegate.podspec',
  );
  const podspecContent = readFileSync(appDelegatePodspecPath, 'utf8');
  const withHeaderSearchPath = addHeaderSearchPath(podspecContent).contents;
  writeFileSync(appDelegatePodspecPath, withHeaderSearchPath);
}

function getDevLauncherPath(projectRoot: string): string {
  return getFilePath({
    projectRoot,
    packageName: 'expo-dev-launcher',
    subpath: 'ios/',
    fileName: 'EXDevLauncherController.m',
  });
}
function getAppDelegateFilePath(projectRoot: string, fileName: string): string {
  return getFilePath({
    projectRoot,
    packageName: 'react-native',
    subpath: 'Libraries/AppDelegate',
    fileName,
  });
}
function getFilePath({
  projectRoot,
  packageName,
  subpath,
  fileName,
}: {
  projectRoot: string;
  packageName: string;
  subpath: string;
  fileName: string;
}): string {
  const location = path.dirname(require.resolve(`${packageName}/package.json`));
  if (!location) {
    throw new Error(
      `${themeControlName}: Could not locate React Native from root: "${projectRoot}"`,
    );
  }
  const [using, ...extra] = globSync(fileName, {
    absolute: true,
    cwd: path.join(location, subpath),
    ignore: [],
  });

  if (!using) {
    throw new Error(
      `${themeControlName}: Could not locate a valid ${fileName} from root: "${projectRoot}"`,
    );
  }

  if (extra.length > 0) {
    console.warn(`${themeControlName}: multiple candidates for a path`, {
      tag: themeControlName,
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
      `${themeControlName}: Invalid mode "${options.mode}". Valid modes are "userPreference", "light" and "dark".`,
    );
  }
  config = withIosPlugin(config, options);
  config = withMainActivityThemeRecovery(config, options);
  return config;
};

export default withThemeControl;
