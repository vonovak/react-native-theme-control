import * as RNTC from '../index';

it('sanity check for exported methods', () => {
  expect(RNTC).toMatchInlineSnapshot(`
    Object {
      "NavigationBar": [Function],
      "SystemBars": [Function],
      "ThemeAwareStatusBar": [Function],
      "getThemePreference": [Function],
      "setThemePreference": [Function],
      "useThemePreference": [Function],
    }
  `);
});
