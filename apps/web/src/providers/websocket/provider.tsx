import type { BaseMessage } from '@zendr/protocol';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WebSocketClient } from './client';
import { WebSocketContext } from './context';

export const WebSocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const client = useMemo(() => new WebSocketClient(), []);
  const [connected, setConnected] = useState(false);
  const messageHandlers = useRef(new Set<(message: BaseMessage) => void>());

  useEffect(() => {
    const removeOpen = client.onOpen(() => setConnected(() => true));
    const removeClose = client.onClose(() => setConnected(() => false));
    const removeMessageListeners = client.onMessage((message) => {
      messageHandlers.current.forEach((handler) => handler(message));
    });

    client.connect(import.meta.env.VITE_WS_SERVER_URL);

    return () => {
      removeOpen();
      removeClose();
      removeMessageListeners();
      client.disconnect();
    };
  }, [client]);

  const send = useCallback(
    (message: BaseMessage) => {
      client.send(message);
    },
    [client],
  );

  const addMessageHandler = useCallback((handler: (message: BaseMessage) => void) => {
    messageHandlers.current.add(handler);
    return () => messageHandlers.current.delete(handler);
  }, []);

  return (
    <WebSocketContext
      value={{
        connected,
        send,
        addMessageHandler,
      }}
    >
      {children}
    </WebSocketContext>
  );
};
