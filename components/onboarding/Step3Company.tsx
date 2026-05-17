'use client'

import { useRouter } from 'next/navigation'
import { useOnboarding } from '@/lib/onboarding/store'
import { MSG } from '@/lib/i18n/messages'
import { track, Events } from '@/lib/analytics/posthog'

export function Step3Company() {
  const router = useRouter()
  const { companyName, mission, tone, industry, set } = useOnboarding()

  const next = async () => {
    if (!companyName.trim() || !industry) return
    track(Events.ONBOARDING_STEP_COMPLETED, { step: 3 })
    router.push('/onboarding/4')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{MSG.onboarding.step3Title}</h1>
        <p className="text-gray-500 text-sm mt-1">AI가 회사의 정체성에 맞게 답변해요</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">회사 이름</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => set('companyName', e.target.value)}
            placeholder={MSG.company.namePlaceholder}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">미션 (한 줄)</label>
          <input
            type="text"
            value={mission}
            onChange={(e) => set('mission', e.target.value)}
            placeholder={MSG.company.missionPlaceholder}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">톤앤매너</label>
          <input
            type="text"
            value={tone}
            onChange={(e) => set('tone', e.target.value)}
            placeholder={MSG.company.tonePlaceholder}
            className="input"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={() => router.push('/onboarding/2')} className="btn-secondary">{MSG.common.prev}</button>
        <button onClick={next} disabled={!companyName.trim()} className="btn-primary">{MSG.common.next}</button>
      </div>
    </div>
  )
}
