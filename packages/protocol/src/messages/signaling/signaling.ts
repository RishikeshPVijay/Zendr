import { z } from 'zod';
import { AnswerMessageSchema } from './answer.js';
import { IceCandidateMessageSchema } from './ice-candidate.js';
import { OfferMessageSchema } from './offer.js';

export const SignalingMessageSchema = z.discriminatedUnion('type', [
  OfferMessageSchema,
  AnswerMessageSchema,
  IceCandidateMessageSchema,
]);

export type SignalingMessage = z.infer<typeof SignalingMessageSchema>;
