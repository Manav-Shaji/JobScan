/* eslint-disable */
import { JobData, JobExtractor } from '../types';

export class LinkedInExtractor implements JobExtractor {
  canHandle(url: string): boolean {
    return url.includes('linkedin.com/jobs/view/') || 
           url.includes('linkedin.com/jobs/collections/') || 
           url.includes('linkedin.com/jobs/search/');
  }

  async extract(): Promise<JobData | null> {
    try {
      // Find the main job details container
      const titleEl = document.querySelector('.job-details-jobs-unified-top-card__job-title, .top-card-layout__title');
      const companyEl = document.querySelector('.job-details-jobs-unified-top-card__company-name, .topcard__org-name-link');
      const locationEl = document.querySelector('.job-details-jobs-unified-top-card__bullet, .topcard__flavor--bullet');
      const descEl = document.querySelector('#job-details, .show-more-less-html__markup');

      if (!titleEl || !companyEl) {
        return null;
      }

      const title = titleEl.textContent?.trim() || '';
      const company = companyEl.textContent?.trim() || '';
      const location = locationEl?.textContent?.trim() || '';
      const description = descEl?.textContent?.trim() || '';

      // Salary might be in another bullet point
      let salary = '';
      const bullets = document.querySelectorAll('.job-details-jobs-unified-top-card__job-insight');
      bullets.forEach(b => {
        const text = b.textContent?.trim() || '';
        if (text.includes('$') || text.includes('₹') || text.toLowerCase().includes('salary')) {
          salary = text;
        }
      });

      return {
        title,
        company,
        location,
        salary,
        description,
        url: window.location.href
      };
    } catch (error) {
      console.error('LinkedIn extraction failed:', error);
      return null;
    }
  }
}
