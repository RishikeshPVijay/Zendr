import { z } from 'zod';

export const PeerSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  deviceType: z.enum(['mobile', 'tablet', 'desktop', 'tv', 'unknown']),
});

export type Peer = z.infer<typeof PeerSchema>;
