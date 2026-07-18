/**
 * ------------------------------------------------------------
 * API Route: route.ts
 * 
 * Purpose:
 * Handles incoming scan analysis requests by processing file uploads or base64 data 
 * and initiating the job analysis service.
 * 
 * Responsibilities:
 * • Validate file types and size limits for job posters.
 * • Parse and sanitize request data before invoking the scan service.
 * 
 * Used By:
 * • Scan Feature Module
 * ------------------------------------------------------------
 */

import { createRouteHandler } from '@/core/api/route-utils';
import { scanSchema } from '@/features/scans/validation';
import { analyzeJob } from '@/features/scans/service';
import { UPLOAD_LIMITS } from '@/shared/constants';

export const POST = createRouteHandler({
  auth: 'optional',
  rateLimit: { key: 'analyze', limit: 10, windowMs: 60 * 1000 },
  async handler({ req, user }) {
    const contentType = req.headers.get('content-type') || '';

    let jobDescription = '';
    let files: { base64: string, mimeType: string }[] = [];

    const ALLOWED_MIME_TYPES = UPLOAD_LIMITS.ALLOWED_MIME_TYPES;
    const MAX_FILE_SIZE = UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      jobDescription = formData.get('jobDescription')?.toString() || '';
      
      // Handle multiple files
      const formDataFiles = formData.getAll('files');
      for (const file of formDataFiles) {
        if (file && typeof file !== 'string') {
          if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
            return new Response(JSON.stringify({ error: 'Unsupported file type. Use JPG, PNG, WEBP, or PDF' }), {
              status: 415,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (file.size > MAX_FILE_SIZE) {
            return new Response(JSON.stringify({ error: `File size exceeds 10MB limit` }), {
              status: 413,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          const buffer = Buffer.from(await file.arrayBuffer());
          files.push({
            mimeType: file.type,
            base64: buffer.toString('base64')
          });
        }
      }
      
      // Backwards compatibility for single 'poster' upload
      const singleFile = formData.get('poster');
      if (singleFile && typeof singleFile !== 'string') {
          const buffer = Buffer.from(await singleFile.arrayBuffer());
          files.push({
            mimeType: singleFile.type,
            base64: buffer.toString('base64')
          });
      }
    } else {
      // Fallback for purely text JSON request
      const body = await req.json().catch(() => ({}));
      jobDescription = body.jobDescription || '';
      if (body.files && Array.isArray(body.files)) {
        files = body.files;
      } else if (body.posterBase64) {
        files.push({
          base64: body.posterBase64,
          mimeType: body.posterMimeType || 'image/jpeg'
        });
      }
    }

    // Validate using Zod schema
    const validated = scanSchema.parse({ jobDescription, files });

    return await analyzeJob(
      validated.jobDescription || '',
      user?.id || null,
      validated.files || [],
      null
    );
  }
});
