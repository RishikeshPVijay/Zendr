import { z } from 'zod';
import { PeerSchema } from '../../peer/index.js';
import { BaseMessageSchema } from '../base/index.js';

export const ClientAnswerMessageSchema = BaseMessageSchema.extend({
  type: z.literal('signaling:answer'),
  targetPeerId: PeerSchema.shape.id,
  sdp: z.string(),
});

export const ForwardedAnswerMessageSchema = BaseMessageSchema.extend({
  type: z.literal('signaling:answer'),
  sourcePeerId: PeerSchema.shape.id,
  sdp: z.string(),
});

export type ClientAnswerMessage = z.infer<typeof ClientAnswerMessageSchema>;

export type ForwardedAnswerMessage = z.infer<typeof ForwardedAnswerMessageSchema>;
