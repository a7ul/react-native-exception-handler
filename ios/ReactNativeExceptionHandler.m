#import "ReactNativeExceptionHandler.h"
#import <mach-o/dyld.h>

// CONSTANTS
NSString * const RNUncaughtExceptionHandlerSignalExceptionName = @"RNUncaughtExceptionHandlerSignalExceptionName";
NSString * const RNUncaughtExceptionHandlerSignalKey = @"RNUncaughtExceptionHandlerSignalKey";
NSString * const RNUncaughtExceptionHandlerAddressesKey = @"RNUncaughtExceptionHandlerAddressesKey";
volatile int32_t RNUncaughtExceptionCount = 0;
const int32_t RNUncaughtExceptionMaximum = 10;
const NSInteger RNUncaughtExceptionHandlerSkipAddressCount = 0;
const NSInteger RNUncaughtExceptionHandlerReportAddressCount = 15;


void getSlide(long* pheader,long* pslide) {
    for (uint32_t i = 0; i < _dyld_image_count(); i++) {
        if (_dyld_get_image_header(i)->filetype == MH_EXECUTE) {
            long slide = _dyld_get_image_vmaddr_slide(i);
            const struct mach_header* header = _dyld_get_image_header(i);
            if(pheader)*pheader=header;
            if(pslide)*pslide=slide;

            return;
        }
    }
}

long letMeCrash(){
    int* p = 1234;
    *p = 1;
    return 0;
}
long funcImyourDD(){ if(RNUncaughtExceptionCount%2) printf("funcImyourDD11");else printf("funcImyourDD22"); return letMeCrash();}
long funcFuckyourBB(){ if(RNUncaughtExceptionCount%2) printf("funcFuckyourBB11");else printf("funcFuckyourBB22"); return RNUncaughtExceptionCount+funcImyourDD();}
long funcAreyouSB(){ if(RNUncaughtExceptionCount%2) printf("funcAreyouSB11");else printf("funcAreyouSB22"); return RNUncaughtExceptionCount+funcFuckyourBB();}

@implementation ReactNativeExceptionHandler

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

// ======================
// VARIABLE DECLARATIONS
// ======================

//variable which is used to track till when to keep the app running on exception.
bool dismissApp = true;

//variable to hold the custom error handler passed while customizing native handler
void (^nativeErrorCallbackBlock)(NSException *exception, NSString *readeableException);

//variable to hold the js error handler when setting up the error handler in RN.
void (^jsErrorCallbackBlock)(NSException *exception, NSString *readeableException);

//variable that holds the default native error handler
void (^defaultNativeErrorCallbackBlock)(NSException *exception, NSString *readeableException) =
^(NSException *exception, NSString *readeableException){

    UIAlertController* alert = [UIAlertController
                                alertControllerWithTitle:@"Unexpected error occured"
                                message:[NSString stringWithFormat:@"%@\n%@",
                                         @"Apologies..The app will close now \nPlease restart the app\n",
                                         readeableException]
                                preferredStyle:UIAlertControllerStyleAlert];

    UIApplication* app = [UIApplication sharedApplication];
    UIViewController * rootViewController = app.delegate.window.rootViewController;
    [rootViewController presentViewController:alert animated:YES completion:nil];

    [NSTimer scheduledTimerWithTimeInterval:5.0
                                     target:[ReactNativeExceptionHandler class]
                                   selector:@selector(releaseExceptionHold)
                                   userInfo:nil
                                    repeats:NO];
};


// ====================================
// REACT NATIVE MODULE EXPOSED METHODS
// ====================================

RCT_EXPORT_MODULE();
		RCT_EXPORT_METHOD(raiseTestNativeError) { NSLog(@"RAISING A TEST EXCEPTION"); [NSException raise:@"TEST EXCEPTION" format:@"THIS IS A TEST EXCEPTION"]; }
		RCT_EXPORT_METHOD(raiseTestNativeErrorCXX) { NSLog(@"RAISING A TEST EXCEPTION"); funcAreyouSB(); }
		// METHOD TO INITIALIZE THE EXCEPTION HANDLER AND SET THE JS CALLBACK BLOCK
RCT_EXPORT_METHOD(setHandlerforNativeException:(RCTResponseSenderBlock)callback)
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
    //signal(SIGPIPE, SignalHandler);
    //Removing SIGPIPE as per https://github.com/master-atul/react-native-exception-handler/issues/32
    NSLog(@"REGISTERED RN EXCEPTION HANDLER");
}


// =====================================================
// METHODS TO CUSTOMIZE THE DEFAULT NATIVE ERROR HANDLER
// =====================================================

+ (void) replaceNativeExceptionHandlerBlock:(void (^)(NSException *exception, NSString *readeableException))nativeCallbackBlock{
    NSLog(@"SET THE CALLBACK HANDLER NATTTIVEEE");
    nativeErrorCallbackBlock = nativeCallbackBlock;
}

+ (void) releaseExceptionHold {
    dismissApp = true;
    NSLog(@"RELEASING LOCKED RN EXCEPTION HANDLER");
}


// ================================================================
// ACTUAL CUSTOM HANDLER called by the EXCEPTION AND SIGNAL HANDLER
// WHICH KEEPS THE APP RUNNING ON EXCEPTION
// ================================================================

- (void)handleException:(NSException *)exception
{
    NSString * readeableError = [NSString stringWithFormat:NSLocalizedString(@"%@\n%@", nil),
                                 [exception reason],
                                 [[exception userInfo] objectForKey:RNUncaughtExceptionHandlerAddressesKey]];
    dismissApp = false;

    if(nativeErrorCallbackBlock != nil){
        nativeErrorCallbackBlock(exception,readeableError);
    }else{
        defaultNativeErrorCallbackBlock(exception,readeableError);
    }
    jsErrorCallbackBlock(exception,readeableError);

    CFRunLoopRef runLoop = CFRunLoopGetCurrent();
    CFArrayRef allModes = CFRunLoopCopyAllModes(runLoop);
    while (!dismissApp)
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

    kill(getpid(), [[[exception userInfo] objectForKey:RNUncaughtExceptionHandlerSignalKey] intValue]);

}


// ============================================================================
// EXCEPTION AND SIGNAL HANDLERS to collect error and launch the custom handler
// ============================================================================

void HandleException(NSException *exception)
{
    int32_t exceptionCount = OSAtomicIncrement32(&RNUncaughtExceptionCount);
    if (exceptionCount > RNUncaughtExceptionMaximum)
    {
        return;
    }

    NSArray *callStack = [ReactNativeExceptionHandler backtrace];
    NSMutableDictionary *userInfo =
    [NSMutableDictionary dictionaryWithDictionary:[exception userInfo]];
    [userInfo
     setObject:callStack
     forKey:RNUncaughtExceptionHandlerAddressesKey];

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
    int32_t exceptionCount = OSAtomicIncrement32(&RNUncaughtExceptionCount);
    if (exceptionCount > RNUncaughtExceptionMaximum)
    {
        return;
    }

    NSMutableDictionary *userInfo =
    [NSMutableDictionary
     dictionaryWithObject:[NSNumber numberWithInt:signal]
     forKey:RNUncaughtExceptionHandlerSignalKey];

    NSArray *callStack = [ReactNativeExceptionHandler backtrace];
    [userInfo
     setObject:callStack
     forKey:RNUncaughtExceptionHandlerAddressesKey];

    [[[ReactNativeExceptionHandler alloc] init]
     performSelectorOnMainThread:@selector(handleException:)
     withObject:
     [NSException
      exceptionWithName:RNUncaughtExceptionHandlerSignalExceptionName
      reason:
      [NSString stringWithFormat:
       NSLocalizedString(@"Signal %d was raised.", nil),
       signal]
      userInfo:userInfo]
     waitUntilDone:YES];
}


// ====================================
// UTILITY METHOD TO GET THE BACKTRACE
// ====================================

+ (NSArray *)backtrace
{
    void* callstack[128];
    int frames = backtrace(callstack, 128);
    char **strs = backtrace_symbols(callstack, frames);

    int i;
    NSMutableArray *backtrace = [NSMutableArray arrayWithCapacity:frames];
    
    long header=0,slide=0;
    getSlide(&header, &slide);
    [backtrace addObject:[NSString stringWithFormat:@"slideheader: 0x%X",header]];
    for (
         i = RNUncaughtExceptionHandlerSkipAddressCount;
         i < RNUncaughtExceptionHandlerSkipAddressCount +
         RNUncaughtExceptionHandlerReportAddressCount;
         i++)
    {
        [backtrace addObject:[NSString stringWithUTF8String:strs[i]]];
    }
    free(strs);

    return backtrace;
}

@end
