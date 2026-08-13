import { z } from 'zod';
import { TransferAcceptMessageSchema } from './accept.js';
import { TransferRejectMessageSchema } from './reject.js';
import { TransferRequestMessageSchema } from './request.js';

export const TransferMessageSchema = z.discriminatedUnion('type', [
  TransferAcceptMessageSchema,
  TransferRejectMessageSchema,
  TransferRequestMessageSchema,
]);

export type TransferMessage = z.infer<typeof TransferMessageSchema>;
