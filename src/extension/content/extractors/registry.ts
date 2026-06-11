import { JobExtractor } from '../types';
import { LinkedInExtractor } from './linkedin';
import { NaukriExtractor } from './naukri';
import { IndeedExtractor } from './indeed';

const extractors: JobExtractor[] = [
  new LinkedInExtractor(),
  new NaukriExtractor(),
  new IndeedExtractor()
];

export function getExtractor(url: string): JobExtractor | null {
  return extractors.find(e => e.canHandle(url)) || null;
}
