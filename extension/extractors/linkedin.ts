import { BaseExtractor, ExtractedDOM } from './base';

export class LinkedInExtractor extends BaseExtractor {
  canHandle(url: string): boolean {
    return url.includes('linkedin.com/jobs');
  }

  protected getTitleSplitChar(): string {
    return ' hiring ';
  }

  protected extractDOM(): ExtractedDOM {
    const titleEl = document.querySelector('.job-details-jobs-unified-top-card__job-title') || 
                    document.querySelector('.top-card-layout__title') ||
                    document.querySelector('h1');

    const companyEl = document.querySelector('.job-details-jobs-unified-top-card__company-name a') ||
                      document.querySelector('.topcard__org-name-link') ||
                      document.querySelector('.job-details-jobs-unified-top-card__company-name');

    const locEl = document.querySelector('.job-details-jobs-unified-top-card__primary-description span') ||
                  document.querySelector('.topcard__flavor--bullet');

    const descEl = document.querySelector('#job-details') ||
                   document.querySelector('.jobs-description__content') ||
                   document.querySelector('.description__text');

    const salaryEl = document.querySelector('.job-details-jobs-unified-top-card__job-insight span') || null;

    const mainContainer = document.querySelector('.jobs-search__job-details--container, .job-view-layout, #job-details') as HTMLElement;
    const aboutCompanyEl = document.querySelector('.jobs-company__box, [data-test-id="about-us"]') as HTMLElement;

    return { titleEl, companyEl, locEl, descEl, salaryEl, mainContainer, aboutCompanyEl };
  }
}
