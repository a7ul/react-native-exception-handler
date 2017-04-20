import errorHandler from './errorHandler';

export const handleExceptions = (allowedInDevMode = false) => {
  registerErrorHandler(errorHandler, allowedInDevMode);
};

export const registerErrorHandler = (customHandler, allowedInDevMode = false) => {
  const allowed = allowedInDevMode ? true : !__DEV__;
  if (allowed) {
    if (customHandler) {
      global.ErrorUtils.setGlobalHandler(customHandler);
    } else {
      console.log('Custom Error Handler not passed to registerErrorHandler');
    }
  } else {
    console.log('Not registering the error handler since its in dev mode and allowedInDevMode is not true');
  }
};
