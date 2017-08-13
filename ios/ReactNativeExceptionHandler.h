
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

@interface ReactNativeExceptionHandler : NSObject <RCTBridgeModule>
+ (void) replaceNativeExceptionHandlerBlock:(void (^)(NSException *exception, NSString *readeableException))nativeCallbackBlock;
+ (void) releaseExceptionHold;
@end


