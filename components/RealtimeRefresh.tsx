'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Keeps the current page's server-rendered data fresh WITHOUT interval polling.
 *
 * Two triggers, both event-driven:
 *   1. SSE push (/api/realtime) — fires the instant a relevant change is made by
 *      the other actor (e.g. admin updates your order → your page refreshes).
 *   2. Tab focus / visibility — when the user returns to the tab, refresh once.
 *
 * Mount this only for authenticated users (the SSE endpoint requires a session).
 */
export default function RealtimeRefresh() {
  const router = useRouter()

  useEffect(() => {
    let source: EventSource | null = null

    try {
      source = new EventSource('/api/realtime')
      source.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data?.type === 'refresh') router.refresh()
        } catch {
          // ignore malformed frames (e.g. keepalive comments aren't onmessage)
        }
      }
      // EventSource reconnects automatically on transient errors; nothing to do.
      source.onerror = () => {}
    } catch {
      // EventSource unsupported — fall back to focus-only refresh below.
    }

    const refresh = () => router.refresh()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') router.refresh()
    }

    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      source?.close()
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [router])

  return null
}
