import { z } from 'zod';

export const BaseMessageSchema = z.object({ type: z.string() });

export type BaseMessage = z.infer<typeof BaseMessageSchema>;
