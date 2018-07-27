
package com.masteratul.exceptionhandler;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ReactNativeExceptionHandlerModule extends ReactContextBaseJavaModule {

  private ReactApplicationContext reactContext;
    private Activity activity;
    private static Class errorIntentTargetClass = DefaultErrorScreen.class;
    private static NativeExceptionHandlerIfc nativeExceptionHandler;
    private Callback callbackHolder;
    private Thread.UncaughtExceptionHandler originalHandler;

    public ReactNativeExceptionHandlerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "ReactNativeExceptionHandler";
  }


  @ReactMethod
  public void setHandlerforNativeException(
          final boolean executeOriginalUncaughtExceptionHandler,
          final boolean forceToQuit,
          Callback customHandler) {

      callbackHolder = customHandler;
      originalHandler = Thread.getDefaultUncaughtExceptionHandler();

      Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {

          @Override
          public void uncaughtException(Thread thread, Throwable throwable) {

          String stackTraceString = Log.getStackTraceString(throwable);
          callbackHolder.invoke(stackTraceString);

          if (nativeExceptionHandler != null) {
              nativeExceptionHandler.handleNativeException(thread, throwable, originalHandler);
          } else {
              activity = getCurrentActivity();

              Intent i = new Intent();
              i.setClass(activity, errorIntentTargetClass);
              i.putExtra("stack_trace_string",stackTraceString);
              i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

              activity.startActivity(i);
              activity.finish();

              if (executeOriginalUncaughtExceptionHandler && originalHandler != null) {
                  originalHandler.uncaughtException(thread, throwable);
              }

              if (forceToQuit) {
                  System.exit(0);
              }
          }
          }
      });
  }

   public static void replaceErrorScreenActivityClass(Class errorScreenActivityClass){
       errorIntentTargetClass = errorScreenActivityClass;
   }

    public static void setNativeExceptionHandler(NativeExceptionHandlerIfc nativeExceptionHandler) {
        ReactNativeExceptionHandlerModule.nativeExceptionHandler = nativeExceptionHandler;
    }
}
