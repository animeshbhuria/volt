import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

interface NetworkContextValue {
  isOffline: boolean;
}

const NetworkContext = createContext<NetworkContextValue>({ isOffline: false });

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isOffline }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}
