import { TransferMessageSchema, type BaseMessage, type Peer } from '@zendr/protocol';
import type { TransferManager } from './transfer-manager';

export class TransferHandler {
  private readonly manager: TransferManager;

  constructor(transferManager: TransferManager) {
    this.manager = transferManager;
  }

  async handle(peerId: Peer['id'], message: BaseMessage): Promise<boolean> {
    const { success, data } = TransferMessageSchema.safeParse(message);

    if (!success) {
      return false;
    }

    try {
      switch (data.type) {
        case 'transfer:request': {
          this.manager.handleIncomingRequest(peerId, data);
          break;
        }
        case 'transfer:accept': {
          this.manager.handleAccept(peerId, data.id);
          break;
        }
        case 'transfer:reject': {
          this.manager.handleReject(peerId, data.id);
          break;
        }
      }
    } catch (err) {
      console.error(err);
    }

    return true;
  }
}
