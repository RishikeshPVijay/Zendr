import {
  ClientSignalingMessageSchema,
  ForwardedSignalingMessage,
  type BaseMessage,
} from '@zendr/protocol';
import { logger } from '../logger.js';
import type { MessageHandler } from '../messaging/message-handler.js';
import { ProtocolError } from '../messaging/protocol-error.js';
import type { PeerRegistry } from '../peer/peer-registry.js';
import type { ClientSession } from '../session/client-session.js';

export class SignalingHandler implements MessageHandler {
  namespace = 'signaling';

  constructor(private readonly peerRegistry: PeerRegistry) {}

  handle(session: ClientSession, message: BaseMessage): void {
    const { success, data } = ClientSignalingMessageSchema.safeParse(message);

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

        const sourcePeer = this.peerRegistry.getBySessionId(session.id);

        if (!sourcePeer) {
          logger.info({ message: data }, 'Dropping signaling message for unknown source peer');
          return;
        }
        logger.info({
          type: data.type,
          source: sourcePeer.peer.id,
          target: data.targetPeerId,
        });

        const forwardedMessage: ForwardedSignalingMessage = {
          sourcePeerId: sourcePeer.peer.id,
          ...data,
        };

        return peer.session.send(forwardedMessage);
      }

      default:
        throw new ProtocolError('Unhandled signaling protocol');
    }
  }
}
