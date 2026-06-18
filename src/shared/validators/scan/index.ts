import { z } from 'zod';

export const scanSchema = z.object({
  jobDescription: z.string().max(10000, "Job description exceeds maximum length of 10,000 characters").optional(),
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
