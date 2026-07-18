import { z } from 'zod';

export const PeerSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  deviceType: z.enum(['desktop', 'mobile', 'tablet', 'tv']),
  os: z.enum(['Android', 'Linux', 'Unknown', 'Windows', 'iOS', 'macOS']),
  browser: z.enum(['Chrome', 'Edge', 'Firefox', 'Opera', 'Safari', 'Unknown']),
});

export type Peer = z.infer<typeof PeerSchema>;
