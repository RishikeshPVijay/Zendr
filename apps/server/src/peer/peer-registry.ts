import type { Peer } from '@zendr/protocol';
import type { ClientSession } from '../session/client-session.js';
import type { PeerConnection } from './peer-connection.js';

type PeerId = Peer['id'];
type ClientSessionId = ClientSession['id'];

export class PeerRegistry {
  private readonly connectionsByPeerId = new Map<PeerId, PeerConnection>();
  private readonly peerIdBySessionId = new Map<ClientSessionId, PeerId>();

  register(peerConnection: PeerConnection): boolean {
    const { peer } = peerConnection;

    if (this.connectionsByPeerId.has(peer.id)) {
      return false;
    }

    this.connectionsByPeerId.set(peer.id, peerConnection);
    this.peerIdBySessionId.set(peerConnection.session.id, peer.id);

    return true;
  }

  getByPeerId(id: PeerId): PeerConnection | undefined {
    return this.connectionsByPeerId.get(id);
  }

  removeByPeerId(id: PeerId): PeerConnection | undefined {
    const peerConnection = this.getByPeerId(id);

    if (!peerConnection) {
      return;
    }

    this.connectionsByPeerId.delete(id);
    this.peerIdBySessionId.delete(peerConnection.session.id);

    return peerConnection;
  }

  removeBySessionId(sessionId: ClientSessionId): PeerConnection | undefined {
    const peerId = this.peerIdBySessionId.get(sessionId);

    if (!peerId) {
      return;
    }

    return this.removeByPeerId(peerId);
  }

  getAll(): PeerConnection[] {
    return Array.from(this.connectionsByPeerId.values());
  }
}
