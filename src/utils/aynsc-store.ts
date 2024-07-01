import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('media_ids', jsonValue);
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
      throw new Error('Failed to save data');
    }
  };
  