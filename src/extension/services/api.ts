// API Adapter for Chrome Extension
// Communicates with existing JobScan backend without importing Next.js router/runtime code

const API_BASE = 'http://localhost:3000/api'; // Can be moved to env config later

export async function analyzeJob(jobData: any, posterBase64?: string, posterMimeType?: string) {
  try {
    // We combine the extracted text into a single job description payload 
    // to match the existing API's expected format.
    const fullDescription = jobData ? `
      Title: ${jobData.title || ''}
      Company: ${jobData.company || ''}
      Location: ${jobData.location || ''}
      Salary: ${jobData.salary || ''}
      
      Description:
      ${jobData.description || ''}
    ` : '';

    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobDescription: fullDescription,
        posterBase64,
        posterMimeType
      })
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
