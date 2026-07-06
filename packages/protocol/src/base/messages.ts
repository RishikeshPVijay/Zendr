import { z } from 'zod';
import { BaseMessageSchema } from './schemas.js';

export type BaseMessage = z.infer<typeof BaseMessageSchema>;
