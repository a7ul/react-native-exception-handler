import { NativeModules, Platform } from "react-native";

const { ReactNativeExceptionHandler } = NativeModules;

const noop = () => { };

export const setJSExceptionHandler = (customHandler = noop, allowedInDevMode = false) => {
  if (typeof allowedInDevMode !== "boolean" || typeof customHandler !== "function") {
    console.log("setJSExceptionHandler is called with wrong argument types.. first argument should be callback function and second argument is optional should be a boolean");
    console.log("Not setting the JS handler .. please fix setJSExceptionHandler call");
    return;
  }
  const allowed = allowedInDevMode ? true : !__DEV__;
  if (allowed) {
    global.ErrorUtils.setGlobalHandler(customHandler);
    const consoleError = console.error;
    console.error = (...args) => {
      global.ErrorUtils.reportError(...args);
      consoleError(...args);
    };
  } else {
    console.log("Skipping setJSExceptionHandler: Reason: In DEV mode and allowedInDevMode = false");
  }
};

export const getJSExceptionHandler = () => global.ErrorUtils.getGlobalHandler();

export const setNativeExceptionHandler = (customErrorHandler = noop, forceApplicationToQuit = true, executeDefaultHandler = false) => {
  if (typeof customErrorHandler !== "function" || typeof forceApplicationToQuit !== "boolean") {
    console.log("setNativeExceptionHandler is called with wrong argument types.. first argument should be callback function and second argument is optional should be a boolean");
    console.log("Not setting the native handler .. please fix setNativeExceptionHandler call");
    return;
  }
  if (Platform.OS === "ios") {
    ReactNativeExceptionHandler.setHandlerforNativeException(executeDefaultHandler, customErrorHandler);
  } else {
    ReactNativeExceptionHandler.setHandlerforNativeException(executeDefaultHandler, forceApplicationToQuit, customErrorHandler);
  }
};

export default {
  setJSExceptionHandler,
  getJSExceptionHandler,
  setNativeExceptionHandler
};
