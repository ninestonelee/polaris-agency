import posthog from 'posthog-js'

let initialized = false

export function initPosthog() {
  if (typeof window === 'undefined') return
  if (initialized) return
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
  })
  initialized = true
}

export function track(event: string, props: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    console.debug('[analytics]', event, props)
    return
  }
  posthog.capture(event, props)
}

export function identify(userId: string, traits: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  posthog.identify(userId, traits)
}

export function reset() {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  posthog.reset()
}

export const Events = {
  SIGNUP_COMPLETED: 'signup_completed',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  COMPANY_CREATED: 'company_created',
  AGENT_HIRED: 'agent_hired',
  TASK_EXECUTED: 'task_executed',
  TASK_ERROR: 'task_error',
  DASHBOARD_VISITED: 'dashboard_visited',
  FAQ_VIEWED: 'faq_viewed',
  KAKAO_CHANNEL_CLICKED: 'kakao_channel_clicked',
} as const
