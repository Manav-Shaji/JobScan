import { JobData, JobExtractor } from '../types';

export class NaukriExtractor implements JobExtractor {
  canHandle(url: string): boolean {
    return url.includes('naukri.com');
  }

  async extract(): Promise<JobData | null> {
    try {
      const titleEl = document.querySelector('.jd-header-title') || 
                      document.querySelector('h1.title') || 
                      document.querySelector('.job-title') || 
                      document.querySelector('h1');
                      
      const companyEl = document.querySelector('.jd-header-comp-name a') || 
                        document.querySelector('.jd-header-comp-name') || 
                        document.querySelector('.company-name') ||
                        document.querySelector('.company-name-text') ||
                        document.querySelector('.com-name');
                        
      const locEl = document.querySelector('.loc') || 
                    document.querySelector('.location') || 
                    document.querySelector('.job-location') ||
                    document.querySelector('.loc-wrap');
                    
      const descEl = document.querySelector('.job-desc') || 
                     document.querySelector('.dang-inner-html') || 
                     document.querySelector('[class*="job-desc"]') ||
                     document.querySelector('.jobDescription');
                     
      const salaryEl = document.querySelector('.salary') || 
                       document.querySelector('.sal') ||
                       document.querySelector('.salary-wrap');

      let title = titleEl?.textContent?.trim();
      if (!title) {
        title = document.title.split('|')[0].trim() || 'Unknown Job Title';
      }

      return {
        title: title,
        company: companyEl?.textContent?.trim() || 'Unknown Company',
        location: locEl?.textContent?.trim() || '',
        salary: salaryEl?.textContent?.trim() || '',
        description: descEl?.textContent?.trim() || 'No description extracted. Please use OCR as a fallback.',
        url: window.location.href
      };
    } catch (error) {
      console.error('Naukri extraction failed:', error);
      return null;
    }
  }
}
