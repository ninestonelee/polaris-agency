'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboarding } from '@/lib/onboarding/store'
import { findPreset } from '@/lib/seeds/agent-presets'
import { MSG } from '@/lib/i18n/messages'
import { track, Events } from '@/lib/analytics/posthog'

export function Step6Demo() {
  const router = useRouter()
  const { hiredAgentId, selectedRole } = useOnboarding()
  const [response, setResponse] = useState('')
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const startedRef = useRef(false)

  const preset = findPreset(selectedRole)

  const run = async () => {
    if (!hiredAgentId || startedRef.current) return
    startedRef.current = true
    setRunning(true)
    setResponse('')
    setErr(null)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: hiredAgentId, prompt: preset.sample_prompt }),
      })
      if (!res.ok || !res.body) {
        const json = await res.json().catch(() => ({ error: MSG.errors.unknown }))
        throw new Error(json.error)
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let accum = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = JSON.parse(line.slice(6))
          if (payload.type === 'delta') {
            accum += payload.delta
            setResponse(accum)
          } else if (payload.type === 'done') {
            setDone(true)
          } else if (payload.type === 'error') {
            throw new Error(payload.error)
          }
        }
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : MSG.errors.unknown)
      startedRef.current = false
    } finally {
      setRunning(false)
    }
  }

  const next = async () => {
    track(Events.ONBOARDING_STEP_COMPLETED, { step: 6 })
    router.push('/onboarding/7')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{MSG.onboarding.step6Title}</h1>
        <p className="text-gray-500 text-sm mt-1">{preset.name}에게 첫 작업을 시켜볼게요</p>
      </div>

      <div className="card bg-gray-50">
        <p className="text-sm text-gray-500 mb-1">요청</p>
        <p className="font-medium">{preset.sample_prompt}</p>
      </div>

      {!response && !running && !err && (
        <button onClick={run} className="btn-primary w-full py-3">
          ▶️ 샘플 작업 실행하기
        </button>
      )}

      {(response || running) && (
        <div className="card">
          <p className="text-sm text-gray-500 mb-2">{preset.name}의 응답</p>
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {response || MSG.task.streaming}
          </div>
        </div>
      )}

      {err && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
          <p className="font-medium">{MSG.common.error}</p>
          <p className="text-sm mt-1">{err}</p>
          <button onClick={run} className="mt-2 text-sm underline">{MSG.common.retry}</button>
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={() => router.push('/onboarding/5')} className="btn-secondary">{MSG.common.prev}</button>
        <button onClick={next} disabled={!done && !err} className="btn-primary">
          {MSG.common.next}
        </button>
      </div>
    </div>
  )
}
