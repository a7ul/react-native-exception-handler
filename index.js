import {Alert} from 'react-native';
import {setJSExceptionHandler, setNativeExceptionHandler} from './src/error-handler';
import {sendLog} from './src/send-error';
import {clear} from './src/utils/local-storage';
import {checkIfItemExist} from './src/utils/shared';

let apiUrl;
let errTitle;
let errMsg;
let custInfo;
let dvcInfo;


const checkLocalData = async () => {
  let data =  await checkIfItemExist('@error_logs');
  if (data) {
    await sendLog(apiUrl, JSON.parse(data), custInfo, dvcInfo);
    clear();

  }
};

const errorHandler = (e, isFatal) => {
  let errString = JSON.stringify(e, Object.getOwnPropertyNames(e));
  // alert message
  if (isFatal) {
    Alert.alert(errTitle, errMsg ? errMsg :  errString, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    sendLog(apiUrl, errString,  custInfo, dvcInfo);
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

export default {
  init ({apiLogUrl = '', errorTitle = '', errorMessage = '', customerInfo  = '', deviceInfo = {}}) {
    apiUrl = apiLogUrl;   
    errMsg = errorMessage;
    errTitle = errorTitle;
    custInfo = customerInfo;
    dvcInfo = deviceInfo;

    console.log('init exception handler ...');
    setNativeExceptionHandler(() => {}, false);
    setJSExceptionHandler(errorHandler, true);
    checkLocalData();
  },
};