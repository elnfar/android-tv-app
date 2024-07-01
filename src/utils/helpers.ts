import DeviceInfo from 'react-native-device-info';
import { getUniqueId } from 'react-native-device-info';


export const isImage = (type) => {
    return type.startsWith('image/');
};

export const isVideo = (type) => {
    return type.startsWith('video/');
};

export const getPublicUrl = (nhostClient, fileId) => {
    return nhostClient.storage.getPublicUrl({ fileId });
};


export default async function fetchUniqueId() {
    try {
      const uniqueId = await getUniqueId();
      console.log('Unique ID:', uniqueId);
      // Further logic with uniqueId
    } catch (error) {
      console.error('Error fetching unique ID:', error);
    }
}
  