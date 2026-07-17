import {
  DiscoveryMessageSchema,
  InitialPeerListMessage,
  PeerJoinedMessage,
  PeerLeftMessage,
  type BaseMessage,
  type RegisterMessage,
} from '@zendr/protocol';
import type { DisconnectHandler } from '../messaging/disconnect-handler.js';
import type { MessageHandler } from '../messaging/message-handler.js';
import { ProtocolError } from '../messaging/protocol-error.js';
import type { PeerConnection } from '../peer/peer-connection.js';
import { PeerRegistry } from '../peer/peer-registry.js';
import type { ClientSession } from '../session/client-session.js';

export class DiscoveryHandler implements MessageHandler, DisconnectHandler {
  namespace = 'discovery';

  constructor(private readonly peerRegistry: PeerRegistry) {}

  onDisconnect(session: ClientSession): void {
    const peerConnection = this.peerRegistry.removeBySessionId(session.id);

    if (!peerConnection) {
      return;
    }

    const peerLeftMessage: PeerLeftMessage = {
      type: 'discovery:left',
      peerId: peerConnection.peer.id,
    };

    // TODO: get peers based on discovery group
    const peerConnections = this.peerRegistry.getAll();

    for (const peerConnection of peerConnections) {
      peerConnection.session.send(peerLeftMessage);
    }
  }

  handle(session: ClientSession, message: BaseMessage): void {
    const { success, data } = DiscoveryMessageSchema.safeParse(message);

    if (!success) {
      throw new ProtocolError('Unrecognized discovery protocol');
    }

    switch (data.type) {
      case 'discovery:register':
        return this.registerPeer(session, data);
      default:
        throw new ProtocolError('Unhandled discovery protocol');
    }
  }

  private registerPeer(session: ClientSession, registerMessage: RegisterMessage): void {
    const { id, name, deviceType } = registerMessage;

    const newPeerConnection: PeerConnection = {
      peer: {
        id,
        deviceType,
        name,
      },
      session,
    };

    const isRegistered = this.peerRegistry.register(newPeerConnection);

    if (!isRegistered) {
      throw new ProtocolError('Duplicate registration');
    }

    // TODO: get peers based on discovery group
    const peerConnections = this.peerRegistry.getAll();

    const listMessage: InitialPeerListMessage = {
      type: 'discovery:list',
      peers: peerConnections.map(({ peer }) => peer),
    };

    session.send(listMessage);

    const peerJoinedMessage: PeerJoinedMessage = {
      type: 'discovery:joined',
      peer: newPeerConnection.peer,
    };

    for (const peerConnection of peerConnections) {
      if (peerConnection.peer.id !== id) {
        peerConnection.session.send(peerJoinedMessage);
      }
    }
  }
}
