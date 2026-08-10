import { z } from 'zod';
import { BaseMessageSchema } from '../base/index.js';

export const TransferAcceptMessageSchema = BaseMessageSchema.extend({
  type: z.literal('transfer:accept'),
  requestId: z.uuid(),
});

export type TransferAcceptMessage = z.infer<typeof TransferAcceptMessageSchema>;
