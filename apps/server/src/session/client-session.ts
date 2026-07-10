import { BaseMessage } from '@zendr/protocol';

export interface ClientSession {
  readonly id: string;

  send(message: BaseMessage): void;
}
