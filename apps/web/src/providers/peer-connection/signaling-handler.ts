import { ForwardedSignalingMessageSchema, type BaseMessage } from '@zendr/protocol';
import type { PeerConnectionManager } from './peer-connection-manager';

export class SignalingHandler {
  private readonly manager: PeerConnectionManager;

  constructor(peerConnectionManager: PeerConnectionManager) {
    this.manager = peerConnectionManager;
  }

  async handle(message: BaseMessage): Promise<boolean> {
    const { success, data } = ForwardedSignalingMessageSchema.safeParse(message);

    if (!success) {
      return false;
    }

    try {
      switch (data.type) {
        case 'signaling:offer':
          await this.manager.handleOffer(data);
          break;
        case 'signaling:answer':
          await this.manager.handleAnswer(data);
          break;
        case 'signaling:ice-candidate':
          await this.manager.handleIceCandidate(data);
          break;
      }
    } catch (err) {
      console.error(err);
    }

    return true;
  }
}
