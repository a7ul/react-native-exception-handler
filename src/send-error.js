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
  } catch (err) {
    saveToLocalStorage(error);
    throw error;
  }
};


const saveToLocalStorage = async (error) => {
  var existing =  await getItem('@error_logs');
  existing = existing ? JSON.parse(existing) : [];
  console.log('existing ->', existing);
  if (error) {
    existing.push({error, deviceInfo});
    await setItem('@error_logs', JSON.stringify(existing));
  }
};

export const sendLog = async (url, error, customerID, dvcInfo) => {
  console.log('error ->', error);
  customerId = customerID;
  deviceInfo =  dvcInfo;
  try {
    await sendToAPI(url, error);
  } catch (err) {
    console.log(err);
  }
};

