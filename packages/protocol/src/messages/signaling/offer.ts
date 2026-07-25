import { z } from 'zod';
import { PeerSchema } from '../../peer/index.js';
import { BaseMessageSchema } from '../base/index.js';

export const OfferMessageSchema = BaseMessageSchema.extend({
  type: z.literal('signaling:offer'),
  targetPeerId: PeerSchema.shape.id,
  sdp: z.string(),
});

export type OfferMessage = z.infer<typeof OfferMessageSchema>;
