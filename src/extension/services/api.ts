// API Adapter for Chrome Extension

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : 'http://localhost:3000/api';

export async function analyzeJob(
  jobData: any,
  posterBase64?: string,
  posterMimeType?: string
) {
  try {
    const fullDescription = jobData
      ? `
Title: ${jobData.title || ''}
Company: ${jobData.company || ''}
Location: ${jobData.location || ''}
Salary: ${jobData.salary || ''}

Description:
${jobData.description || ''}
`
      : '';

    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobDescription: fullDescription,
        posterBase64,
        posterMimeType,
      }),
    });

    const payload = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(payload?.message || 'Failed to analyze job description.');
    }

    return payload;
  } catch (error) {
    console.error('[Extension API Error]:', error);
    throw error;
  }
}