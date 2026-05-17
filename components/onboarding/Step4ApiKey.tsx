'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboarding } from '@/lib/onboarding/store'
import { MSG } from '@/lib/i18n/messages'
import { track, Events } from '@/lib/analytics/posthog'

export function Step4ApiKey() {
  const router = useRouter()
  const { openaiKey, anthropicKey, set } = useOnboarding()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const next = async () => {
    if (!openaiKey.trim() && !anthropicKey.trim()) {
      setErr('OpenAI 또는 Anthropic 키 중 하나는 필요해요')
      return
    }
    setBusy(true)
    setErr(null)
    // 사용자 프로필에 키 저장
    try {
      const res = await fetch('/api/auth/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openai: openaiKey || null, anthropic: anthropicKey || null }),
      })
      setBusy(false)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        const detail = body.error || `HTTP ${res.status}`
        console.error('[Step4] API 키 저장 실패:', detail)
        setErr(`API 키 저장 실패: ${detail}`)
        return
      }
    } catch (e) {
      setBusy(false)
      const msg = e instanceof Error ? e.message : String(e)
      console.error('[Step4] 네트워크 에러:', msg)
      setErr(`네트워크 에러: ${msg}`)
      return
    }
    track(Events.ONBOARDING_STEP_COMPLETED, { step: 4 })
    router.push('/onboarding/5')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{MSG.onboarding.step4Title}</h1>
        <p className="text-gray-500 text-sm mt-1">키는 본인 계정에만 저장되고 외부로 새지 않아요</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">OpenAI API 키</label>
          <input
            type="password"
            value={openaiKey}
            onChange={(e) => set('openaiKey', e.target.value)}
            placeholder="sk-..."
            className="input font-mono text-sm"
          />
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" className="text-xs text-polaris-600 underline mt-1 inline-block">
            OpenAI에서 키 받기 →
          </a>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Anthropic API 키 (선택)</label>
          <input
            type="password"
            value={anthropicKey}
            onChange={(e) => set('anthropicKey', e.target.value)}
            placeholder="sk-ant-..."
            className="input font-mono text-sm"
          />
          <a href="https://console.anthropic.com" target="_blank" rel="noopener" className="text-xs text-polaris-600 underline mt-1 inline-block">
            Anthropic에서 키 받기 →
          </a>
        </div>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="flex justify-between">
        <button onClick={() => router.push('/onboarding/3')} className="btn-secondary">{MSG.common.prev}</button>
        <button onClick={next} disabled={busy} className="btn-primary">
          {busy ? MSG.common.loading : MSG.common.next}
        </button>
      </div>
    </div>
  )
}
