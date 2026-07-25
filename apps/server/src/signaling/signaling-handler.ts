import { SignalingMessageSchema, type BaseMessage } from '@zendr/protocol';
import { logger } from '../logger.js';
import type { MessageHandler } from '../messaging/message-handler.js';
import { ProtocolError } from '../messaging/protocol-error.js';
import type { PeerRegistry } from '../peer/peer-registry.js';
import type { ClientSession } from '../session/client-session.js';

export class SignalingHandler implements MessageHandler {
  namespace = 'signaling';

  constructor(private readonly peerRegistry: PeerRegistry) {}

  handle(_session: ClientSession, message: BaseMessage): void {
    const { success, data } = SignalingMessageSchema.safeParse(message);

    if (!success) {
      throw new ProtocolError('Unrecognized signaling protocol');
    }

    switch (data.type) {
      case 'signaling:offer':
      case 'signaling:answer':
      case 'signaling:ice-candidate': {
        const peer = this.peerRegistry.getByPeerId(data.targetPeerId);

        if (!peer) {
          logger.info({ message: data }, 'Dropping signaling message for unknown peer');
          return;
        }

        return peer.session.send(data);
      }

      default:
        throw new ProtocolError('Unhandled signaling protocol');
    }
  }
}
