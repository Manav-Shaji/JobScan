/**
 * ------------------------------------------------------------
 * File: base.ts
 * 
 * Purpose:
 * Base class definition for job board extractors.
 * 
 * Responsibilities:
 * • Define the abstract interface for extracting job details
 * • Provide common utility methods for DOM parsing
 * 
 * Used By:
 * • Specific Job Board Extractors
 * ------------------------------------------------------------
 */

import { JobData, JobExtractor } from '@/extension/types';

export function extractJsonLd(): any {
  try {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of Array.from(scripts)) {
      const data = JSON.parse(script.textContent || '{}');
      
      const checkNode = (node: any): any => {
        if (!node) return null;
        if (node['@type'] === 'JobPosting') return node;
        if (Array.isArray(node)) {
          for (const item of node) {
            const res = checkNode(item);
            if (res) return res;
          }
        }
        if (node['@graph'] && Array.isArray(node['@graph'])) {
          for (const item of node['@graph']) {
            const res = checkNode(item);
            if (res) return res;
          }
        }
        return null;
      };
      
      const found = checkNode(data);
      if (found) return found;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export interface ExtractedDOM {
  titleEl: Element | null;
  companyEl: Element | null;
  locEl: Element | null;
  descEl: Element | null;
  salaryEl: Element | null;
  mainContainer: Element | null;
  aboutCompanyEl: Element | null;
}

export abstract class BaseExtractor implements JobExtractor {
  abstract canHandle(url: string): boolean;
  
  protected abstract extractDOM(): ExtractedDOM;
  protected abstract getTitleSplitChar(): string;

  async extract(): Promise<JobData | null> {
    try {
      const { titleEl, companyEl, locEl, descEl, salaryEl, mainContainer, aboutCompanyEl } = this.extractDOM();

      const ld = extractJsonLd();
      const ldTitle = ld?.title ? String(ld.title).replace(/<[^>]+>/g, '') : '';
      const ldCompany = ld?.hiringOrganization?.name ? String(ld.hiringOrganization.name).replace(/<[^>]+>/g, '') : '';
      const ldDesc = ld?.description ? String(ld.description).replace(/<[^>]+>/g, '') : '';
      const ldLoc = ld?.jobLocation?.address?.addressLocality ? String(ld.jobLocation.address.addressLocality) : '';

      let rawText = mainContainer ? (mainContainer as HTMLElement).innerText : document.body.innerText;
      
      if (aboutCompanyEl && !rawText.includes((aboutCompanyEl as HTMLElement).innerText.substring(0, 100))) {
        rawText += '\n\nAbout Company:\n' + (aboutCompanyEl as HTMLElement).innerText;
      }

      let finalCompany = companyEl?.textContent?.trim() || ldCompany || '';
      
      // Fallback 1: Try to extract from entire page text
      if (!finalCompany && document.body) {
        const match = document.body.innerText.match(/Company Name:\s*([^\n]+)/i);
        if (match && match[1]) {
          finalCompany = match[1].trim();
        }
      }

      // Fallback 2: Try to extract from document.title using split character
      if (!finalCompany && document.title) {
        let parts = document.title.split(this.getTitleSplitChar());
        if (parts.length < 2 && this.getTitleSplitChar() === '-') {
            parts = document.title.split('|');
        } else if (parts.length < 2 && this.getTitleSplitChar() === ' hiring ') {
            // Do nothing
        }
        
        if (parts.length >= 2) {
          const possibleName = parts[parts.length - 1].toLowerCase().includes('naukri') || parts[parts.length - 1].toLowerCase().includes('indeed')
            ? parts[parts.length - 2] 
            : parts[parts.length - 1];
          // For LinkedIn it's the first part
          if (this.getTitleSplitChar() === ' hiring ') {
             finalCompany = parts[0].trim();
          } else {
             finalCompany = possibleName.trim();
          }
        }
      }

      let title = titleEl?.textContent?.trim();
      if (!title && document.title) {
          title = document.title.split('-')[0].split('|')[0].trim();
      }

      return {
        title: title || ldTitle || 'Unknown Job Title',
        company: finalCompany,
        location: locEl?.textContent?.trim() || ldLoc || '',
        salary: salaryEl?.textContent?.trim() || '',
        description: descEl?.textContent?.trim() || ldDesc || (rawText ? rawText.substring(0, 8000) : ''),
        url: window.location.href
      };
    } catch (error) {
      console.error('Job extraction failed:', error);
      return null;
    }
  }
}
