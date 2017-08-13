
package com.masteratul.exceptionhandler;
import android.app.Activity;
import android.content.Intent;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class ReactNativeExceptionHandlerModule extends ReactContextBaseJavaModule {

  private ReactApplicationContext reactContext;
    private Activity activity;
    private String errorIntentActionName = "com.exceptionhandler.defaultErrorScreen";
    private Callback callbackHolder;

    public ReactNativeExceptionHandlerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "ReactNativeExceptionHandler";
  }

  @ReactMethod
  public void setTargetErrorScreenIntentAction(String intentActionName){
    errorIntentActionName = intentActionName;
  }

  @ReactMethod
  public void setAndroidNativeExceptionHandler(Callback customHandler){
      callbackHolder = customHandler;
      Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
          @Override
          public void uncaughtException(Thread thread, Throwable throwable) {
              activity = getCurrentActivity();
              String stackTraceString = Log.getStackTraceString(throwable);
              callbackHolder.invoke(stackTraceString);
              Log.d("ERROR",stackTraceString);
              Intent i = new Intent();
              i.setAction(errorIntentActionName);
              i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
              activity.startActivity(i);
              System.exit(0);
          }
      });
  }
}
