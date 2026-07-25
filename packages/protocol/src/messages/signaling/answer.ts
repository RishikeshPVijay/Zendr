import { z } from 'zod';
import { PeerSchema } from '../../peer/index.js';
import { BaseMessageSchema } from '../base/index.js';

export const AnswerMessageSchema = BaseMessageSchema.extend({
  type: z.literal('signaling:answer'),
  targetPeerId: PeerSchema.shape.id,
  sdp: z.string(),
});

export type AnswerMessage = z.infer<typeof AnswerMessageSchema>;
