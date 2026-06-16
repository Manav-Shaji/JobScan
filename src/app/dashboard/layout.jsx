import { AppClientWrapper } from '@/frontend/ui/layout/AppClientWrapper'

export default function AppLayout({ children }) {
  return (
    <AppClientWrapper>
      {children}
    </AppClientWrapper>
  )
}
