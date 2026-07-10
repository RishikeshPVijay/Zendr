import type { ClientSession } from '../session/client-session.js';

export interface DisconnectHandler {
  onDisconnect(session: ClientSession): void;
}
