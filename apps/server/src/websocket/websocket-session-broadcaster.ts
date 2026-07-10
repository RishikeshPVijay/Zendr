import { BaseMessage } from '@zendr/protocol';
import type { ClientSession } from '../session/client-session.js';
import type { SessionBroadcaster } from '../session/session-broadcaster.js';
import type { WebSocketSessionRegistry } from './websocket-session-registry.js';

export class WebSocketSessionBroadcaster implements SessionBroadcaster {
  constructor(private readonly sessionRegistry: WebSocketSessionRegistry) {}

  broadcast(message: BaseMessage): void {
    for (const session of this.sessionRegistry.values()) {
      session.send(message);
    }
  }

  broadcastExcept(sender: ClientSession, message: BaseMessage): void {
    for (const session of this.sessionRegistry.values()) {
      if (session.id === sender.id) {
        continue;
      }

      session.send(message);
    }
  }
}
