'use client'

import { useEffect } from 'react'

export default function AnalyticsBeacon({ userId }: { userId: string }) {
  useEffect(() => {
    fetch('/api/analytics/view', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ userId }),
    }).catch(() => null)
  }, [userId])

  return null
}
