import {setJSExceptionHandler} from 'react-native-exception-handler';

const reporter = (error) => {
  // Logic for reporting to devs
  // Example : Log issues to github issues using github apis.
  console.log(error); // sample
};

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    reporter(e);
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

// We will still see the error screen, but our reporter() function will be called
setJSExceptionHandler(errorHandler, false, true);
