/**
 * ------------------------------------------------------------
 * File: validation.ts
 * 
 * Purpose:
 * Input validation for new job scan requests.
 * 
 * Responsibilities:
 * • Ensure text payload meets minimum length requirements
 * • Validate multimodal payload structure (image/text combinations)
 * 
 * Used By:
 * • API Routes
 * ------------------------------------------------------------
 */

import { z } from 'zod';

export const scanSchema = z.object({
  jobDescription: z.string().max(10000, "Job description exceeds maximum length of 10,000 characters").optional(),
  files: z.array(z.object({
    base64: z.string(),
    mimeType: z.string()
  })).optional(),
}).refine(data => {
  const hasText = data.jobDescription && data.jobDescription.trim().length >= 10;
  const hasFiles = data.files && data.files.length > 0;
  return hasText || hasFiles;
}, {
  message: "Either job description text (min 10 chars) or a document/image must be provided",
  path: ["jobDescription"],
});
