import * as RNTC from '../index';

it('sanity check for exported methods', () => {
  expect(RNTC).toMatchInlineSnapshot(`
    {
      "NavigationBar": [Function],
      "SystemBars": [Function],
      "ThemeAwareStatusBar": [Function],
      "getThemePreference": [Function],
      "setThemePreference": [Function],
      "useThemePreference": [Function],
    }
  `);
});
