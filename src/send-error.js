
import {getDeviceInfo} from 'crashy/src/DeviceInfo';
import {getItem, setItem} from './utils/local-storage';

let customerId;
let deviceInfo;

const sendToAPI =  async (url, error) => {
  try {
    let body = {
      message: error,
      deviceInfo,
      customerId
    };
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
    saveToLocalStorage(error);
    throw new Error(error);
  }
};


const saveToLocalStorage = async (error) => {
  var existing =  await getItem('@error_logs');
  existing = existing ? existing.split(',') : [];
  console.log('existing', existing);
  existing.push({error, deviceInfo});
  await setItem('@error_logs', existing.toString());
};

export const sendLog = async (url, error, customerID) => {
  customerId = customerID;
  deviceInfo =  await getDeviceInfo();
  sendToAPI(url, error);
};

