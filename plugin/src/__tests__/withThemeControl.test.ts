import { addThemeRecoveryToAppDelegate } from '../withThemeControl';

const recoveryCode = 'RNThemeControl.recoverApplicationTheme()';

// Expo SDK 53 - 57 template: the AppDelegate creates the window
const windowAppDelegate = `
  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
`;

// Expo SDK 58+ template: the window is created by SceneDelegate
const sceneAppDelegate = `
  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    // The window is created and React Native is started by \`SceneDelegate\` under the
    // scene-based life cycle (required by the iOS 27 SDK).
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
`;

const linesOf = (src: string) => src.split('\n').map((line) => line.trim());

describe('addThemeRecoveryToAppDelegate', () => {
  it('inserts the recovery right after the window is created', () => {
    const lines = linesOf(
      addThemeRecoveryToAppDelegate(windowAppDelegate, recoveryCode),
    );
    const windowLine = lines.indexOf(
      'window = UIWindow(frame: UIScreen.main.bounds)',
    );

    expect(lines[windowLine + 2]).toBe(recoveryCode);
  });

  it('inserts the recovery before didFinishLaunching returns when there is no window', () => {
    const lines = linesOf(
      addThemeRecoveryToAppDelegate(sceneAppDelegate, recoveryCode),
    );
    const returnLine = lines.indexOf(
      'return super.application(application, didFinishLaunchingWithOptions: launchOptions)',
    );

    expect(lines[returnLine - 2]).toBe(recoveryCode);
  });

  it('does not insert the recovery twice', () => {
    const once = addThemeRecoveryToAppDelegate(sceneAppDelegate, recoveryCode);
    const twice = addThemeRecoveryToAppDelegate(once, recoveryCode);

    expect(twice).toBe(once);
  });

  it('throws a clear error when no anchor is found', () => {
    expect(() =>
      addThemeRecoveryToAppDelegate('class AppDelegate {}', recoveryCode),
    ).toThrow(/@vonovak\/react-native-theme-control/);
  });
});
