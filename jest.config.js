module.exports = {
  preset: 'react-native',
  modulePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/lib/',
  ],
  moduleNameMapper: {
    // Map the problematic EventEmitter to a mock implementation
    'react-native/Libraries/vendor/emitter/EventEmitter':
      '<rootDir>/src/__mocks__/EventEmitter.js',
  },
  setupFiles: ['./scripts/jest-setup.js'],
};
