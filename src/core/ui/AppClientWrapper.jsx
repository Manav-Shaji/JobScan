"use client";

import { Suspense, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from '@/core/providers/auth-provider'
import { TopNavbar } from '@/core/ui/Navbar'
import { BottomNavigation } from '@/core/ui/BottomNavigation'
import { PwaUpdater } from '@/core/ui/PwaUpdater'
import { GlobalLoading } from '@/core/ui/GlobalLoading'

export function AppClientWrapper({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Protect app routes, but allow /dashboard/analyzer for guest trials
    if (!loading && !user && pathname !== '/dashboard/analyzer') {
      router.push('/auth')
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className="flex flex-col w-full h-[100dvh] bg-[var(--canvas)]">
        <GlobalLoading />
      </div>
    )
  }

  // Prevent flicker for unauthorized users
  if (!user && pathname !== '/dashboard/analyzer') {
    return null
  }

  return (
    <>
      <div className="dashboard-layout" style={{ 
        minHeight: '100dvh', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        <Suspense fallback={null}>
          <TopNavbar />
        </Suspense>
        <main className="main-content" style={{ flex: 1, minWidth: 0 }}>
          <div 
            className="content-area w-full mx-auto px-3 sm:px-4 md:px-8 pt-4 pb-28 md:pt-2 md:pb-8 max-w-[1200px]"
          >
            <Suspense fallback={<GlobalLoading />}>
              {children}
            </Suspense>
          </div>
        </main>
        <Suspense fallback={null}>
          <BottomNavigation />
        </Suspense>
        <PwaUpdater />
      </div>
    </>
  )
}
