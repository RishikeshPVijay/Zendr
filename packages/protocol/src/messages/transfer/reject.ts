import { z } from 'zod';
import { BaseMessageSchema } from '../base/index.js';

export const TransferRejectMessageSchema = BaseMessageSchema.extend({
  type: z.literal('transfer:reject'),
  requestId: z.uuid(),
});

export type TransferRejectMessage = z.infer<typeof TransferRejectMessageSchema>;
