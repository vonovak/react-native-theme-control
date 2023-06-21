#import "RNThemeControl.h"
// TODO remove with RN 72
#import "RCTConvert+RNThemeControl.h"
#import <React/RCTAppearance.h>
#import <React/RCTConvert.h>

static NSString *const THEME_ENTRY_KEY = @"RNThemeControl";

@implementation RNThemeControl

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (instancetype)init {
  self = [super init];
  if (self != nil) {
    if (@available(iOS 13.0, *)) {
      if (![NSThread isMainThread]) {
        RCTLogError(@"RNThemeControl: not inited on the main thread. This should not happen.");
        self.cachedStyle = UIUserInterfaceStyleUnspecified;
        return self;
      }
      UIUserInterfaceStyle current = UIApplication.sharedApplication.delegate.window.overrideUserInterfaceStyle;
      self.cachedStyle = current;
    }
  }
  return self;
}


RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSString *, getThemePreference)
{
  if (@available(iOS 13.0, *)) {
    UIUserInterfaceStyle current = (UIUserInterfaceStyle) self.cachedStyle;
    NSString* result = [RNThemeControl getRCTAppearanceOverride:current];
    if (result) {
      return result;
    }
  }
  return @"auto";
}

RCT_EXPORT_METHOD(setTheme:(NSString*) themeStyle
                  options:(NSDictionary*) options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{

  if (@available(iOS 13.0, *)) {
    UIUserInterfaceStyle style = [RCTConvert UIUserInterfaceStyle:themeStyle];

    BOOL shouldPersistTheme = options[@"persistTheme"] == nil || [options[@"persistTheme"] boolValue];
    if (shouldPersistTheme) {
      [self persistTheme: style];
    }

    self.cachedStyle = style;

    dispatch_async(dispatch_get_main_queue(), ^{
      [RNThemeControl forceTheme:style];
    });
  }
  resolve([NSNull null]);
}

- (void) persistTheme: (UIUserInterfaceStyle) style API_AVAILABLE(ios(12.0)){
  NSUserDefaults* defaults = NSUserDefaults.standardUserDefaults;
  if (style == UIUserInterfaceStyleUnspecified) {
    [defaults removeObjectForKey:THEME_ENTRY_KEY];
  } else {
    [defaults setInteger:style forKey:THEME_ENTRY_KEY];
  }
}

+ (void) recoverApplicationTheme {
  if (@available(iOS 13.0, *)) {
    NSUserDefaults* defaults = NSUserDefaults.standardUserDefaults;
    NSInteger recoveredInt = [defaults integerForKey:THEME_ENTRY_KEY];
    UIUserInterfaceStyle recoveredStyle = [RNThemeControl intToUIUserInterfaceStyle:recoveredInt];
    BOOL noStyleToSet = recoveredStyle == 0;
    if (noStyleToSet) {
      return;
    }
    [RNThemeControl forceTheme:recoveredStyle];
  }
}

+ (void) forceTheme: (NSInteger) forcedStyle {
  if (@available(iOS 13.0, *)) {
    UIUserInterfaceStyle casted = [RNThemeControl intToUIUserInterfaceStyle:forcedStyle];
    NSArray<UIWindow *> *windows = RCTSharedApplication().windows;
    for (UIWindow *window in windows) {
      window.overrideUserInterfaceStyle = casted;
    }
    NSString* appearanceOverride = [RNThemeControl getRCTAppearanceOverride:casted];
    // TODO investigate more into why this call is needed
    RCTOverrideAppearancePreference(appearanceOverride);
  }
}

+ (nullable NSString*) getRCTAppearanceOverride: (UIUserInterfaceStyle) style API_AVAILABLE(ios(12.0)){
  BOOL doNotOverride = style == UIUserInterfaceStyleUnspecified;
  if (doNotOverride) {
    return nil;
  }
  NSString* forcedStyle = style == UIUserInterfaceStyleDark ? @"dark" : @"light";
  return forcedStyle;
}

+ (UIUserInterfaceStyle) intToUIUserInterfaceStyle: (NSInteger) style  API_AVAILABLE(ios(12.0)){
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
