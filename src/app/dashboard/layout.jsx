/**
 * ------------------------------------------------------------
 * File: layout.jsx
 * 
 * Purpose:
 * Shared layout component for all dashboard routes.
 * 
 * Responsibilities:
 * • Ensure the user is authenticated via server-side checks
 * • Render the dashboard navigation bar, sidebar, or mobile nav
 * • Manage the overall dashboard application shell
 * 
 * Used By:
 * • Next.js App Router (/dashboard routes)
 * ------------------------------------------------------------
 */

import { AppClientWrapper } from '@/core/ui/AppClientWrapper'

export default function AppLayout({ children }) {
  return (
    <AppClientWrapper>
      {children}
    </AppClientWrapper>
  )
}
