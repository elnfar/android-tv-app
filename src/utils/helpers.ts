import DeviceInfo from 'react-native-device-info';

export const fetchUniqueId = async () => {
    const id = await DeviceInfo.getUniqueId();
    return id;
};

export const isImage = (type) => {
    return type.startsWith('image/');
};

export const isVideo = (type) => {
    return type.startsWith('video/');
};

export const getPublicUrl = (nhostClient, fileId) => {
    return nhostClient.storage.getPublicUrl({ fileId });
};
