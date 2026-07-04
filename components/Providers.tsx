'use client'

import { SessionProvider } from 'next-auth/react'

export default function Providers({ children }: { children: React.ReactNode }) {
  // refetchOnWindowFocus: re-check the session when the tab regains focus, so a
  // logout/login made elsewhere (or an account change) is reflected without a
  // manual refresh. No interval polling (refetchInterval stays 0).
  return <SessionProvider refetchOnWindowFocus>{children}</SessionProvider>
}
