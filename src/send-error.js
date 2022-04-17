
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDeviceInfo} from 'crashy/src/DeviceInfo';


// should listen to netinfo, but its not working
const isOnline = false;
let customerId;
let deviceInfo;

const sendToAPI =  async (url, error) => {
  try {
    let body = {
      message: error,
      deviceInfo,
      customerId
    };
    console.log('body', body);
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const content = await rawResponse.json();
    console.log('====================================');
    console.log('error sent', content);
    console.log('====================================');
    return content;
  } catch (error) {
    throw new Error(error);
  }
};

const saveToLocalStorage = async (error) => {
  var existing = await AsyncStorage.getItem('@error_logs');
  existing = existing ? existing.split(',') : [];
  console.log('existing', existing);
  existing.push({error, deviceInfo});
  await AsyncStorage.setItem('@error_logs', existing.toString());
};

export const sendLog = async (url, error, customerID) => {
  customerId = customerID;
  deviceInfo =  await getDeviceInfo();
  if (isOnline) {
    sendToAPI(url, error);
  } else {
    saveToLocalStorage(error);
  }
};

