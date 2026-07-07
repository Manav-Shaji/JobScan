/* eslint-disable */
"use client";

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/core/providers/auth-provider'
import { TopNavbar } from '@/core/ui/Navbar'
import { BottomNavigation } from '@/core/ui/BottomNavigation'
import dynamic from 'next/dynamic'

const ChatWidget = dynamic(() => import('@/core/ui/ChatWidget').then(mod => mod.ChatWidget), {
  ssr: false
})
import { PwaUpdater } from '@/core/ui/PwaUpdater'

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
      <div className="flex justify-center items-center" style={{ height: '100dvh', background: 'var(--canvas)' }}>
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" role="status">
          <span className="sr-only">Loading...</span>
        </div>
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
        <TopNavbar />
        <main className="main-content" style={{ flex: 1, minWidth: 0 }}>
          <div 
            className="content-area w-full mx-auto px-3 sm:px-4 md:px-8 pt-4 pb-28 md:pt-2 md:pb-8 max-w-[1200px]"
          >
            {children}
          </div>
        </main>
        <BottomNavigation />
        <div className="hidden md:block">
          <ChatWidget />
        </div>
        <PwaUpdater />
      </div>
    </>
  )
}
