import { z } from 'zod';

export const reportSchema = z.object({
  scanId: z.string().uuid('Invalid scan ID format'),
  reason: z.string().min(1, 'Reason is required'),
});
