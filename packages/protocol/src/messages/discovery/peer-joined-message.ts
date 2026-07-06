import { z } from 'zod';
import { PeerSchema } from '../../peer/index.js';
import { BaseMessageSchema } from '../base/index.js';

export const PeerJoinedMessageSchema = BaseMessageSchema.extend({
  type: z.literal('discovery:joined'),
  peer: PeerSchema,
});

export type PeerJoinedMessage = z.infer<typeof PeerJoinedMessageSchema>;
