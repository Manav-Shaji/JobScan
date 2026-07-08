/* eslint-disable */
import { defineConfig } from 'wxt';
import path from 'path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
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
      '*://*.vercel.app/*',
    ],
    action: {
      default_title: 'Open JobScan'
    }
  },
  vite: () => ({

    resolve: {
      alias: {
        '@/core': path.resolve(__dirname, '../src/core'),
        '@/features': path.resolve(__dirname, '../src/features'),
        '@/shared': path.resolve(__dirname, '../src/shared'),
        '@/app': path.resolve(__dirname, '../src/app'),
        '@/extension': path.resolve(__dirname, './')
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
        },
        moduleTypes: {
          '.tsx': 'tsx',
          '.jsx': 'jsx',
        }
      }
    }
  })
});
