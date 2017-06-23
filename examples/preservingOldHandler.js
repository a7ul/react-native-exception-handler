import {getJSExceptionHandler, setJSExceptionHandler} from 'react-native-exception-handler';

const customErrorHandler = (error, isFatal) => {
  // Logic for reporting to devs
  // Example : Log issues to github issues using github apis.
  console.log(error, isFatal); // example
};

const previousErrorHandler = getJSExceptionHandler(); // by default u will get the red screen error handler here

const errorHandler = (e, isFatal) => {
  customErrorHandler(e, isFatal);
  previousErrorHandler(e, isFatal);
};

// We will still see the error screen, but our customErrorHandler() function will be called
setJSExceptionHandler(errorHandler);
