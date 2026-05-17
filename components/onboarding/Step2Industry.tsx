'use client'

import { useRouter } from 'next/navigation'
import { IndustryPicker } from '@/components/company/IndustryPicker'
import { useOnboarding } from '@/lib/onboarding/store'
import { INDUSTRY_TEMPLATES } from '@/lib/seeds/industries'
import type { IndustryKey } from '@/lib/supabase/types'
import { MSG } from '@/lib/i18n/messages'
import { track, Events } from '@/lib/analytics/posthog'

export function Step2Industry() {
  const router = useRouter()
  const { industry, set } = useOnboarding()

  const pick = (key: IndustryKey) => {
    set('industry', key)
    if (key !== 'other') {
      const tpl = INDUSTRY_TEMPLATES[key]
      set('mission', tpl.mission)
      set('tone', tpl.tone)
    }
  }

  const next = () => {
    if (!industry) return
    track(Events.ONBOARDING_STEP_COMPLETED, { step: 2 })
    router.push('/onboarding/3')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{MSG.onboarding.step2Title}</h1>
        <p className="text-gray-500 text-sm mt-1">선택하신 업종에 맞게 AI가 톤을 맞춰 일해요</p>
      </div>
      <IndustryPicker value={industry} onChange={pick} />
      <div className="flex justify-between">
        <button onClick={() => router.push('/onboarding/1')} className="btn-secondary">{MSG.common.prev}</button>
        <button onClick={next} disabled={!industry} className="btn-primary">{MSG.common.next}</button>
      </div>
    </div>
  )
}
