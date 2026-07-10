import type { BaseMessage } from '@zendr/protocol';
import type { ClientSession } from './client-session.js';

export interface SessionBroadcaster {
  broadcast(message: BaseMessage): void;

  broadcastExcept(session: ClientSession, message: BaseMessage): void;
}
