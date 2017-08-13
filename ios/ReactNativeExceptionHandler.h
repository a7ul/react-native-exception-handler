
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#import  <UIKit/UIKit.h>
#include <libkern/OSAtomic.h>
#include <execinfo.h>

@interface ReactNativeExceptionHandler : NSObject <RCTBridgeModule>
+ (void) replaceNativeExceptionHandlerBlock:(void (^)(NSException *exception, NSString *readeableException))nativeCallbackBlock;
+ (void) releaseExceptionHold;
@end


