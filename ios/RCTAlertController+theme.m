#import <objc/runtime.h>
#import <React/RCTAlertController.h>

@implementation RCTAlertController (Theme)

+ (void)load {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    Class class = [self class];
    SEL originalSelector = @selector(viewWillAppear:);
    SEL swizzledSelector = @selector(themed_viewWillAppear:);
    
    Method originalMethod = class_getInstanceMethod(class, originalSelector);
    Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);
    
    IMP originalImp = method_getImplementation(originalMethod);
    IMP swizzledImp = method_getImplementation(swizzledMethod);
    
    class_replaceMethod(class,
                        swizzledSelector,
                        originalImp,
                        method_getTypeEncoding(originalMethod));
    class_replaceMethod(class,
                        originalSelector,
                        swizzledImp,
                        method_getTypeEncoding(swizzledMethod));
  });
}

- (void)themed_viewWillAppear:(BOOL)animated {
  if (@available(iOS 13.0, *)) {
    self.overrideUserInterfaceStyle = UIApplication.sharedApplication.delegate.window.overrideUserInterfaceStyle;
  }
  [self themed_viewWillAppear:animated];
}

@end
