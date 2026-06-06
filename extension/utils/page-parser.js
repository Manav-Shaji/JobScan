/**
 * JobScan Parser Engine
 * Handles site-specific selector-based extraction and falls back to semantic DOM parsing.
 */
const JobScanParser = {
  getSiteType() {
    const host = window.location.hostname;
    if (host.includes('linkedin.com')) return 'linkedin';
    if (host.includes('indeed.com')) return 'indeed';
    if (host.includes('naukri.com')) return 'naukri';
    if (host.includes('foundit.in')) return 'foundit';
    if (host.includes('internshala.com')) return 'internshala';
    return 'generic';
  },

  extractJob() {
    const site = this.getSiteType();
    const result = {
      title: '',
      company: '',
      location: '',
      salary: '',
      description: '',
      url: window.location.href
    };

    switch (site) {
      case 'linkedin':
        result.title = this.getText(['.job-details-jobs-unified-top-card__job-title', '.jobs-unified-top-card__content--left h1', 'h1.t-24']);
        result.company = this.getText(['.job-details-jobs-unified-top-card__company-name', '.jobs-unified-top-card__company-name a', '.jobs-unified-top-card__company-name']);
        result.location = this.getText(['.job-details-jobs-unified-top-card__bullet', '.jobs-unified-top-card__bullet']);
        result.salary = this.getText(['.job-details-jobs-unified-top-card__salary-insight', '.jobs-unified-top-card__salary-insight']);
        result.description = this.getText(['#job-details', '.jobs-description__content', '.jobs-box__html-content']);
        break;

      case 'indeed':
        result.title = this.getText(['h1.jobsearch-JobInfoHeader-title', 'h1']);
        result.company = this.getText(['div[data-company-name="true"]', '.jobsearch-CompanyInfoContainer a', '.jobsearch-InlineCompanyRating']);
        result.location = this.getText(['#jobLocationSection', '.jobsearch-JobInfoHeader-subtitle div:last-child', '.jobsearch-JobMetadataHeader-iconLabel']);
        result.salary = this.getText(['#salaryInfoAndJobType', '.jobsearch-JobMetadataHeader-item']);
        result.description = this.getText(['#jobDescriptionText', '.jobsearch-jobDescriptionText']);
        break;

      case 'naukri':
        result.title = this.getText(['.jd-header-title', 'h1.jd-header-title']);
        result.company = this.getText(['.jd-header-comp-name a', '.pad-rt-8']);
        result.location = this.getText(['.location a', '.locCent']);
        result.salary = this.getText(['.salary span', '.salaryCent']);
        result.description = this.getText(['.job-desc', '.jd-desc']);
        break;

      case 'foundit':
        result.title = this.getText(['h1.job-title', '.jd-heading']);
        result.company = this.getText(['.company-name', '.jd-comp-name']);
        result.location = this.getText(['.location', '.jd-loc']);
        result.salary = this.getText(['.salary', '.jd-salary']);
        result.description = this.getText(['.job-desc', '.jd-description']);
        break;

      case 'internshala':
        result.title = this.getText(['.profile_heading', 'h1']);
        result.company = this.getText(['.company_name', '.heading_6']);
        result.location = this.getText(['.location_link', '.location']);
        result.salary = this.getText(['.stipend_container', '.stipend']);
        result.description = this.getText(['.job-description', '.text-container']);
        break;

      default:
        this.runSemanticExtraction(result);
    }

    // Clean up parsed fields
    result.title = result.title.trim();
    result.company = result.company.trim();
    result.location = result.location.trim();
    result.salary = result.salary.trim();
    result.description = result.description.trim();

    // If site-specific fields are missing, try semantic fallback for those specific fields
    if (!result.title) result.title = this.fallbackTitle();
    if (!result.company) result.company = this.fallbackCompany();
    if (!result.description) result.description = this.fallbackDescription();

    return result;
  },

  getText(selectors) {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el && el.textContent.trim()) {
        return el.textContent.trim();
      }
    }
    return '';
  },

  runSemanticExtraction(result) {
    result.title = this.fallbackTitle();
    result.company = this.fallbackCompany();
    result.location = this.fallbackLocation();
    result.salary = this.fallbackSalary();
    result.description = this.fallbackDescription();
  },

  fallbackTitle() {
    const h1s = Array.from(document.querySelectorAll('h1'));
    for (const h1 of h1s) {
      const cls = h1.className.toLowerCase();
      if (cls.includes('title') || cls.includes('heading') || cls.includes('job')) {
        return h1.textContent.trim();
      }
    }
    return h1s[0] ? h1s[0].textContent.trim() : document.title.split('|')[0].split('-')[0].trim();
  },

  fallbackCompany() {
    const companyKeywords = ['company', 'employer', 'brand', 'firm', 'organization'];
    for (const keyword of companyKeywords) {
      const selector = `[class*="${keyword}"], [id*="${keyword}"]`;
      const matches = Array.from(document.querySelectorAll(selector));
      for (const el of matches) {
        const tagName = el.tagName.toLowerCase();
        if (tagName === 'span' || tagName === 'a' || tagName === 'div') {
          const text = el.textContent.trim();
          if (text && text.length < 50 && !text.includes('\n')) {
            return text;
          }
        }
      }
    }
    return '';
  },

  fallbackLocation() {
    const locationKeywords = ['location', 'city', 'address', 'locality'];
    for (const keyword of locationKeywords) {
      const matches = document.querySelectorAll(`[class*="${keyword}"], [id*="${keyword}"]`);
      for (const el of matches) {
        const text = el.textContent.trim();
        if (text && text.length < 100 && !text.includes('\n')) {
          return text;
        }
      }
    }
    return '';
  },

  fallbackSalary() {
    const salaryRegex = /([$₹€£]\s?\d+[\d,]*)|(salary|stipend|compensation|remuneration)/i;
    const bodyText = document.body.innerText;
    const match = bodyText.match(salaryRegex);
    if (match) {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while (node = walker.nextNode()) {
        if (salaryRegex.test(node.nodeValue)) {
          const parent = node.parentElement;
          if (parent && parent.textContent.trim().length < 100) {
            return parent.textContent.trim();
          }
        }
      }
    }
    return '';
  },

  fallbackDescription() {
    const descKeywords = ['description', 'details', 'about', 'summary', 'content', 'body'];
    for (const keyword of descKeywords) {
      const matches = document.querySelectorAll(`[class*="${keyword}"], [id*="${keyword}"], [class*="job-details"]`);
      for (const el of matches) {
        const text = el.textContent.trim();
        if (text && text.length > 200) {
          return text;
        }
      }
    }
    const containers = Array.from(document.querySelectorAll('div, section, article'));
    let bestContainer = null;
    let maxParagraphs = 0;
    for (const c of containers) {
      const pCount = c.querySelectorAll('p').length;
      if (pCount > maxParagraphs && c.textContent.trim().length > 300) {
        maxParagraphs = pCount;
        bestContainer = c;
      }
    }
    if (bestContainer) {
      return bestContainer.textContent.trim();
    }
    let maxLen = 0;
    let mainDiv = '';
    const divs = document.querySelectorAll('div');
    for (const div of divs) {
      if (div.children.length === 0) continue;
      const cleanText = div.textContent.trim().replace(/\s+/g, ' ');
      if (cleanText.length > maxLen && cleanText.length < 10000) {
        maxLen = cleanText.length;
        mainDiv = cleanText;
      }
    }
    return mainDiv || document.body.innerText;
  }
};

window.JobScanParser = JobScanParser;
