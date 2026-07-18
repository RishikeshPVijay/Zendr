import type { Peer } from '@zendr/protocol';

export class PeerRegistry {
  private readonly peers = new Map<Peer['id'], Peer>();
  private readonly listeners = new Set<VoidFunction>();
  private snapshot: Peer[] = [];

  subscribe = (listener: VoidFunction) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => {
    return this.snapshot;
  };

  private updateSnapshotAndNotify() {
    this.snapshot = [...this.peers.values()];
    this.listeners.forEach((listener) => listener());
  }

  add(peer: Peer) {
    this.peers.set(peer.id, peer);
    this.updateSnapshotAndNotify();
  }

  remove(peerId: Peer['id']) {
    this.peers.delete(peerId);
    this.updateSnapshotAndNotify();
  }

  replace(peers: Peer[]) {
    this.peers.clear();

    for (const peer of peers) {
      this.peers.set(peer.id, peer);
    }

    this.updateSnapshotAndNotify();
  }
}
