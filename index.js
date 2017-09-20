
import {NativeModules} from 'react-native';

const {ReactNativeExceptionHandler} = NativeModules;

const noop = () => {};

export const setJSExceptionHandler = (customHandler = noop, allowedInDevMode = false) => {
  const allowed = allowedInDevMode ? true : !__DEV__;
  if (allowed) {
    global.ErrorUtils.setGlobalHandler(customHandler);
    console.error = (message, error) => global.ErrorUtils.reportError(error); // sending console.error so that it can be caught
  } else {
    console.log('Skipping setJSExceptionHandler: Reason: In DEV mode and allowedInDevMode = false');
  }
};

export const getJSExceptionHandler = () => global.ErrorUtils.getGlobalHandler();

export const setNativeExceptionHandler = (customErrorHandler = noop) => {
  if (typeof customErrorHandler !== 'function') {
    customErrorHandler = noop;
  }
  ReactNativeExceptionHandler.setHandlerforNativeException(customErrorHandler);
};

export default {
  setJSExceptionHandler,
  getJSExceptionHandler,
  setNativeExceptionHandler
};
