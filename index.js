
import {NativeModules, Platform} from 'react-native';

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

export const setNativeExceptionHandler = (forceApplicationToQuit = true, customErrorHandler = noop) => {
  var handler = customErrorHandler;

  // backward compatible API
  if (typeof forceApplicationToQuit === 'function') {
    handler = forceApplicationToQuit;
  }

  if (typeof customErrorHandler === 'boolean') {
    forceApplicationToQuit = customErrorHandler;
  }

  customErrorHandler = handler;

  if (typeof customErrorHandler !== 'function') {
    customErrorHandler = noop;
  }
  
  if (Platform.OS === 'ios') {
    ReactNativeExceptionHandler.setHandlerforNativeException(customErrorHandler);
  } else {
    ReactNativeExceptionHandler.setHandlerforNativeException(forceApplicationToQuit, customErrorHandler);
  }
};

export default {
  setJSExceptionHandler,
  getJSExceptionHandler,
  setNativeExceptionHandler
};
