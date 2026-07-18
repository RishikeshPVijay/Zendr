import type { BaseMessage } from '@zendr/protocol';
import { createContext, useContext } from 'react';

type WebSocketContextValue = {
  connected: boolean;
  send(message: BaseMessage): void;
  addMessageHandler: (handler: (message: BaseMessage) => void) => VoidFunction;
};

export const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);

  if (context === null) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }

  return context;
};
