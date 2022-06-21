#import "RNThemeControl.h"
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
    UIUserInterfaceStyle current = self.cachedStyle;
    NSString* result = [RNThemeControl getRCTAppearanceOverride:current];
    if (result) {
      return result;
    }
  }
  return @"auto";
}


RCT_REMAP_METHOD(setTheme,
                 setThemeFrom:(nonnull NSString*) themeStyle
                 withOptions:(nonnull NSDictionary*) options
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
  
  if (@available(iOS 13.0, *)) {
    UIUserInterfaceStyle style = [RCTConvert UIUserInterfaceStyle:themeStyle];
    
    BOOL shouldPersistTheme = options[@"persistTheme"] == nil || [options[@"persistTheme"] boolValue];
    if (shouldPersistTheme) {
      [self persistTheme: style];
    }
    
    NSString* override = [RNThemeControl getRCTAppearanceOverride:style];
    self.cachedStyle = style;
    
    dispatch_async(dispatch_get_main_queue(), ^{
      UIApplication.sharedApplication.delegate.window.overrideUserInterfaceStyle = style;
      RCTOverrideAppearancePreference(override);
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
    UIUserInterfaceStyle recoveredStyle = [defaults integerForKey:THEME_ENTRY_KEY];
    BOOL noStyleToSet = recoveredStyle == 0;
    if (noStyleToSet) {
      return;
    }
    UIApplication.sharedApplication.delegate.window.overrideUserInterfaceStyle = recoveredStyle;
    NSString* override = [RNThemeControl getRCTAppearanceOverride:recoveredStyle];
    // TODO investigate more into why this call is needed
    RCTOverrideAppearancePreference(override);
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

@end
