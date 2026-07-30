import Constants from 'expo-constants';

// Automatically detect the host IP address running Expo Metro bundler
const debuggerHost = Constants.expoConfig?.hostUri;
const localIp = debuggerHost ? debuggerHost.split(':')[0] : '10.119.41.134';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${localIp}:3000/api`;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-email',
    REFRESH_TOKEN: '/auth/refresh',
  },
  INHERITANCE: {
    CALCULATE: '/inheritance/calculate',
    HISTORY: '/inheritance/history',
  },
  ZAKAT: {
    CALCULATE: '/zakat/calculate',
    HISTORY: '/zakat/history',
  },
  AI: {
    CHAT: '/ai/chat',
  },
  USER: {
    PROFILE: '/auth/profile',
    UPDATE: '/auth/profile',
  }
};
