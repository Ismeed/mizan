import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync();
      setIsOffline(!state.isConnected || !state.isInternetReachable);
    };

    checkNetwork();
    // We would ideally set up a listener here, but expo-network polling is needed
    const interval = setInterval(checkNetwork, 10000);
    return () => clearInterval(interval);
  }, []);

  return {
    isOffline,
  };
};
