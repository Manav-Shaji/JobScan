import { z } from 'zod';

export const scanSchema = z.object({
  jobDescription: z.string().optional(),
  posterBase64: z.string().optional(),
  posterMimeType: z.string().optional(),
}).refine(data => {
  const hasText = data.jobDescription && data.jobDescription.trim().length >= 10;
  const hasPoster = !!data.posterBase64;
  return hasText || hasPoster;
}, {
  message: "Either job description text (min 10 chars) or a poster image must be provided",
  path: ["jobDescription"],
});
