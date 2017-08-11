
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

@interface ReactNativeExceptionHandler : NSObject <RCTBridgeModule>
+ (void) callOnException:(void (^)(NSException *exception, NSString *readeableException))callbackBlock;
+ (void) releaseErrorHandler;
@end


