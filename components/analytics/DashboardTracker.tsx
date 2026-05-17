'use client'

import { useEffect } from 'react'
import { track, identify, Events } from '@/lib/analytics/posthog'

interface Props {
  userId: string
  email: string
}

export function DashboardTracker({ userId, email }: Props) {
  useEffect(() => {
    identify(userId, { email })
    track(Events.DASHBOARD_VISITED, {})
  }, [userId, email])
  return null
}
