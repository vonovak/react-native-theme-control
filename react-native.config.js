const project = (() => {
  const path = require('path');
  try {
    const {
      androidManifestPath,
      iosProjectPath,
    } = require('react-native-test-app');
    return {
      android: {
        sourceDir: path.join('example', 'android'),
        manifestPath: androidManifestPath(
          path.join(__dirname, 'example', 'android')
        ),
      },
      ios: {
        project: iosProjectPath('example/ios'),
      },
    };
  } catch (e) {
    console.error('react-native-test-app not found', e);
    return undefined;
  }
})();

module.exports = {
  dependencies: {
    // Help rn-cli find and autolink this library
    '@vonovak/react-native-theme-control': {
      root: __dirname,
    },
  },
  ...(project ? { project } : undefined),
};
