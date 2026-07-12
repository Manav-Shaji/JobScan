import { BaseExtractor, ExtractedDOM } from './base';

export class NaukriExtractor extends BaseExtractor {
  canHandle(url: string): boolean {
    return url.includes('naukri.com');
  }

  protected getTitleSplitChar(): string {
    return '-';
  }

  protected extractDOM(): ExtractedDOM {
    const titleEl = document.querySelector('.jd-header-title') ||
                    document.querySelector('[class*="title"]') ||
                    document.querySelector('[class*="job-title"]') ||
                    document.querySelector('h1');

    const companyEl = document.querySelector('.jd-header-comp-name a') ||
                      document.querySelector('[class*="comp-name"]') ||
                      document.querySelector('[class*="company-name"]') ||
                      document.querySelector('a[href*="/company/"]');

    const locEl = document.querySelector('.loc') ||
                  document.querySelector('[class*="location"]') ||
                  document.querySelector('[class*="loc-wrap"]');

    const descEl = document.querySelector('.job-desc') ||
                   document.querySelector('.dang-inner-html') ||
                   document.querySelector('[class*="job-desc"]') ||
                   document.querySelector('.jobDescription');

    const salaryEl = document.querySelector('.salary') ||
                     document.querySelector('.sal') ||
                     document.querySelector('.salary-wrap');

    const mainContainer = document.querySelector('.leftSec, .job-desc, .styles_job-desc-container__txpYf') as HTMLElement;
    const aboutCompanyEl = document.querySelector('.about-company, .company-profile, [class*="about-company"], [class*="company-profile"]') as HTMLElement;

    return { titleEl, companyEl, locEl, descEl, salaryEl, mainContainer, aboutCompanyEl };
  }
}
