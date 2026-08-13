import type {
  BaseMessage,
  FileMetadata,
  Peer,
  TransferAcceptMessage,
  TransferRejectMessage,
  TransferRequestMessage,
} from '@zendr/protocol';
import { uuidv4 } from '../../utils';
import type { Transfer } from './context';

type PeerId = Peer['id'];
type SendMessageFunction = (peerId: PeerId, message: BaseMessage) => void;
type PeerStateChangeListener = (
  peerId: PeerId,
  listener: (state: RTCPeerConnectionState) => void,
) => VoidFunction;

type TransferId = Transfer['id'];

export class TransferManager {
  private transfers = new Map<TransferId, Transfer>();
  private sendMessage: SendMessageFunction;
  private onPeerStateChange: PeerStateChangeListener;
  private requestListeners = new Set<VoidFunction>();
  private peerStateUnsubscribers = new Map<PeerId, VoidFunction>();
  private transfersSnapshot: Transfer[] = [];

  constructor(sendMessage: SendMessageFunction, onPeerStateChange: PeerStateChangeListener) {
    this.sendMessage = sendMessage;
    this.onPeerStateChange = onPeerStateChange;
  }

  private notifyListeners() {
    this.transfersSnapshot = Array.from(this.transfers.values());
    this.requestListeners.forEach((listener) => listener());
  }

  private ensurePeerStateListener(peerId: PeerId) {
    if (this.peerStateUnsubscribers.has(peerId)) {
      return;
    }

    const unsubscribe = this.onPeerStateChange(peerId, (state) => {
      switch (state) {
        case 'closed':
        case 'failed':
        case 'disconnected':
          this.handlePeerDisconnect(peerId);
      }
    });

    this.peerStateUnsubscribers.set(peerId, unsubscribe);
  }

  private removePeerStateListenerIfUnused(peerId: PeerId) {
    for (const transfer of this.transfers.values()) {
      if (transfer.peerId === peerId) {
        return;
      }
    }

    this.peerStateUnsubscribers.get(peerId)?.();
    this.peerStateUnsubscribers.delete(peerId);
  }

  private handlePeerDisconnect(peerId: PeerId) {
    let changed = false;

    for (const [id, transfer] of this.transfers) {
      if (
        transfer.peerId !== peerId ||
        (transfer.state !== 'pending' && transfer.state !== 'accepted')
      ) {
        continue;
      }

      this.transfers.set(id, { ...transfer, state: 'disconnected' });
      changed = true;
    }

    if (changed) {
      this.notifyListeners();
    }

    this.removePeerStateListenerIfUnused(peerId);
  }

  subscribeToTransfers = (listener: VoidFunction) => {
    this.requestListeners.add(listener);

    return () => {
      this.requestListeners.delete(listener);
    };
  };

  getTransfersSnapshot = () => {
    return this.transfersSnapshot;
  };

  sendRequest(peerId: PeerId, files: FileMetadata[]) {
    this.ensurePeerStateListener(peerId);

    const transferRequest: Transfer = {
      id: uuidv4(),
      direction: 'outgoing',
      state: 'pending',
      peerId,
      files,
      createdAt: Date.now(),
    };

    this.transfers.set(transferRequest.id, transferRequest);
    this.notifyListeners();

    const message: TransferRequestMessage = {
      type: 'transfer:request',
      id: transferRequest.id,
      files: transferRequest.files,
      createdAt: transferRequest.createdAt,
    };

    this.sendMessage(peerId, message);
  }

  handleIncomingRequest(peerId: PeerId, data: TransferRequestMessage) {
    this.ensurePeerStateListener(peerId);

    const { id } = data;

    this.transfers.set(id, {
      id,
      direction: 'incoming',
      state: 'pending',
      files: data.files,
      peerId,
      createdAt: data.createdAt,
    });
    this.notifyListeners();
  }

  acceptTransfer(id: TransferId) {
    const transfer = this.transfers.get(id);

    if (!transfer || transfer.state !== 'pending' || transfer.direction !== 'incoming') {
      return;
    }

    const message: TransferAcceptMessage = {
      type: 'transfer:accept',
      id,
    };

    this.transfers.set(id, { ...transfer, state: 'accepted' });
    this.notifyListeners();
    this.sendMessage(transfer.peerId, message);
  }

  rejectTransfer(id: TransferId) {
    const transfer = this.transfers.get(id);

    if (!transfer || transfer.state !== 'pending' || transfer.direction !== 'incoming') {
      return;
    }

    const message: TransferRejectMessage = {
      type: 'transfer:reject',
      id,
    };

    this.transfers.set(id, { ...transfer, state: 'rejected' });
    this.notifyListeners();
    this.sendMessage(transfer.peerId, message);

    this.removePeerStateListenerIfUnused(transfer.peerId);
  }

  handleAccept(peerId: PeerId, id: TransferId) {
    const transfer = this.transfers.get(id);

    if (
      !transfer ||
      transfer.direction !== 'outgoing' ||
      transfer.state !== 'pending' ||
      transfer.peerId !== peerId
    ) {
      return;
    }

    this.transfers.set(id, { ...transfer, state: 'accepted' });
    this.notifyListeners();
  }

  handleReject(peerId: PeerId, id: TransferId) {
    const transfer = this.transfers.get(id);

    if (
      !transfer ||
      transfer.direction !== 'outgoing' ||
      transfer.state !== 'pending' ||
      transfer.peerId !== peerId
    ) {
      return;
    }

    this.transfers.set(id, { ...transfer, state: 'rejected' });
    this.notifyListeners();

    this.removePeerStateListenerIfUnused(peerId);
  }
}
