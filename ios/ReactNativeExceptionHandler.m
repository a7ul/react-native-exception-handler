#import "ReactNativeExceptionHandler.h"
#import  <UIKit/UIKit.h>
#include <libkern/OSAtomic.h>
#include <execinfo.h>

NSString * const UncaughtExceptionHandlerSignalExceptionName = @"UncaughtExceptionHandlerSignalExceptionName";
NSString * const UncaughtExceptionHandlerSignalKey = @"UncaughtExceptionHandlerSignalKey";
NSString * const UncaughtExceptionHandlerAddressesKey = @"UncaughtExceptionHandlerAddressesKey";

volatile int32_t UncaughtExceptionCount = 0;
const int32_t UncaughtExceptionMaximum = 10;

const NSInteger UncaughtExceptionHandlerSkipAddressCount = 4;
const NSInteger UncaughtExceptionHandlerReportAddressCount = 5;

@implementation ReactNativeExceptionHandler

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

bool dismissed = true;

void (^nativeErrorCallbackBlock)(NSException *exception, NSString *readeableException);
void (^jsErrorCallbackBlock)(NSException *exception, NSString *readeableException);


void (^defaultNativeErrorCallbackBlock)(NSException *exception, NSString *readeableException) =
^(NSException *exception, NSString *readeableException){
    
    UIAlertController* alert = [UIAlertController
                                alertControllerWithTitle:@"Bug Captured"
                                message: readeableException
                                preferredStyle:UIAlertControllerStyleAlert];
    
    UIApplication* app = [UIApplication sharedApplication];
    UIViewController * rootViewController = app.delegate.window.rootViewController;
    [rootViewController presentViewController:alert animated:YES completion:nil];
    
    [NSTimer scheduledTimerWithTimeInterval:5.0
                                     target:[ReactNativeExceptionHandler class]
                                   selector:@selector(releaseErrorHandler)
                                   userInfo:nil
                                    repeats:NO];
};


+ (void) setNativeExceptionHandlerBlock:(void (^)(NSException *exception, NSString *readeableException))nativeCallbackBlock{
    NSLog(@"SET THE CALLBACK HANDLER NATTTIVEEE");
    nativeErrorCallbackBlock = nativeCallbackBlock;
}

+ (void) releaseErrorHandler {
    dismissed = true;
    NSLog(@"RELEASING LOCKED RN EXCEPTION HANDLER");
}

- (void)handleException:(NSException *)exception
{
    NSString * readeableError = [NSString stringWithFormat:NSLocalizedString(@"%@\n%@", nil),
                                 [exception reason],
                                 [[exception userInfo] objectForKey:UncaughtExceptionHandlerAddressesKey]];
    dismissed = false;
    
    if(nativeErrorCallbackBlock != nil){
        nativeErrorCallbackBlock(exception,readeableError);
    }else{
        defaultNativeErrorCallbackBlock(exception,readeableError);
    }
    jsErrorCallbackBlock(exception,readeableError);
    
    CFRunLoopRef runLoop = CFRunLoopGetCurrent();
    CFArrayRef allModes = CFRunLoopCopyAllModes(runLoop);
    while (!dismissed)
    {
        long count = CFArrayGetCount(allModes);
        long i = 0;
        while(i < count){
            NSString *mode = CFArrayGetValueAtIndex(allModes, i);
            if(![mode isEqualToString:@"kCFRunLoopCommonModes"]){
                CFRunLoopRunInMode((CFStringRef)mode, 0.001, false);
            }
            i++;
        }
    }
    
    CFRelease(allModes);
    
    NSSetUncaughtExceptionHandler(NULL);
    signal(SIGABRT, SIG_DFL);
    signal(SIGILL, SIG_DFL);
    signal(SIGSEGV, SIG_DFL);
    signal(SIGFPE, SIG_DFL);
    signal(SIGBUS, SIG_DFL);
    signal(SIGPIPE, SIG_DFL);
    
    kill(getpid(), [[[exception userInfo] objectForKey:UncaughtExceptionHandlerSignalKey] intValue]);

}

void HandleException(NSException *exception)
{
    int32_t exceptionCount = OSAtomicIncrement32(&UncaughtExceptionCount);
    if (exceptionCount > UncaughtExceptionMaximum)
    {
        return;
    }
    
    NSArray *callStack = [ReactNativeExceptionHandler backtrace];
    NSMutableDictionary *userInfo =
    [NSMutableDictionary dictionaryWithDictionary:[exception userInfo]];
    [userInfo
     setObject:callStack
     forKey:UncaughtExceptionHandlerAddressesKey];
    
    [[[ReactNativeExceptionHandler alloc] init]
     performSelectorOnMainThread:@selector(handleException:)
     withObject:
     [NSException
      exceptionWithName:[exception name]
      reason:[exception reason]
      userInfo:userInfo]
     waitUntilDone:YES];
}

void SignalHandler(int signal)
{
    int32_t exceptionCount = OSAtomicIncrement32(&UncaughtExceptionCount);
    if (exceptionCount > UncaughtExceptionMaximum)
    {
        return;
    }
    
    NSMutableDictionary *userInfo =
    [NSMutableDictionary
     dictionaryWithObject:[NSNumber numberWithInt:signal]
     forKey:UncaughtExceptionHandlerSignalKey];
    
    NSArray *callStack = [ReactNativeExceptionHandler backtrace];
    [userInfo
     setObject:callStack
     forKey:UncaughtExceptionHandlerAddressesKey];
    
    [[[ReactNativeExceptionHandler alloc] init]
     performSelectorOnMainThread:@selector(handleException:)
     withObject:
     [NSException
      exceptionWithName:UncaughtExceptionHandlerSignalExceptionName
      reason:
      [NSString stringWithFormat:
       NSLocalizedString(@"Signal %d was raised.", nil),
       signal]
      userInfo:
      [NSDictionary
       dictionaryWithObject:[NSNumber numberWithInt:signal]
       forKey:UncaughtExceptionHandlerSignalKey]]
     waitUntilDone:YES];
}


+ (NSArray *)backtrace
{
    void* callstack[128];
    int frames = backtrace(callstack, 128);
    char **strs = backtrace_symbols(callstack, frames);
    
    int i;
    NSMutableArray *backtrace = [NSMutableArray arrayWithCapacity:frames];
    for (
         i = UncaughtExceptionHandlerSkipAddressCount;
         i < UncaughtExceptionHandlerSkipAddressCount +
         UncaughtExceptionHandlerReportAddressCount;
         i++)
    {
        [backtrace addObject:[NSString stringWithUTF8String:strs[i]]];
    }
    free(strs);
    
    return backtrace;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setiOSNativeExceptionHandler:(RCTResponseSenderBlock)callback)
{
    jsErrorCallbackBlock = ^(NSException *exception, NSString *readeableException){
        callback(@[readeableException]);
    };
    
    NSSetUncaughtExceptionHandler(&HandleException);
    signal(SIGABRT, SignalHandler);
    signal(SIGILL, SignalHandler);
    signal(SIGSEGV, SignalHandler);
    signal(SIGFPE, SignalHandler);
    signal(SIGBUS, SignalHandler);
    signal(SIGPIPE, SignalHandler);
    NSLog(@"REGISTERED RN EXCEPTION HANDLER");
}

@end
