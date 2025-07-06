import { addImports } from '@expo/config-plugins/build/android/codeMod';
import { mergeContents } from '@expo/config-plugins/build/utils/generateCode';
import {
  ConfigPlugin,
  withDangerousMod,
  withMainActivity,
  withAppDelegate,
  withPlugins,
  withInfoPlist,
} from 'expo/config-plugins';
import { readFileSync, writeFileSync } from 'fs';
import { sync as globSync } from 'glob';
import * as path from 'path';
import resolveFrom from 'resolve-from';

const themeControlName = '@vonovak/react-native-theme-control';
const themeRecoveryTag = '-theme-recovery';

type Options = {
  mode?: 'userPreference' | 'light' | 'dark';
};
type ThemeConfigPlugin = ConfigPlugin<Options>;

const withMainActivityThemeRecovery: ThemeConfigPlugin = (config, options) => {
  return withMainActivity(config, (config) => {
    checkSystemUi(config.modRequest.projectRoot);

    const src = addImports(
      config.modResults.contents,
      ['eu.reactnativetraining.ThemeControlModule'],
      config.modResults.language === 'java',
    );

    const ctxSource =
      config.modResults.language === 'java'
        ? 'getApplicationContext()'
        : 'applicationContext';
    const themeRecoveryCode = (() => {
      if (options.mode === 'light') {
        return 'ThemeControlModule.Companion.forceTheme(androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_NO);';
      }
      if (options.mode === 'dark') {
        return 'ThemeControlModule.Companion.forceTheme(androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_YES);';
      }
      return `ThemeControlModule.Companion.recoverApplicationTheme(${ctxSource});`;
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

const insertThemeRecovery: ThemeConfigPlugin = (config, options) => {
  return withAppDelegate(config, (config) => {
    const themeRecoveryCode = (() => {
      if (options.mode === 'light') {
        return 'RNThemeControl.forceTheme(UIUserInterfaceStyle.light)';
      }
      if (options.mode === 'dark') {
        return 'RNThemeControl.forceTheme(UIUserInterfaceStyle.dark)';
      }
      return 'RNThemeControl.recoverApplicationTheme()';
    })();

    config.modResults.contents = mergeContents({
      src: config.modResults.contents,
      tag: themeControlName + themeRecoveryTag,
      newSrc: `    ${themeRecoveryCode}`,
      anchor: /window = UIWindow\(frame: UIScreen\.main\.bounds\)/,
      offset: 1,
      comment: '//',
    }).contents;

    return config;
  });
};

function patchBridgingHeader(projectRoot: string) {
  const iosPath = path.join(projectRoot, 'ios');
  const bridgingHeaders = globSync('**/*-Bridging-Header.h', {
    absolute: true,
    cwd: iosPath,
    ignore: [],
  });

  if (bridgingHeaders.length === 0) {
    throw new Error(
      `${themeControlName}: Could not find bridging header in ${iosPath}. Please ensure your project has a bridging header file.`,
    );
  }

  const bridgingHeaderPath = bridgingHeaders[0];

  try {
    const bridgingHeaderContent = readFileSync(bridgingHeaderPath, 'utf8');

    // Check if the import already exists
    if (!bridgingHeaderContent.includes('#import <RNThemeControl.h>')) {
      const updatedContent =
        bridgingHeaderContent +
        '\n// Added by RNTC config plugin\n#import <RNThemeControl.h>';

      writeFileSync(bridgingHeaderPath, updatedContent, 'utf8');
    }
  } catch (err) {
    throw new Error(
      `${themeControlName}: Could not modify bridging header at ${bridgingHeaderPath}: ${err}`,
    );
  }
}
const withUserInterfaceStyle: ConfigPlugin<void> = (config) => {
  return withInfoPlist(config, (config) => {
    config.modResults = {
      ...config.modResults,
      UIUserInterfaceStyle: 'Automatic',
    };
    return config;
  });
};

const checkSystemUi = (projectRoot: string) => {
  if (resolveFrom(projectRoot, 'expo-system-ui')) {
    throw new Error(
      `${themeControlName}: expo-system-ui is not compatible with react-native-theme-control (which covers system-ui functionality), please remove expo-system-ui from your project.
      The author of react-native-theme-control is working on a solution to improve this.`,
    );
  }
};

const withIosPlugin: ThemeConfigPlugin = (config, options) => {
  config = insertThemeRecovery(config, options);

  return withPlugins(config, [
    (cfg) => withUserInterfaceStyle(cfg),
    (cfg) =>
      withDangerousMod(cfg, [
        'ios',
        (config) => {
          const projectRoot = config.modRequest.projectRoot;

          checkSystemUi(projectRoot);
          patchExpoDevLauncherController(projectRoot);

          patchBridgingHeader(projectRoot);

          return config;
        },
      ]),
  ]);
};
function patchExpoDevLauncherController(projectRoot: string) {
  // this is only for the expo dev client, which overrides system theme and rewrites what we have set up
  // TODO this should really be fixed in expo itself
  try {
    const devLauncherPath = getDevLauncherPath(projectRoot);
    const fileContents = readFileSync(devLauncherPath, 'utf8');
    const commentOutAppearanceOverride = fileContents.replace(
      /(RCTOverrideAppearancePreference\((.*?)\);)/g,
      '//$1',
    );
    writeFileSync(devLauncherPath, commentOutAppearanceOverride, 'utf8');
  } catch (err) {
    console.warn(
      `${themeControlName}: Could not patch Expo Dev Launcher, this is not a fatal error, it'll only influence the dev client`,
    );
  }
}

function getDevLauncherPath(projectRoot: string): string {
  return getFilePath({
    projectRoot,
    packageName: 'expo-dev-launcher',
    subpath: 'ios/',
    fileName: 'EXDevLauncherController.m',
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
  const location = path.dirname(
    resolveFrom(projectRoot, `${packageName}/package.json`),
  );
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
