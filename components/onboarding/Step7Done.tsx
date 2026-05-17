'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboarding } from '@/lib/onboarding/store'
import { MSG } from '@/lib/i18n/messages'
import { track, Events } from '@/lib/analytics/posthog'

export function Step7Done() {
  const router = useRouter()
  const { reset } = useOnboarding()
  const [saving, setSaving] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/auth/onboarding-complete', { method: 'POST' })
      .then((r) => {
        if (!r.ok) throw new Error('failed')
        if (cancelled) return
        track(Events.ONBOARDING_COMPLETED, {})
        setSaving(false)
      })
      .catch(() => {
        if (cancelled) return
        setErr(MSG.errors.unknown)
        setSaving(false)
      })
    return () => { cancelled = true }
  }, [])

  const go = () => {
    reset()
    router.push('/dashboard')
  }

  return (
    <div className="text-center space-y-6">
      <div className="text-6xl">🎉</div>
      <div>
        <h1 className="text-2xl font-bold mb-2">{MSG.onboarding.step7Title}</h1>
        <p className="text-gray-600">
          AI 직원이 일하는 폴라리스 에이전시에 오신 걸 환영합니다.
          <br />
          이제 자유롭게 작업을 시켜보세요.
        </p>
      </div>

      {saving && <p className="text-sm text-gray-400">{MSG.common.loading}</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      <button onClick={go} disabled={saving} className="btn-primary py-3 px-8 text-lg">
        {MSG.onboarding.completeCta}
      </button>
    </div>
  )
}
