import { z } from 'zod';
import { ClientAnswerMessageSchema, ForwardedAnswerMessageSchema } from './answer.js';
import {
  ClientIceCandidateMessageSchema,
  ForwardedIceCandidateMessageSchema,
} from './ice-candidate.js';
import { ClientOfferMessageSchema, ForwardedOfferMessageSchema } from './offer.js';

export const ClientSignalingMessageSchema = z.discriminatedUnion('type', [
  ClientOfferMessageSchema,
  ClientAnswerMessageSchema,
  ClientIceCandidateMessageSchema,
]);

export const ForwardedSignalingMessageSchema = z.discriminatedUnion('type', [
  ForwardedOfferMessageSchema,
  ForwardedAnswerMessageSchema,
  ForwardedIceCandidateMessageSchema,
]);

export type ClientSignalingMessage = z.infer<typeof ClientSignalingMessageSchema>;

export type ForwardedSignalingMessage = z.infer<typeof ForwardedSignalingMessageSchema>;
