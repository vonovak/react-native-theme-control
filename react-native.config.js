const path = require('path');
const project = (() => {
  try {
    const {
      androidManifestPath,
    } = require('react-native-test-app');
    return {
      android: {
        sourceDir: path.join('example', 'android'),
        manifestPath: androidManifestPath(
          path.join(__dirname, 'example', 'android'),
        ),
      },
      ios: {
        sourceDir: path.join('example', 'ios'),
      },
    };
  } catch (e) {
    return undefined;
  }
})();

module.exports = {
  dependencies: {
    // Help rn-cli find and autolink this library
    '@vonovak/react-native-theme-control': {
      root: __dirname,
    },
    expo: {
      // otherwise RN cli will try to autolink expo
      platforms: {
        ios: null,
        android: null,
      },
    }
  },
  ...(project ? { project } : undefined),
};
