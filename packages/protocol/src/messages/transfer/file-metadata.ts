import { z } from 'zod';

export const FileMetadataSchema = z.object({
  name: z.string(),
  size: z.int().nonnegative(),
  type: z.string(),
});

export type FileMetadata = z.infer<typeof FileMetadataSchema>;
