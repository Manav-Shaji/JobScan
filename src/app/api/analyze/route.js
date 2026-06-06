import { createRouteHandler } from '@/backend/api/route-utils';
import { scanSchema } from '@/backend/modules/scans/scan-schema';
import { analyzeJob } from '@/backend/modules/scans/scan-service';

export const POST = createRouteHandler({
  auth: 'optional',
  rateLimit: { key: 'analyze', limit: 10, windowMs: 60 * 1000 },
  async handler({ req, user }) {
    const contentType = req.headers.get('content-type') || '';
    
    let jobDescription = '';
    let posterBase64 = undefined;
    let posterMimeType = undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      jobDescription = formData.get('jobDescription') || '';
      const file = formData.get('poster');

      if (file && typeof file !== 'string') {
        const buffer = Buffer.from(await file.arrayBuffer());
        posterMimeType = file.type;
        posterBase64 = buffer.toString('base64');
      }
    } else {
      // Fallback for purely text JSON request
      const body = await req.json().catch(() => ({}));
      jobDescription = body.jobDescription || '';
      if (body.posterBase64) {
        posterBase64 = body.posterBase64;
        posterMimeType = body.posterMimeType || 'image/jpeg';
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
