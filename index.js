const noop = () => {};

export const setJSExceptionHandler = (customHandler = noop, allowedInDevMode = false, keepPreviousHandler = false) => {
  const allowed = allowedInDevMode ? true : !__DEV__;
  if (allowed) {
    if (keepPreviousHandler) {
      const previousHandler = global.ErrorUtils.getGlobalHandler();
      global.ErrorUtils.setGlobalHandler((error, isFatal) => {
        customHandler(error, isFatal);
        previousHandler(error, isFatal);
      });
    } else {
      global.ErrorUtils.setGlobalHandler(customHandler);
    }
  } else {
    console.log('Skipping setJSExceptionHandler: Reason: In DEV mode and allowedInDevMode = false');
  }
};

export default {
  setJSExceptionHandler
};
