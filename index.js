import React, {useEffect} from 'react';

import {Alert, View} from 'react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from './src/error-handler';
import {defaultTitle} from './src/config';
import {sendLog} from './src/send-error';
import {checkIfItemExist} from './src/utils/shared';
import {clear} from './src/utils/local-storage';

const Crashy = ({children, options}) => {
  const {errorTitle, apiUrl, errorMessage, customerId, deviceInfo} = options;

  useEffect(() => {
    initCrashy();
  }, []);

  const errorHandler = (e, isFatal) => {
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
      sendLog(apiUrl, errString, customerId, deviceInfo);
    } else {
      console.log(e); // So that we can see it in the ADB logs in case of Android if needed
    }
  };

  const checkLocalData = async () => {
    let data =  await checkIfItemExist('@error_logs');
    if (data) {
      await sendLog(apiUrl, JSON.parse(data), customerId, deviceInfo);
      clear();

    }
  };

  const initCrashy = () => {
    // clear();
    setNativeExceptionHandler(() => {}, false);
    setJSExceptionHandler(errorHandler, true);
    checkLocalData();
    
  };
  return <View>{children}</View>;
};

export default Crashy;
