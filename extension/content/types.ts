/* eslint-disable */
export interface JobData {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  recruiter?: string;
  url: string;
}

export interface JobExtractor {
  canHandle(url: string): boolean;
  extract(): Promise<JobData | null>;
}
