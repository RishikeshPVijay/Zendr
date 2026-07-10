import { WebSocketSession } from './websocket-session.js';

type WebSocketSessionId = WebSocketSession['id'];

export class WebSocketSessionRegistry {
  private readonly sessions = new Map<WebSocketSessionId, WebSocketSession>();

  add(session: WebSocketSession): void {
    const existing = this.sessions.get(session.id);

    if (existing) {
      return;
    }

    this.sessions.set(session.id, session);
  }

  get(id: WebSocketSessionId): WebSocketSession | undefined {
    return this.sessions.get(id);
  }

  remove(id: WebSocketSessionId): WebSocketSession | undefined {
    const session = this.get(id);

    if (!session) {
      return;
    }

    this.sessions.delete(id);

    return session;
  }

  values(): IterableIterator<WebSocketSession> {
    return this.sessions.values();
  }
}
