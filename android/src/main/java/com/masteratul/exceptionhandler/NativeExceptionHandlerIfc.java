package com.masteratul.exceptionhandler;

public interface NativeExceptionHandlerIfc {
    void handleNativeException(Thread thread, Throwable throwable, Thread.UncaughtExceptionHandler originalHandler);
}
