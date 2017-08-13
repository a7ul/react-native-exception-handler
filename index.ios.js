
import {NativeModules} from 'react-native';

const {ReactNativeExceptionHandler} = NativeModules;

const noop = () => {};

export const setJSExceptionHandler = (customHandler = noop, allowedInDevMode = false) => {
  const allowed = allowedInDevMode ? true : !__DEV__;
  if (allowed) {
    global.ErrorUtils.setGlobalHandler(customHandler);
  } else {
    console.log('Skipping setJSExceptionHandler: Reason: In DEV mode and allowedInDevMode = false');
  }
};

export const getJSExceptionHandler = () => global.ErrorUtils.getGlobalHandler();

export const ReactNativeExceptionHandlerModule = ReactNativeExceptionHandler;


export const setNativeExceptionHandler = (customErrorHandler = noop) => {
  if (typeof customErrorHandler !== 'function') {
    customErrorHandler = noop;
  }
  ReactNativeExceptionHandler.setiOSNativeExceptionHandler(customErrorHandler);
};

export default {
  setJSExceptionHandler,
  getJSExceptionHandler,
  setNativeExceptionHandler
};
