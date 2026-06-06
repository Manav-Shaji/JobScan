"use client";

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/frontend/context/theme-context';
import { AuthProvider } from '@/frontend/context/auth-context';
import { JobProvider } from '@/frontend/context/job-context';
import { PwaProvider } from '@/frontend/context/pwa-context';

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
