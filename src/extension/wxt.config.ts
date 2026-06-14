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
      '*://*.naukri.com/*',
      'http://localhost:3000/*',
      'https://job-scan-black.vercel.app/*',
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
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) {
            return;
          }
          if (warning.message.includes('sourcemap') || warning.message.includes("Can't resolve original location of error")) {
            return;
          }
          warn(warning);
        }
      }
    }
  })
});
