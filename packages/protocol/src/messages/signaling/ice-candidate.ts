import { z } from 'zod';
import { PeerSchema } from '../../peer/index.js';
import { BaseMessageSchema } from '../base/index.js';

export const IceCandidateMessageSchema = BaseMessageSchema.extend({
  type: z.literal('signaling:ice-candidate'),
  targetPeerId: PeerSchema.shape.id,
  candidate: z.string(),
});

export type IceCandidateMessage = z.infer<typeof IceCandidateMessageSchema>;
