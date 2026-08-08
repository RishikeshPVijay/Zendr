import { z } from 'zod';
import { PeerSchema } from '../../peer/index.js';
import { BaseMessageSchema } from '../base/index.js';

const CandidateSchema = z.object({
  candidate: z.string(),
  sdpMid: z.string().nullable(),
  sdpMLineIndex: z.number().nullable(),
  usernameFragment: z.string().nullable(),
});

export const ClientIceCandidateMessageSchema = BaseMessageSchema.extend({
  type: z.literal('signaling:ice-candidate'),
  targetPeerId: PeerSchema.shape.id,
  candidate: CandidateSchema,
});

export const ForwardedIceCandidateMessageSchema = BaseMessageSchema.extend({
  type: z.literal('signaling:ice-candidate'),
  sourcePeerId: PeerSchema.shape.id,
  candidate: CandidateSchema,
});

export type ClientIceCandidateMessage = z.infer<typeof ClientIceCandidateMessageSchema>;

export type ForwardedIceCandidateMessage = z.infer<typeof ForwardedIceCandidateMessageSchema>;

export type Candidate = z.infer<typeof CandidateSchema>;
