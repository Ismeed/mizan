import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const secureStorage = {
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  getItem: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  }
};

export const storage = {
  setItem: async (key: string, value: any) => {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  },
  getItem: async (key: string) => {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  },
  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key);
  }
};
