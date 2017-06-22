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
import {setJSExceptionHandler} from 'react-native-exception-handler';

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
or

setJSExceptionHandler(errorHandler, true, true); //Third argument allows adding it
                                              //as a new handler, but keeping the previous one
                                              //(it will run errorHandler but still show the red screen) [Will be present in next release]
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

## NOTES
1. This module only helps in catching the runtime errors in JS. Native errors can still crash your app without any prompt.
