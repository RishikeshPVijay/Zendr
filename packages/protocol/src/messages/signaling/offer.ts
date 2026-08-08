import { z } from 'zod';
import { PeerSchema } from '../../peer/index.js';
import { BaseMessageSchema } from '../base/index.js';

export const ClientOfferMessageSchema = BaseMessageSchema.extend({
  type: z.literal('signaling:offer'),
  targetPeerId: PeerSchema.shape.id,
  sdp: z.string(),
});

export const ForwardedOfferMessageSchema = BaseMessageSchema.extend({
  type: z.literal('signaling:offer'),
  sourcePeerId: PeerSchema.shape.id,
  sdp: z.string(),
});

export type ClientOfferMessage = z.infer<typeof ClientOfferMessageSchema>;

export type ForwardedOfferMessage = z.infer<typeof ForwardedOfferMessageSchema>;
