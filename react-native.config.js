const path = require('path');
const project = (() => {
  try {
    const { configureProjects } = require('react-native-test-app');
    return configureProjects({
      android: {
        sourceDir: path.join('example', 'android'),
      },
      ios: {
        sourceDir: path.join('example', 'ios'),
      },
    });
  } catch (e) {
    return undefined;
  }
})();

module.exports = {
  dependencies: {
    ...(project
      ? {
          // Help rn-cli find and autolink this library
          // don't do this as it will be processed twice
          '@vonovak/react-native-theme-control': {
            root: __dirname,
          },
          'expo': {
            // otherwise RN cli will try to autolink expo
            platforms: {
              ios: null,
              android: null,
            },
          },
        }
      : undefined),
  },
  ...(project ? { project } : undefined),
};
