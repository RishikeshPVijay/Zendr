import { BaseMessageSchema } from '@zendr/protocol';
import type { RawData } from 'ws';
import type { ClientSession } from '../session/client-session.js';
import type { MessageHandler } from './message-handler.js';
import { ProtocolError } from './protocol-error.js';

export class MessageRouter {
  private readonly handlers: Map<string, MessageHandler>;

  constructor(messageHandlers: readonly MessageHandler[]) {
    this.handlers = new Map(messageHandlers.map((handler) => [handler.namespace, handler]));
  }

  route(session: ClientSession, message: RawData): void {
    let json;
    try {
      json = JSON.parse(message.toString());
    } catch (err) {
      throw new ProtocolError('Invalid JSON', { cause: err });
    }

    const parseResult = BaseMessageSchema.safeParse(json);

    if (!parseResult.success) {
      throw new ProtocolError('Invalid message');
    }

    const namespace = parseResult.data.type.split(':', 1)[0];

    if (!namespace) {
      throw new ProtocolError('Unknown message namespace');
    }

    const handler = this.handlers.get(namespace);

    if (!handler) {
      throw new ProtocolError(`Unsupported namespace: ${namespace}`);
    }

    handler.handle(session, parseResult.data);
  }
}
