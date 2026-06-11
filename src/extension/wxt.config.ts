import { defineConfig } from 'wxt';
import path from 'path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  outDir: '../../dist-ext',
  manifest: {
    name: 'JobScan Trust Analyzer',
    description: 'Analyze job listings for safety, scams, and credibility.',
    version: '1.0.0',
    permissions: ['storage', 'sidePanel', 'activeTab', 'scripting'],
    host_permissions: [
      '*://*.linkedin.com/*',
      '*://*.indeed.com/*',
      '*://*.naukri.com/*'
    ],
    action: {
      default_title: 'Open JobScan'
    }
  },
  vite: () => ({
    resolve: {
      alias: {
        '@/frontend': path.resolve(__dirname, '../frontend'),
        '@/extension': path.resolve(__dirname, './'),
        '@/shared': path.resolve(__dirname, '../shared'),
        '@/lib': path.resolve(__dirname, '../lib'),
        '@/backend': path.resolve(__dirname, '../backend')
      }
    }
  })
});
