/**
 * ------------------------------------------------------------
 * File: indeed.ts
 * 
 * Purpose:
 * Content extractor for Indeed job postings.
 * 
 * Responsibilities:
 * • Parse DOM elements specific to Indeed's job layout
 * • Extract title, company, and description text
 * 
 * Used By:
 * • Extractor Registry
 * ------------------------------------------------------------
 */

import { BaseExtractor, ExtractedDOM } from './base';

export class IndeedExtractor extends BaseExtractor {
  canHandle(url: string): boolean {
    return url.includes('indeed.com');
  }

  protected getTitleSplitChar(): string {
    return '-';
  }

  protected extractDOM(): ExtractedDOM {
    const titleEl = document.querySelector('.jobsearch-JobInfoHeader-title') || 
                    document.querySelector('h1.jobsearch-JobInfoHeader-title') ||
                    document.querySelector('h1');

    const companyEl = document.querySelector('[data-company-name="true"]') || 
                      document.querySelector('.jobsearch-CompanyInfoContainer a') ||
                      document.querySelector('.jobsearch-JobInfoHeader-subtitle div') ||
                      document.querySelector('[data-testid="inlineHeader-companyName"]');
                      
    const locEl = document.querySelector('div[data-job-location]') || 
                  document.querySelector('[data-testid="inlineHeader-companyLocation"]') ||
                  document.querySelector('[class*="companyLocation"]');
                  
    const descEl = document.querySelector('#jobDescriptionText') || 
                   document.querySelector('.jobsearch-jobDescriptionText') ||
                   document.querySelector('.jobsearch-JobComponent-description');
                   
    const salaryEl = document.querySelector('#salaryInfoAndJobType') || 
                     document.querySelector('.salary-snippet-container') ||
                     document.querySelector('[data-testid="jobsearch-JobDescription-salary"]');

    const mainContainer = document.querySelector('.jobsearch-ViewJobLayout-jobDisplay, #jobDescriptionText, .jobsearch-JobComponent') as HTMLElement;
    const aboutCompanyEl = document.querySelector('#companyInfo, [data-testid="aboutCompany"]') as HTMLElement;

    return { titleEl, companyEl, locEl, descEl, salaryEl, mainContainer, aboutCompanyEl };
  }
}
