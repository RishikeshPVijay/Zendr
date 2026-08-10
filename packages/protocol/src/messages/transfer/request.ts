import { z } from 'zod';
import { BaseMessageSchema } from '../base/index.js';
import { FileMetadataSchema } from './file-metadata.js';

export const TransferRequestMessageSchema = BaseMessageSchema.extend({
  type: z.literal('transfer:request'),
  requestId: z.uuid(),
  files: z.array(FileMetadataSchema),
});

export type TransferRequestMessage = z.infer<typeof TransferRequestMessageSchema>;
