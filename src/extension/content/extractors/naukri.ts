import { JobData, JobExtractor } from '../types';

export class NaukriExtractor implements JobExtractor {
  canHandle(url: string): boolean {
    return url.includes('naukri.com/job-listings');
  }

  async extract(): Promise<JobData | null> {
    try {
      const titleEl = document.querySelector('.jd-header-title, .title');
      const companyEl = document.querySelector('.jd-header-comp-name a, .company-name');
      const locEl = document.querySelector('.loc, .location');
      const descEl = document.querySelector('.job-desc, .dang-inner-html');
      const salaryEl = document.querySelector('.salary, .sal');

      if (!titleEl || !companyEl) return null;

      return {
        title: titleEl.textContent?.trim() || '',
        company: companyEl.textContent?.trim() || '',
        location: locEl?.textContent?.trim() || '',
        salary: salaryEl?.textContent?.trim() || '',
        description: descEl?.textContent?.trim() || '',
        url: window.location.href
      };
    } catch (error) {
      console.error('Naukri extraction failed:', error);
      return null;
    }
  }
}
