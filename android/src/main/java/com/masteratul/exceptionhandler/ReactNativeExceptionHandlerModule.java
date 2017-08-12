
package com.masteratul.exceptionhandler;
import android.app.Activity;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class ReactNativeExceptionHandlerModule extends ReactContextBaseJavaModule {

  private ReactApplicationContext reactContext;
    private Activity activity;

    public ReactNativeExceptionHandlerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "ReactNativeExceptionHandler";
  }

  @ReactMethod
  public void setAndroidNativeExceptionHandler(Callback customHandler){
      activity = getCurrentActivity();
      Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
          @Override
          public void uncaughtException(Thread thread, Throwable throwable) {
              new Thread() {
                  @Override
                  public void run() {
                      Looper.prepare();
                      Toast.makeText(activity.getApplicationContext(), "Application crashed", Toast.LENGTH_LONG).show();
                      System.exit(1);
                      Looper.loop();
                  }
              }.start();

//              try
//              {
//                  Thread.sleep(4000); // Let the Toast display before app will get shutdown
//              }
//              catch (InterruptedException e)
//              {
//                  Log.d("EXCEPTION HANDLER","SLEEP interrupted");
//              }
          }
      });
  }
}
