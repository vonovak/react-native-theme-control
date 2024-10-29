#import "RNThemeControl.h"
#import <React/RCTAppearance.h>
#import <React/RCTConvert.h>

static NSString *const THEME_ENTRY_KEY = @"RNThemeControl";
static NSString *const systemThemeName = @"system";
static UIUserInterfaceStyle cachedStyle = UIUserInterfaceStyleUnspecified;

@implementation RNThemeControl

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSString *, getThemePreference)
{
  UIUserInterfaceStyle current = cachedStyle;
  NSString* themePreferenceName = [RNThemeControl getRCTAppearanceOverride:current];
  return themePreferenceName ?: systemThemeName;
}

RCT_EXPORT_METHOD(setTheme:(NSString*) themeStyle
                  options:(NSDictionary*) options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{

  UIUserInterfaceStyle style = [systemThemeName isEqualToString:themeStyle] ? UIUserInterfaceStyleUnspecified : [RCTConvert UIUserInterfaceStyle:themeStyle];
  BOOL shouldPersistTheme = options[@"persistTheme"] == nil || [options[@"persistTheme"] boolValue];
  if (shouldPersistTheme) {
    [self persistTheme:style];
  }

  dispatch_async(dispatch_get_main_queue(), ^{
    // NOTE: technically, this part could be replaced with RN-JS appearance call
    [RNThemeControl forceTheme:style];
  });
  resolve([NSNull null]);
}

RCT_EXPORT_METHOD(setAppBackground:(NSDictionary*) options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  UIColor* background = [RCTConvert UIColor:options[@"appBackground"]];
  dispatch_async(dispatch_get_main_queue(), ^{
    UIWindow* rootWindow = UIApplication.sharedApplication.delegate.window;
    if (rootWindow) {
      // the color of the Window itself is visible when opening full-screen modals
      rootWindow.backgroundColor = background;
    }
    resolve(@(rootWindow != nil));
  });
}

- (void) persistTheme: (UIUserInterfaceStyle) style {
  NSUserDefaults* defaults = NSUserDefaults.standardUserDefaults;
  if (style == UIUserInterfaceStyleUnspecified) {
    [defaults removeObjectForKey:THEME_ENTRY_KEY];
  } else {
    [defaults setInteger:style forKey:THEME_ENTRY_KEY];
  }
}

+ (UIUserInterfaceStyle) recoverApplicationTheme {
  NSUserDefaults* defaults = NSUserDefaults.standardUserDefaults;
  NSInteger recoveredInt = [defaults integerForKey:THEME_ENTRY_KEY];
  UIUserInterfaceStyle recoveredStyle = [RNThemeControl intToUIUserInterfaceStyle:recoveredInt];

  BOOL doesHaveStyle = recoveredStyle != UIUserInterfaceStyleUnspecified;
  if (doesHaveStyle) {
    [RNThemeControl forceTheme:recoveredStyle];
  }
  return recoveredStyle;
}

+ (void) forceTheme: (UIUserInterfaceStyle) forcedStyle {
  cachedStyle = forcedStyle;

  NSArray<UIWindow *> *windows = RCTSharedApplication().windows;
  for (UIWindow *window in windows) {
    window.overrideUserInterfaceStyle = forcedStyle;
  }
  NSString* appearanceOverride = [RNThemeControl getRCTAppearanceOverride:forcedStyle];
  // TODO investigate more into why this call is needed
  RCTOverrideAppearancePreference(appearanceOverride);
}

+ (nullable NSString*) getRCTAppearanceOverride: (UIUserInterfaceStyle) style {
  BOOL doNotOverride = style == UIUserInterfaceStyleUnspecified;
  if (doNotOverride) {
    return nil;
  }
  NSString* forcedStyle = style == UIUserInterfaceStyleDark ? @"dark" : @"light";
  return forcedStyle;
}

+ (UIUserInterfaceStyle) intToUIUserInterfaceStyle: (NSInteger) style {
    switch(style) {
        case 1:
            return UIUserInterfaceStyleLight;
        case 2:
            return UIUserInterfaceStyleDark;
        default:
            return UIUserInterfaceStyleUnspecified;
    }
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)setNavbarAppearance:(JS::NativeThemeControl::NativeSetNavbarAppearanceParams &)params resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  // noop - android only
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
   (const facebook::react::ObjCTurboModule::InitParams &)params
{
   return std::make_shared<facebook::react::NativeThemeControlSpecJSI>(params);
}
#endif

@end
