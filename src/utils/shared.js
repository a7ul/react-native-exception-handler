import {getItem} from './local-storage';


export const checkIfItemExist  = async (key) => {
  var existing =  await getItem(key);
  if (existing) {
    return existing;
  }
  return null;
};

