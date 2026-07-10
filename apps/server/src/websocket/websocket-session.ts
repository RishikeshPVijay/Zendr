import type { BaseMessage } from '@zendr/protocol';
import type { WebSocket } from 'ws';
import type { ClientSession } from '../session/client-session.js';

export class WebSocketSession implements ClientSession {
  readonly id = crypto.randomUUID();

  constructor(private readonly ws: WebSocket) {}

  send(message: BaseMessage): void {
    this.ws.send(JSON.stringify(message));
  }

  close(code?: number, reason?: string): void {
    this.ws.close(code, reason);
  }
}
