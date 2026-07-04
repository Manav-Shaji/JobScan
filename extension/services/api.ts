/* eslint-disable */
// API Adapter for Chrome Extension

import { getApiBaseUrl } from './environment';

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

    const API_BASE = await getApiBaseUrl();
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