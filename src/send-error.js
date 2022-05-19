import {getItem, setItem} from './utils/local-storage';

const sendToAPI =  async (url, error, custInfo, deviceInfo) => {
  try {
    let body = {
      message: error,
      deviceInfo,
      custInfo 
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
    console.log(JSON.stringify(body));
    console.log('error sent', content);
    console.log('====================================');
    return content;
  } catch (err) {
    saveToLocalStorage(error, deviceInfo, custInfo);
    throw error;
  }
};


const saveToLocalStorage = async (error, deviceInfo, custInfo) => {
  var existing =  await getItem('@error_logs');
  existing = existing ? JSON.parse(existing) : [];
  console.log('existing ->', existing);
  if (error) {
    existing.push({error, deviceInfo, custInfo});
    await setItem('@error_logs', JSON.stringify(existing));
  }
};

export const sendLog = async (url, error, custInfo, dvcInfo) => {
  try {
    await sendToAPI(url, error, custInfo, dvcInfo);
  } catch (err) {
    console.log(err);
  }
};

