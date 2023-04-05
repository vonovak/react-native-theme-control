#import <React/RCTBridgeModule.h>

@interface RNThemeControl : NSObject <RCTBridgeModule>

// UIUserInterfaceStyle
@property (nonatomic) NSInteger cachedStyle;

+ (void) recoverApplicationTheme;
+ (void) forceTheme: (NSInteger) forcedStyle;

@end
