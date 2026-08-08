import type { Peer } from '@zendr/protocol';
import { createContext, useContext, useEffect, useState } from 'react';

export type PeerConnectionContextValue = {
  connect: (peerId: Peer['id']) => Promise<void>;
  disconnect: (peerId: Peer['id']) => void;
  onStateChange: (
    peerId: string,
    listener: (state: RTCPeerConnectionState) => void,
  ) => VoidFunction;
};

export const PeerConnectionContext = createContext<PeerConnectionContextValue | null>(null);

export const usePeerConnection = () => {
  const context = useContext(PeerConnectionContext);

  if (!context) {
    throw new Error('usePeerConnection must be used within PeerConnectionProvider');
  }

  return context;
};

export const usePeerConnectionState = (peerId: Peer['id']): RTCPeerConnectionState | null => {
  const { onStateChange } = usePeerConnection();
  const [state, setState] = useState<RTCPeerConnectionState | null>(null);

  useEffect(() => {
    const removeListener = onStateChange(peerId, setState);

    return () => {
      removeListener();
    };
  }, [onStateChange, peerId]);

  return state;
};
