# react-native-exception-handler ![npm](https://img.shields.io/npm/dm/react-native-exception-handler.svg)

[![https://nodei.co/npm/react-native-exception-handler.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/react-native-exception-handler.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/react-native-exception-handler)

A react native module that lets you to register a global error handler that can capture fatal/non fatal uncaught exceptions.
The module helps prevent abrupt crashing of RN Apps without a graceful message to the user.

In the current scenario:

- `In DEV mode , you get a RED Screen error pointing your errors.`
- `In Bundled mode , the app just quits without any prompt !` 🙄

To tackle this we register a global error handler that could be used to for example:

1. Send bug reports to dev team when the app crashes
2. Show a creative dialog saying the user should restart the application

#### UPDATE - V2:

**V2 of this module now supports catching Unhandled Native Exceptions also along with the JS Exceptions ✌🏻🍻**
There are **NO** breaking changes. So its safe to upgrade from v1 to v2. So there is no reason not to 😉.

**V2.9**

- Adds support for executing previously set error handlers (now this module can work with other analytics modules)
- Adds an improved approach for overwriting native error handlers.
- Thanks @ [Damien Solimando](https://github.com/dsolimando)

**Example** repo can be found here:
_[https://github.com/master-atul/react-native-exception-handler-example](https://github.com/master-atul/react-native-exception-handler-example) _

### Screens

##### Without any error handling

**In DEV MODE**

<br>

<div style="text-align:center">
  <img src="https://github.com/master-atul/react-native-exception-handler/raw/master/screens/WITHOUT_DEV.gif" style="width: 50%;display: inline;">
</div>
<br>

**In BUNDLED MODE**

<br>

<div style="text-align:center">
  <img src="https://github.com/master-atul/react-native-exception-handler/raw/master/screens/WITHOUT_PROD.gif" style="width: 50%;display: inline;">
</div>
<br>

**With react-native-exception-handler in BUNDLED MODE**

<br>

<div style="text-align:center">
  <img src="https://github.com/master-atul/react-native-exception-handler/raw/master/screens/WITH_EH.gif" style="width: 50%;display: inline;">
</div>
<br>

### Installation:

`yarn add react-native-exception-handler`

or

`npm i react-native-exception-handler --save`

### Mostly automatic installation

`react-native link react-native-exception-handler`

### For react-native@0.60.0 or above

As [react-native@0.60.0](https://reactnative.dev/blog/2019/07/03/version-60) or above supports autolinking, so there is no need to run linking process.
Read more about autolinking [here](https://github.com/react-native-picker/cli/blob/master/docs/autolinking.md).

### Manual installation

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-exception-handler` and add `ReactNativeExceptionHandler.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libReactNativeExceptionHandler.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

##### Using Cocoapods

1. add `pod 'ReactNativeExceptionHandler', :podspec => '../node_modules/react-native-exception-handler/ReactNativeExceptionHandler.podspec'` to your Podfile
2. run `pod install`

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`

- Add `import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;` to the imports at the top of the file
- Add `new ReactNativeExceptionHandlerPackage()` to the list returned by the `getPackages()` method

2. Append the following lines to `android/settings.gradle`:
   ```
   include ':react-native-exception-handler'
   project(':react-native-exception-handler').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-exception-handler/android')
   ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
   ```
     compile project(':react-native-exception-handler')
   ```

### PLEASE READ BEFORE GOING TO USAGE SECTION

Lets introduce you to the type of errors in a RN app.

- Errors produced by your Javascript code (includes all your react code). We will refer to these errors as **JS_Exceptions** going forward.

- Errors produced by Native Modules. We will refer to these as **Native_Exceptions** going forward.

Unhandled exceptions leave the app in a critical state.

In case of **JS_Exceptions** you can catch these unhandled exceptions and perform tasks like show alerts or popups, do cleanup or even hit an API to inform the dev teams before closing the app.

In case of **Native_Exceptions** it becomes much worse. While you can catch these unhandled exceptions and perform tasks like cleanup or logout or even hit an API to inform the dev teams before closing the app,
you CANNOT show a JS alert box or do any UI stuff via JS code. This has to be done via the native methods provided by this module in the respective NATIVE codebase for iOS and android. The module does provide default handlers though :P. So you will get default popups incase of errors. Obviously you can customise them. See CUSTOMIZATION section.

### Usage

To catch **JS_Exceptions**

```js
import {setJSExceptionHandler, getJSExceptionHandler} from 'react-native-exception-handler';

.
.
// For most use cases:
// registering the error handler (maybe u can do this in the index.android.js or index.ios.js)
setJSExceptionHandler((error, isFatal) => {
  // This is your custom global error handler
  // You do stuff like show an error dialog
  // or hit google analytics to track crashes
  // or hit a custom api to inform the dev team.
});
//=================================================
// ADVANCED use case:
const exceptionhandler = (error, isFatal) => {
  // your error handler function
};
setJSExceptionHandler(exceptionhandler, allowInDevMode);
// - exceptionhandler is the exception handler function
// - allowInDevMode is an optional parameter is a boolean.
//   If set to true the handler to be called in place of RED screen
//   in development mode also.

// getJSExceptionHandler gives the currently set JS exception handler
const currentHandler = getJSExceptionHandler();
```

To catch **Native_Exceptions**

```js
import { setNativeExceptionHandler } from "react-native-exception-handler";

//For most use cases:
setNativeExceptionHandler((exceptionString) => {
  // This is your custom global error handler
  // You do stuff likehit google analytics to track crashes.
  // or hit a custom api to inform the dev team.
  //NOTE: alert or showing any UI change via JS
  //WILL NOT WORK in case of NATIVE ERRORS.
});
//====================================================
// ADVANCED use case:
const exceptionhandler = (exceptionString) => {
  // your exception handler code here
};
setNativeExceptionHandler(
  exceptionhandler,
  forceAppQuit,
  executeDefaultHandler
);
// - exceptionhandler is the exception handler function
// - forceAppQuit is an optional ANDROID specific parameter that defines
//    if the app should be force quit on error.  default value is true.
//    To see usecase check the common issues section.
// - executeDefaultHandler is an optional boolean (both IOS, ANDROID)
//    It executes previous exception handlers if set by some other module.
//    It will come handy when you use any other crash analytics module along with this one
//    Default value is set to false. Set to true if you are using other analytics modules.
```

It is recommended you set both the handlers.
**NOTE: `setNativeExceptionHandler` only works in bundled mode - it will show the red screen when applied to dev mode.**

**See the examples to know more**

### CUSTOMIZATION

#### Customizing **setJSExceptionHandler**.

In case of `setJSExceptionHandler` you can do everything that is possible. Hence there is not much to customize here.

```js
const errorHandler = (error, isFatal) => {
  // This is your custom global error handler
  // You do stuff like show an error dialog
  // or hit google analytics to track crashes
  // or hit a custom api to inform the dev team.
})
//Second argument is a boolean with a default value of false if unspecified.
//If set to true the handler to be called in place of RED screen
//in development mode also.
setJSExceptionHandler(errorHandler, true);
```

#### Customizing **setNativeExceptionHandler**

By default whenever a **Native_Exceptions** occurs if you have used `setNativeExceptionHandler`, **along with the callback specified** you would see a popup (this is the default native handler set by this module).

In Android and iOS you will see something like

<p align="center">
  <img src="https://github.com/master-atul/react-native-exception-handler/raw/master/screens/android_native_exception.png" width="300"/>
  <img src="https://github.com/master-atul/react-native-exception-handler/raw/master/screens/ios_native_exception.png" width="300"/>
</p>

**Modifying Android Native Exception handler (RECOMMENDED APPROACH)**

(NATIVE CODE HAS TO BE WRITTEN) _recommended that you do this in android studio_

- In the `android/app/src/main/java/[...]/MainApplication.java`

```java
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerModule;
import com.masteratul.exceptionhandler.NativeExceptionHandlerIfc
...
...
...
public class MainApplication extends Application implements ReactApplication {
...
...
  @Override
  public void onCreate() {
    ....
    ....
    ....
    ReactNativeExceptionHandlerModule.setNativeExceptionHandler(new NativeExceptionHandlerIfc() {
      @Override
      public void handleNativeException(Thread thread, Throwable throwable, Thread.UncaughtExceptionHandler originalHandler) {
        // Put your error handling code here
      }
    });//This will override the default behaviour of displaying the recover activity.
  }
```

**Modifying Android Native Exception handler UI (CUSTOM ACTIVITY APPROACH (OLD APPROACH).. LEAVING FOR BACKWARD COMPATIBILITY)**

(NATIVE CODE HAS TO BE WRITTEN) _recommended that you do this in android studio_

- Create an Empty Activity in the `android/app/src/main/java/[...]/`. For example lets say CustomErrorDialog.java
- Customize your activity to look and behave however you need it to be.
- In the `android/app/src/main/java/[...]/MainApplication.java`

```java
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerModule;
import <yourpackage>.YourCustomActivity; //This is your CustomErrorDialog.java
...
...
...
public class MainApplication extends Application implements ReactApplication {
...
...
  @Override
  public void onCreate() {
    ....
    ....
    ....
    ReactNativeExceptionHandlerModule.replaceErrorScreenActivityClass(YourCustomActivity.class); //This will replace the native error handler popup with your own custom activity.
  }
```

**Modifying iOS Native Exception handler UI** (NATIVE CODE HAS TO BE WRITTEN) _recommended that you do this in XCode_

Unlike Android, in the case of iOS, there is no way to restart the app if it has crashed. Also, during a **Native_Exceptions** the UI becomes quite unstable since the exception occured on the main UI thread. Hence, none of the click or press handlers would work either.

Keeping in mind of these, at the most we can just show the user a dialog and inform the user to reopen the app.

If you noticed the default native exception popup does exactly that. To customize the UI for the popup.

- In XCode, open the file `AppDelegate.m`

```c
#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

//Add the header file
#import "ReactNativeExceptionHandler.h"
...
...
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
...
...

[ReactNativeExceptionHandler replaceNativeExceptionHandlerBlock:^(NSException *exception, NSString *readeableException){

    // THE CODE YOU WRITE HERE WILL REPLACE THE EXISTING NATIVE POPUP THAT COMES WITH THIS MODULE.
    //We create an alert box
    UIAlertController* alert = [UIAlertController
                                alertControllerWithTitle:@"Critical error occurred"
                                message: [NSString stringWithFormat:@"%@\n%@",
                                          @"Apologies..The app will close now \nPlease restart the app\n",
                                          readeableException]
                                preferredStyle:UIAlertControllerStyleAlert];

    // We show the alert box using the rootViewController
    [rootViewController presentViewController:alert animated:YES completion:nil];

    // THIS IS THE IMPORTANT PART
    // By default when an exception is raised we will show an alert box as per our code.
    // But since our buttons wont work because our click handlers wont work.
    // to close the app or to remove the UI lockup on exception.
    // we need to call this method
    // [ReactNativeExceptionHandler releaseExceptionHold]; // to release the lock and let the app crash.

    // Hence we set a timer of 4 secs and then call the method releaseExceptionHold to quit the app after
    // 4 secs of showing the popup
    [NSTimer scheduledTimerWithTimeInterval:4.0
                                     target:[ReactNativeExceptionHandler class]
                                   selector:@selector(releaseExceptionHold)
                                   userInfo:nil
                                    repeats:NO];

    // or  you can call
    // [ReactNativeExceptionHandler releaseExceptionHold]; when you are done to release the UI lock.
  }];

...
...
...

 return YES;
}

@end
```

What is this `[ReactNativeExceptionHandler releaseExceptionHold];`?

In case of iOS we lock the UI thread after we show our popup to prevent the app from closing.
Hence once we are done showing the popup we need to close our app after some time.
But since our buttons wont work as our click handlers wont work (explained before).
To close the app or to remove the UI lockup on exception, we need to call this method
`[ReactNativeExceptionHandler releaseExceptionHold];`

Hence we set a timer of 4 secs and then call the method releaseExceptionHold to quit the app after
4 secs of showing the popup

```c
[NSTimer scheduledTimerWithTimeInterval:4.0
                                 target:[ReactNativeExceptionHandler class]
                               selector:@selector(releaseExceptionHold)
                               userInfo:nil
                                repeats:NO];
```

### Examples

##### Restart on error example

This example shows how to use this module show a graceful bug dialog to the user on crash and restart the app when the user presses ok !

```js
import {Alert} from 'react-native';
import RNRestart from 'react-native-restart';
import {setJSExceptionHandler} from 'react-native-exception-handler';

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    Alert.alert(
        'Unexpected error occurred',
        `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}

        We will need to restart the app.
        `,
      [{
        text: 'Restart',
        onPress: () => {
          RNRestart.Restart();
        }
      }]
    );
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler(errorHandler);

setNativeExceptionHandler((errorString) => {
    //You can do something like call an api to report to dev team here
    ...
    ...
   // When you call setNativeExceptionHandler, react-native-exception-handler sets a
   // Native Exception Handler popup which supports restart on error in case of android.
   // In case of iOS, it is not possible to restart the app programmatically, so we just show an error popup and close the app.
   // To customize the popup screen take a look at CUSTOMIZATION section.
});
```

#### Bug Capture to dev team example

This example shows how to use this module to send global errors to the dev team and show a graceful bug dialog to the user on crash !

```js
import { Alert } from "react-native";
import { BackAndroid } from "react-native";
import { setJSExceptionHandler } from "react-native-exception-handler";

const reporter = (error) => {
  // Logic for reporting to devs
  // Example : Log issues to github issues using github apis.
  console.log(error); // sample
};

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    reporter(e);
    Alert.alert(
      "Unexpected error occurred",
      `
        Error: ${isFatal ? "Fatal:" : ""} ${e.name} ${e.message}

        We have reported this to our team ! Please close the app and start again!
        `,
      [
        {
          text: "Close",
          onPress: () => {
            BackAndroid.exitApp();
          },
        },
      ]
    );
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler(errorHandler);

setNativeExceptionHandler((errorString) => {
  //You can do something like call an api to report to dev team here
  //example
  // fetch('http://<YOUR API TO REPORT TO DEV TEAM>?error='+errorString);
  //
});
```

_More Examples can be found in the examples folder_

- Preserving old handler (thanks to zeh)

# Known issues and fixes:

### react-native-navigation (Wix)

This is specifically occuring when you use [wix library](http://wix.github.io/react-native-navigation/) for navigation along with react-native-exception-handler. Whenever an error occurs, it will recreate the application above the crash screen.

**Fix:**

You need to set second parametera as _false_ while calling _setNativeExceptionHandler_.
The second parameter is an android specific field which stands for forceQuitOnError.
When set to false it doesnt quit the app forcefully on error. In short :

Credit goes to **Gustavo Fão Valvassori**

```js
setNativeExceptionHandler(nativeErrorCallback, false);
```

### Previously defined exception handlers are not executed anymore

A lot of frameworks (especially analytics sdk's) implement global exception handlers. In order to keep these frameworks working while using react-native-exception-hanlder, you can pass a boolean value as third argument to `setNativeExceptionHandler(..., ..., true`) what will trigger the execution of the last global handler registered.

## CONTRIBUTORS

- [Atul R](https://github.com/master-atul)
- [Zeh Fernando](https://github.com/zeh)
- [Fred Chasen](https://github.com/fchasen)
- [Christoph Jerolimov](https://github.com/jerolimov)
- [Peter Chow](https://github.com/peteroid)
- [Gustavo Fão Valvassori](https://github.com/faogustavo)
- [Alessandro Agosto](https://github.com/lexor90)
- [robinxb](https://github.com/robinxb)
- [Gant Laborde](https://github.com/GantMan)
- [Himanshu Singh](https://github.com/himanshusingh2407)
- [Paulus Esterhazy](https://github.com/pesterhazy)
- [TomMahle](https://github.com/TomMahle)
- [Sébastien Krafft](https://github.com/skrafft)
- [Mark Friedman](https://github.com/mark-friedman)
- [Damien Solimando](https://github.com/dsolimando)
- [Jens Kuhr Jørgensen](https://github.com/jenskuhrjorgensen)
- [Szabó Zsolt](https://github.com/alexovits)
- [Andrew Vyazovoy](https://github.com/Vyazovoy)
- [Pierre Segalen](https://github.com/psegalen)
- [Denis Slávik](https://github.com/slavikdenis)

## TESTING NATIVE EXCEPTIONS/ERRORS

To make sure this module works. You can generate a native exception using the module `rn-test-exception-handler`.
[https://github.com/master-atul/rn-test-exception-handler](https://github.com/master-atul/rn-test-exception-handler)

`rn-test-exception-handler` module does only one thing. It raises a **Native_Exceptions**.
This will help you to verify your customizations or functionality of this module.

Peace ! ✌🏻🍻
