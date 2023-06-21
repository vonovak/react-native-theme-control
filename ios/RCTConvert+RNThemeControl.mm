#import "RCTConvert+RNThemeControl.h"

@implementation RCTConvert (RNThemeControl)

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunguarded-availability-new"
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_12_0

// TODO remove for RN 72

RCT_ENUM_CONVERTER(UIUserInterfaceStyle, (@{ @"dark": @(UIUserInterfaceStyleDark),
                                             @"light" : @(UIUserInterfaceStyleLight),
                                             @"auto" : @(UIUserInterfaceStyleUnspecified),
                                             @"unspecified" : @(UIUserInterfaceStyleUnspecified),
                                          }),
                   UIUserInterfaceStyleUnspecified, integerValue)
#endif
#pragma clang diagnostic pop

@end
