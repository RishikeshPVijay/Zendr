import type { BaseMessage } from '@zendr/protocol';
import type { ClientSession } from '../session/client-session.js';

export interface MessageHandler {
  readonly namespace: string;

  handle(session: ClientSession, message: BaseMessage): void;
}
