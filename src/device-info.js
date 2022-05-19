import {
  getDeviceId,
  getBaseOs,
  getDeviceType,
  getUniqueId,
  getVersion,
} from 'react-native-device-info';
  
export const getDeviceInfo = async () => {
  let deviceId = await getDeviceId();
  let baseOS = await getBaseOs();
  let deviceType = await getDeviceType();
  let uniqueId = await getUniqueId();
  let version =  await getVersion();
  return {
    deviceId,
    baseOS,
    deviceType,
    uniqueId,
    version
  };
};