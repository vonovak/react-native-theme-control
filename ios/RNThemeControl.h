
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

// UIUserInterfaceStyle
@property (nonatomic) NSInteger cachedStyle;

// UIUserInterfaceStyle
+ (NSInteger) recoverApplicationTheme;
// UIUserInterfaceStyle
+ (void) forceTheme: (NSInteger) forcedStyle;

@end
