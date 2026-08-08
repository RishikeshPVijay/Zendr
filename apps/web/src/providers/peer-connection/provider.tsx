import type { Peer } from '@zendr/protocol';
import type React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useWebSocket } from '../websocket';
import { PeerConnectionContext } from './context';
import { PeerConnectionManager } from './peer-connection-manager';
import { SignalingHandler } from './signaling-handler';

export const PeerConnectionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { send, addMessageHandler } = useWebSocket();
  const manager = useMemo(() => new PeerConnectionManager(send), [send]);
  const handler = useMemo(() => new SignalingHandler(manager), [manager]);
  const connect = useCallback((peerId: Peer['id']) => manager.connect(peerId), [manager]);
  const disconnect = useCallback((peerId: Peer['id']) => manager.disconnect(peerId), [manager]);

  useEffect(() => {
    return addMessageHandler((message) => handler.handle(message));
  }, [addMessageHandler, handler]);

  return (
    <PeerConnectionContext
      value={{
        connect,
        disconnect,
        onStateChange(peerId, listener) {
          return manager.onStateChange(peerId, listener);
        },
      }}
    >
      {children}
    </PeerConnectionContext>
  );
};
