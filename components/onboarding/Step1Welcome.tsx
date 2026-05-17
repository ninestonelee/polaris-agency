'use client'

import { useRouter } from 'next/navigation'
import { MSG } from '@/lib/i18n/messages'
import { track, Events } from '@/lib/analytics/posthog'

export function Step1Welcome() {
  const router = useRouter()
  const next = () => {
    track(Events.ONBOARDING_STEP_COMPLETED, { step: 1 })
    router.push('/onboarding/2')
  }
  return (
    <div className="text-center space-y-6">
      <div className="text-6xl">⭐</div>
      <div>
        <h1 className="text-2xl font-bold mb-2">{MSG.onboarding.step1Title}</h1>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {MSG.onboarding.step1Body}
        </p>
      </div>
      <button onClick={next} className="btn-primary py-3 px-8 text-lg">
        시작하기
      </button>
    </div>
  )
}
