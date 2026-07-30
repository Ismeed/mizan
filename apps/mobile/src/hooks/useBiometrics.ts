import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useEffect } from 'react';

export const useBiometrics = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    checkSupport();
  }, []);

  const checkSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsSupported(compatible);
    
    if (compatible) {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsEnrolled(enrolled);
    }
  };

  const authenticate = async (promptMessage = 'Authenticate to continue'): Promise<boolean> => {
    if (!isSupported || !isEnrolled) return false;
    
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use Passcode',
      });
      return result.success;
    } catch (error) {
      console.error('Biometric auth failed:', error);
      return false;
    }
  };

  return {
    isSupported,
    isEnrolled,
    authenticate,
  };
};
