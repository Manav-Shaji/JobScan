/**
 * ------------------------------------------------------------
 * File: loading.jsx
 * 
 * Purpose:
 * Next.js loading state component for dashboard routes.
 * 
 * Responsibilities:
 * • Display a loading indicator while dashboard content is fetched
 * 
 * Used By:
 * • Next.js App Router (Suspense fallback)
 * ------------------------------------------------------------
 */

import { GlobalLoading } from '@/core/ui/GlobalLoading';

export default function DashboardLoading() {
  return (
    <div className="w-full h-full min-h-[60vh] flex items-center justify-center">
      <GlobalLoading />
    </div>
  );
}
