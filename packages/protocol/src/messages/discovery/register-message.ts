import { z } from 'zod';
import { PeerSchema } from '../../peer/index.js';
import { BaseMessageSchema } from '../base/index.js';

export const RegisterMessageSchema = BaseMessageSchema.extend({
  type: z.literal('discovery:register'),
  ...PeerSchema.shape,
});

export type RegisterMessage = z.infer<typeof RegisterMessageSchema>;
