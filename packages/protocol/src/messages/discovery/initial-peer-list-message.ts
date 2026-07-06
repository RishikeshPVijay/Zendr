import { z } from 'zod';
import { PeerSchema } from '../../peer/index.js';
import { BaseMessageSchema } from '../base/index.js';

export const InitialPeerListMessageSchema = BaseMessageSchema.extend({
  type: z.literal('discovery:list'),
  peers: z.array(PeerSchema),
});

export type InitialPeerListMessage = z.infer<typeof InitialPeerListMessageSchema>;
