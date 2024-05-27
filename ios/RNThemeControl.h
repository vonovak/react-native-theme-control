
#ifdef RCT_NEW_ARCH_ENABLED
  #import <RNThemeControlCGen/RNThemeControlCGen.h>
#else
  #import <React/RCTBridgeModule.h>
#endif

@interface RNThemeControl : NSObject <
#ifdef RCT_NEW_ARCH_ENABLED
NativeThemeControlSpec
#else
RCTBridgeModule
#endif
>

@property (nonatomic) UIUserInterfaceStyle cachedStyle;

+ (UIUserInterfaceStyle) recoverApplicationTheme;
+ (void) forceTheme: (UIUserInterfaceStyle) forcedStyle;

@end
