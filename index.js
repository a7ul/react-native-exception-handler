import React, {useEffect} from 'react';

import {Alert, View} from 'react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from './src/error-handler';
import {defaultTitle} from 'crashy/src/config';
import {sendLog} from '../../api/send-error';

const Crashy = ({children, options}) => {

  useEffect(() => {
    initCrashy();
  }, []);

  const errorHandler = (e, isFatal) => {
    const {errorTitle, errorMessage} =  options;
    let errString = JSON.stringify(e, Object.getOwnPropertyNames(e));
    // later, can pass custom component instead of alert
    // alert message
    if (isFatal) {
      Alert.alert(
        errorTitle ? errorTitle : defaultTitle,
        errorMessage ? errorMessage : errString,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
      );
      sendLog(options.apiUrl, errString);

    } else {
      console.log(e); // So that we can see it in the ADB logs in case of Android if needed
    }
  };

  const initCrashy = () => {
    setNativeExceptionHandler(() => {}, false);
    setJSExceptionHandler(errorHandler, true);
  };
  return (
    <View>
      {children}
    </View>
  );
};

export default Crashy;
   