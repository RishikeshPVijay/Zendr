import type { BaseMessage } from '@zendr/protocol';

export class WebSocketClient {
  private socket?: WebSocket;
  private readonly openListeners = new Set<VoidFunction>();
  private readonly closeListeners = new Set<VoidFunction>();
  private readonly messageListeners = new Set<(message: BaseMessage) => void>();

  connect(url: string) {
    if (
      this.socket?.readyState === WebSocket.OPEN ||
      this.socket?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    this.socket = new WebSocket(url);

    this.socket.addEventListener('open', () => {
      this.openListeners.forEach((listener) => listener());
    });
    this.socket.addEventListener('close', () => {
      this.closeListeners.forEach((listener) => listener());
    });
    this.socket.addEventListener('message', (e: MessageEvent) => {
      let message;
      try {
        message = JSON.parse(e.data);
      } catch (err) {
        throw new Error('Invalid JSON', { cause: err });
      }

      this.messageListeners.forEach((listener) => listener(message));
    });
  }

  disconnect() {
    if (
      this.socket?.readyState === WebSocket.CLOSED ||
      this.socket?.readyState === WebSocket.CLOSING
    ) {
      return;
    }

    this.socket?.close();
  }

  send(message: BaseMessage) {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    this.socket.send(JSON.stringify(message));
  }

  onOpen(listener: VoidFunction) {
    this.openListeners.add(listener);
    return () => this.openListeners.delete(listener);
  }

  onClose(listener: VoidFunction) {
    this.closeListeners.add(listener);
    return () => this.closeListeners.delete(listener);
  }

  onMessage(listener: (message: BaseMessage) => void) {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }
}
