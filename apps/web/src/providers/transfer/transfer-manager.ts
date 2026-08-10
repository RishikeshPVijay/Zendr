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

type RequestId = Transfer['requestId'];

export class TransferManager {
  private transfers = new Map<RequestId, Transfer>();
  private sendMessage: SendMessageFunction;
  private requestListeners = new Set<VoidFunction>();
  private transfersSnapshot: Transfer[] = [];

  constructor(sendMessage: SendMessageFunction) {
    this.sendMessage = sendMessage;
  }

  private notifyListeners() {
    this.transfersSnapshot = Array.from(this.transfers.values());
    this.requestListeners.forEach((listener) => listener());
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
    const transferRequest: Transfer = {
      requestId: uuidv4(),
      direction: 'outgoing',
      state: 'pending',
      peerId,
      files,
      createdAt: Date.now(),
    };

    this.transfers.set(transferRequest.requestId, transferRequest);
    this.notifyListeners();

    const message: TransferRequestMessage = {
      type: 'transfer:request',
      files: transferRequest.files,
      requestId: transferRequest.requestId,
    };

    this.sendMessage(peerId, message);
  }

  handleIncomingRequest(peerId: PeerId, data: TransferRequestMessage) {
    const { requestId } = data;

    this.transfers.set(requestId, {
      requestId,
      direction: 'incoming',
      state: 'pending',
      files: data.files,
      peerId,
      createdAt: Date.now(),
    });
    this.notifyListeners();

    const isAccepted = confirm('Accept?');
    const transfer = this.transfers.get(data.requestId)!;

    if (isAccepted) {
      this.transfers.set(requestId, { ...transfer, state: 'accepted' });

      const message: TransferAcceptMessage = {
        type: 'transfer:accept',
        requestId,
      };

      this.sendMessage(peerId, message);
    } else {
      this.transfers.set(requestId, { ...transfer, state: 'rejected' });

      const message: TransferRejectMessage = {
        type: 'transfer:reject',
        requestId,
      };

      this.sendMessage(peerId, message);
    }

    this.notifyListeners();
  }

  handleAccept(requestId: RequestId) {
    const transfer = this.transfers.get(requestId);

    if (!transfer) {
      throw new Error('Tranfer not found');
    }

    this.transfers.set(requestId, { ...transfer, state: 'accepted' });
    this.notifyListeners();
  }

  handleReject(requestId: RequestId) {
    const transfer = this.transfers.get(requestId);

    if (!transfer) {
      throw new Error('Tranfer not found');
    }

    this.transfers.set(requestId, { ...transfer, state: 'rejected' });
    this.notifyListeners();
  }
}
