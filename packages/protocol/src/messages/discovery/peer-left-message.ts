import { z } from 'zod';
import { PeerSchema } from '../../peer/index.js';
import { BaseMessageSchema } from '../base/index.js';

export const PeerLeftMessageSchema = BaseMessageSchema.extend({
  type: z.literal('discovery:left'),
  peerId: PeerSchema.shape.id,
});

export type PeerLeftMessage = z.infer<typeof PeerLeftMessageSchema>;
