import {
  DiscoveryMessageSchema,
  type BaseMessage,
  type DiscoveryMessage,
  type Peer,
} from '@zendr/protocol';
import type { PeerRegistry } from './peer-registry';

type SendFunction = (message: DiscoveryMessage) => void;

export class DiscoveryHandler {
  private readonly peerRegistry: PeerRegistry;
  private readonly send: SendFunction;
  private readonly localPeer: Peer;

  constructor(peerRegistry: PeerRegistry, send: SendFunction, localPeer: Peer) {
    this.peerRegistry = peerRegistry;
    this.send = send;
    this.localPeer = localPeer;
  }

  register(): void {
    this.send({
      type: 'discovery:register',
      ...this.localPeer,
    });
  }

  handle(message: BaseMessage): boolean {
    const { success, data } = DiscoveryMessageSchema.safeParse(message);

    if (!success) {
      return false;
    }

    switch (data.type) {
      case 'discovery:list':
        this.peerRegistry.replace(data.peers);
        break;

      case 'discovery:joined':
        this.peerRegistry.add(data.peer);
        break;

      case 'discovery:left':
        this.peerRegistry.remove(data.peerId);
        break;
    }

    return true;
  }
}
