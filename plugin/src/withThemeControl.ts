import { addImports } from '@expo/config-plugins/build/android/codeMod';
import { mergeContents } from '@expo/config-plugins/build/utils/generateCode';
import {
  ConfigPlugin,
  WarningAggregator,
  withAppDelegate,
  withMainActivity,
} from 'expo/config-plugins';

const moduleName = '@vonovak/react-native-theme-control';
const themeRecoveryTag = '-theme-recovery';

const withMainActivityThemeRecovery: ConfigPlugin = (config) => {
  return withMainActivity(config, (config) => {
    const src = addImports(
      config.modResults.contents,
      ['eu.reactnativetraining.ThemeControlModule'],
      config.modResults.language === 'java',
    );

    config.modResults.contents = mergeContents({
      src,
      tag: moduleName + themeRecoveryTag,
      newSrc: `    ThemeControlModule.Companion.recoverApplicationTheme(getApplicationContext());`,
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
    anchor: /@implementation AppDelegate/,
    offset: -1,
    comment: '//',
  });
};

const modifyAppDelegateLaunchingCode = (src: string) => {
  return mergeContents({
    tag: moduleName + themeRecoveryTag,
    src,
    newSrc: '[RNThemeControl recoverApplicationTheme];',
    anchor: /rootViewController.view = rootView;/,
    offset: 1,
    comment: '//',
  });
};

const withIosPlugin: ConfigPlugin = (config) => {
  return withAppDelegate(config, (config) => {
    if (['objc', 'objcpp'].includes(config.modResults.language)) {
      config.modResults.contents = addAppDelegateImport(
        config.modResults.contents,
      ).contents;

      config.modResults.contents = modifyAppDelegateLaunchingCode(
        config.modResults.contents,
      ).contents;
    } else {
      WarningAggregator.addWarningIOS(
        'withThemeControl',
        `Cannot setup ${moduleName} for Expo, the project AppDelegate is not a supported language: ${config.modResults.language}`,
      );
    }
    return config;
  });
};

/**
 * Apply with theme-control configuration for Expo projects.
 */
const withThemeControl: ConfigPlugin = (config) => {
  config = withIosPlugin(config);
  config = withMainActivityThemeRecovery(config);
  return config;
};

export default withThemeControl;
