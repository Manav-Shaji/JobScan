import { JobData, JobExtractor } from '../types';

export class IndeedExtractor implements JobExtractor {
  canHandle(url: string): boolean {
    return url.includes('indeed.com/viewjob') || 
           url.includes('indeed.com/rc/clk') || 
           (url.includes('indeed.com/jobs') && url.includes('vjk='));
  }

  async extract(): Promise<JobData | null> {
    try {
      const titleEl = document.querySelector('.jobsearch-JobInfoHeader-title') || 
                      document.querySelector('h2.jobsearch-JobInfoHeader-title span') || 
                      document.querySelector('h2.jobTitle') ||
                      document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"]') ||
                      document.querySelector('h1');
                      
      const companyEl = document.querySelector('div[data-company-name]') || 
                        document.querySelector('[data-testid="inlineHeader-companyName"]') ||
                        document.querySelector('.jobsearch-CompanyInfoContainer') ||
                        document.querySelector('.companyName');
                        
      const locEl = document.querySelector('div[data-job-location]') || 
                    document.querySelector('[data-testid="inlineHeader-companyLocation"]') ||
                    document.querySelector('.companyLocation');
                    
      const descEl = document.querySelector('#jobDescriptionText') || 
                     document.querySelector('.jobsearch-jobDescriptionText') ||
                     document.querySelector('.jobsearch-JobComponent-description');
                     
      const salaryEl = document.querySelector('#salaryInfoAndJobType') || 
                       document.querySelector('.salary-snippet-container') ||
                       document.querySelector('[data-testid="jobsearch-JobDescription-salary"]');

      // Use document title as an absolute fallback for the job title
      let title = titleEl?.textContent?.trim();
      if (!title) {
        // Indeed titles are often "Job Title - Location - Company - Indeed.com"
        title = document.title.split('-')[0].trim() || 'Unknown Job Title';
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
      console.error('Indeed extraction failed:', error);
      return null;
    }
  }
}
