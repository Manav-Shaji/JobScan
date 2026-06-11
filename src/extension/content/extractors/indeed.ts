import { JobData, JobExtractor } from '../types';

export class IndeedExtractor implements JobExtractor {
  canHandle(url: string): boolean {
    return url.includes('indeed.com/viewjob') || url.includes('indeed.com/rc/clk');
  }

  async extract(): Promise<JobData | null> {
    try {
      const titleEl = document.querySelector('.jobsearch-JobInfoHeader-title');
      const companyEl = document.querySelector('div[data-company-name]');
      const locEl = document.querySelector('div[data-job-location]');
      const descEl = document.querySelector('#jobDescriptionText');
      const salaryEl = document.querySelector('#salaryInfoAndJobType');

      if (!titleEl) return null;

      return {
        title: titleEl.textContent?.trim() || '',
        company: companyEl?.textContent?.trim() || '',
        location: locEl?.textContent?.trim() || '',
        salary: salaryEl?.textContent?.trim() || '',
        description: descEl?.textContent?.trim() || '',
        url: window.location.href
      };
    } catch (error) {
      console.error('Indeed extraction failed:', error);
      return null;
    }
  }
}
