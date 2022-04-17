
import AsyncStorage from '@react-native-async-storage/async-storage';

// should listen to netinfo, but its not working
const isOnline = true;

const sendToAPI =  async (url, error) => {
  try {
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message: error}),
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
  var existing = AsyncStorage.getItem('@error_logs');
  existing = existing ? existing.split(',') : [];
  existing.push(error);
  await AsyncStorage.setItem('@error_logs', existing.toString());
};

export const sendLog = async (url, error) => {
  if (isOnline) {
    sendToAPI(url, error);
  } else {
    saveToLocalStorage();
  }
};

