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
    let posterBase64 = undefined;
    let posterMimeType = undefined;

    const ALLOWED_MIME_TYPES = UPLOAD_LIMITS.ALLOWED_MIME_TYPES;
    const MAX_FILE_SIZE = UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES; // 5MB limit
    const MAX_BASE64_LENGTH = UPLOAD_LIMITS.MAX_BASE64_LENGTH; // ~5MB of binary data

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      jobDescription = formData.get('jobDescription') || '';
      const file = formData.get('poster');

      if (file && typeof file !== 'string') {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          return new Response(JSON.stringify({ error: 'Unsupported file type. Use JPG, PNG, or WEBP' }), {
            status: 415,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        if (file.size > MAX_FILE_SIZE) {
          return new Response(JSON.stringify({ error: 'File size exceeds 5MB limit' }), {
            status: 413,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        posterMimeType = file.type;
        posterBase64 = buffer.toString('base64');
      }
    } else {
      // Fallback for purely text JSON request
      const body = await req.json().catch(() => ({}));
      jobDescription = body.jobDescription || '';
      if (body.posterBase64) {
        if (body.posterBase64.length > MAX_BASE64_LENGTH) {
          return new Response(JSON.stringify({ error: 'Base64 image size exceeds 5MB limit' }), {
            status: 413,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        posterBase64 = body.posterBase64;
        posterMimeType = body.posterMimeType || 'image/jpeg';
        if (!ALLOWED_MIME_TYPES.includes(posterMimeType)) {
          return new Response(JSON.stringify({ error: 'Unsupported file type. Use JPG, PNG, or WEBP' }), {
            status: 415,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }

    // Validate using Zod schema
    const validated = scanSchema.parse({ jobDescription, posterBase64, posterMimeType });

    return await analyzeJob(
      validated.jobDescription || '', 
      user?.id || null, 
      validated.posterBase64, 
      validated.posterMimeType, 
      null 
    );
  }
});
