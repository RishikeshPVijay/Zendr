import type { Peer } from '@zendr/protocol';
import { createContext, useContext } from 'react';

export type DiscoveryContextValue = {
  peers: Peer[];
  localPeer: Peer;
};

export const DiscoveryContext = createContext<DiscoveryContextValue | null>(null);

export const useDiscovery = () => {
  const context = useContext(DiscoveryContext);

  if (!context) {
    throw new Error('useDiscovery must be used within DiscoveryProvider');
  }

  return context;
};
