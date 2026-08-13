import { z } from 'zod';
import { BaseMessageSchema } from '../base/index.js';
import { FileMetadataSchema } from './file-metadata.js';

export const TransferRequestMessageSchema = BaseMessageSchema.extend({
  type: z.literal('transfer:request'),
  id: z.uuid(),
  files: z.array(FileMetadataSchema).min(1),
  createdAt: z.number().int().nonnegative(),
});

export type TransferRequestMessage = z.infer<typeof TransferRequestMessageSchema>;
