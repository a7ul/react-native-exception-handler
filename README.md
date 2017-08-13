
# react-native-exception-handler

A react native module that lets you to register a global error handler that can capture fatal/non fatal uncaught exceptions.
The module helps prevent abrupt crashing of RN Apps without a graceful message to the user.   

In the current scenario:
  - `In DEV mode , you get a RED Screen error pointing your JS errors.`
  - `In Bundled mode , the app just quits without any prompt !` 🙄

To tackle this we register a global error handler that could be used to for example:
1. Send bug reports to dev team when the app crashes
2. Show a creative dialog saying the user should restart the application

### Installation:

```sh
yarn add react-native-exception-handler¸
```

or

```sh
npm i react-native-exception-handler --save
```


### Usage

```js
import {setJSExceptionHandler, getJSExceptionHandler} from 'react-native-exception-handler';

.
.
.

const errorHandler = (error, isFatal) => {
  // This is your custom global error handler
}

.
.
.

setJSExceptionHandler(errorHandler); // registering the error handler (maybe u can do this in the index.android.js or index.ios.js)

or

setJSExceptionHandler(errorHandler, true); //Second argument true is basically
                                        //if u need the handler to be called in place of RED  
                                        //screen in development mode also

const currentHandler = getJSExceptionHandler(); // getJSExceptionHandler gives the currently set handler
```                                     


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

**With Error handling in BUNDLED MODE**

<br>

<div style="text-align:center">
  <img src="https://github.com/master-atul/react-native-exception-handler/raw/master/screens/WITH_EH.gif" style="width: 50%;display: inline;">
</div>
<br>

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
```

#### Bug Capture to dev team example

This example shows how to use this module to send global errors to the dev team and show a graceful bug dialog to the user on crash !

```js
import {Alert} from 'react-native';
import {BackAndroid} from 'react-native';
import {setJSExceptionHandler} from 'react-native-exception-handler';

const reporter = (error) => {
  // Logic for reporting to devs
  // Example : Log issues to github issues using github apis.
  console.log(error); // sample
};

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    reporter(e);
    Alert.alert(
        'Unexpected error occurred',
        `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}

        We have reported this to our team ! Please close the app and start again!
        `,
      [{
        text: 'Close',
        onPress: () => {
          BackAndroid.exitApp();
        }
      }]
    );
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler(errorHandler);
```

*More Examples can be found in the examples folder*
- Preserving old handler (thanks to zeh)

## NOTES
1. This module only helps in catching the runtime errors in JS. Native errors can still crash your app without any prompt.


## CONTRIBUTORS
- [Atul R](https://github.com/master-atul)
- [Zeh Fernando](https://github.com/zeh)


# react-native-exception-handler

## Getting started

`$ npm install react-native-exception-handler --save`

### Mostly automatic installation

`$ react-native link react-native-exception-handler`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-exception-handler` and add `ReactNativeExceptionHandler.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libReactNativeExceptionHandler.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.master-atul.exceptionhandler.ReactNativeExceptionHandlerPackage;` to the imports at the top of the file
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


## Usage
```javascript
import ReactNativeExceptionHandler from 'react-native-exception-handler';

// TODO: What to do with the module?
ReactNativeExceptionHandler;
```

## Handling Native errors

FROM JS
```js
import {setNativeExceptionHandler} from 'react-native-exception-handler/index';

setNativeExceptionHandler((errorString) => {
  console.log('ERRROR STRINGGG', errorString);
  //alert(errorString); //NOT ALLOWED HERE - WONT WORK
});

```

### CUSTOMIZATION
FOR IOS
```c
#import "ReactNativeExceptionHandler.h"
...
...
...
[ReactNativeExceptionHandler replaceNativeExceptionHandlerBlock:^(NSException *exception, NSString *readeableException){

    UIAlertController* alert = [UIAlertController
                                alertControllerWithTitle:@"Bug Captured"
                                message: readeableException
                                preferredStyle:UIAlertControllerStyleAlert];

    [rootViewController presentViewController:alert animated:YES completion:nil];

    [NSTimer scheduledTimerWithTimeInterval:3.0
                                     target:[ReactNativeExceptionHandler class]
                                   selector:@selector(releaseExceptionHold)
                                   userInfo:nil
                                    repeats:NO];

//    [ReactNativeExceptionHandler releaseExceptionHold];
  }];
```

or

```c
[ReactNativeExceptionHandler replaceNativeExceptionHandlerBlock:^(NSException *exception, NSString *readeableException){

    UIAlertController* alert = [UIAlertController
                                alertControllerWithTitle:@"Critical error occurred"
                                message: @"We have informed our developers to look into the issue.\n Please relaunch the app to continue..."
                                preferredStyle:UIAlertControllerStyleAlert];

    [rootViewController presentViewController:alert animated:YES completion:nil];

    [NSTimer scheduledTimerWithTimeInterval:4.0
                                     target:[ReactNativeExceptionHandler class]
                                   selector:@selector(releaseExceptionHold)
                                   userInfo:nil
                                    repeats:NO];

    //    [ReactNativeExceptionHandler releaseExceptionHold];
  }];
```


For android

```java
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerModule;
import <your.package>.YourCustomActivity;
...
...
...
  @Override
  public void onCreate() {
    ....
    ....
    ....
    ReactNativeExceptionHandlerModule.replaceErrorScreenActivityClass(YourCustomActivity.class);
  }

```
