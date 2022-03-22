import {Alert} from 'react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from './src/error-handler';
import {sendLog} from './src/send-error';

let apiUrl;

const errorHandler = (e, isFatal) => {
  let errString = JSON.stringify(e, Object.getOwnPropertyNames(e));
  // alert message
  if (isFatal) {
    Alert.alert('ERROR TITLE', errString, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    sendLog(apiUrl, errString);
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

export default {
  init ({apiLogUrl}) {
    apiUrl = apiLogUrl;
    console.log('init exception handler ...');
    setNativeExceptionHandler(() => {}, false);
    setJSExceptionHandler(errorHandler, true);
  },
};
