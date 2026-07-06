import type { Peer } from '@zendr/protocol';

type PeerId = Peer['id'];

export class PeerRegistry {
  private readonly registry = new Map<PeerId, Peer>();

  register(peer: Peer): boolean {
    if (this.registry.has(peer.id)) {
      return false;
    }

    this.registry.set(peer.id, peer);
    return true;
  }

  get(id: PeerId): Peer | undefined {
    return this.registry.get(id);
  }

  remove(id: PeerId): Peer | undefined {
    const peer = this.get(id);

    if (!peer) {
      return;
    }

    this.registry.delete(id);

    return peer;
  }

  getAll(): Peer[] {
    return Array.from(this.registry.values());
  }
}
