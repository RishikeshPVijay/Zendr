import { z } from 'zod';
import { InitialPeerListMessageSchema } from './initial-peer-list-message.js';
import { PeerJoinedMessageSchema } from './peer-joined-message.js';
import { PeerLeftMessageSchema } from './peer-left-message.js';
import { RegisterMessageSchema } from './register-message.js';

export const DiscoveryMessageSchema = z.discriminatedUnion('type', [
  InitialPeerListMessageSchema,
  PeerJoinedMessageSchema,
  PeerLeftMessageSchema,
  RegisterMessageSchema,
]);

export type DiscoveryMessage = z.infer<typeof DiscoveryMessageSchema>;
