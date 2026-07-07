import { AppClientWrapper } from '@/core/ui/AppClientWrapper'

export default function AppLayout({ children }) {
  return (
    <AppClientWrapper>
      {children}
    </AppClientWrapper>
  )
}
