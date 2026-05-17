'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IndustryKey, AgentRoleKey } from '@/lib/supabase/types'

interface OnboardingState {
  industry: IndustryKey | null
  companyName: string
  mission: string
  tone: string
  openaiKey: string
  anthropicKey: string
  selectedRole: AgentRoleKey
  companyId: string | null
  hiredAgentId: string | null
  set: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void
  reset: () => void
}

const initial = {
  industry: null,
  companyName: '',
  mission: '',
  tone: '',
  openaiKey: '',
  anthropicKey: '',
  selectedRole: 'marketer' as AgentRoleKey,
  companyId: null,
  hiredAgentId: null,
}

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initial,
      set: (key, value) => set({ [key]: value } as Pick<OnboardingState, typeof key>),
      reset: () => set(initial),
    }),
    { name: 'polaris-onboarding' }
  )
)
