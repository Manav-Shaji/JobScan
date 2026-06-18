"use client";

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/frontend/providers/theme-provider';
import { AuthProvider } from '@/frontend/providers/auth-provider';
import { JobProvider } from '@/frontend/providers/job-provider';
import { PwaProvider } from '@/frontend/providers/pwa-provider';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthProvider>
          <JobProvider>
            <PwaProvider>
              {children}
            </PwaProvider>
          </JobProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
