'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboarding } from '@/lib/onboarding/store'
import { AGENT_PRESETS } from '@/lib/seeds/agent-presets'
import type { AgentRoleKey } from '@/lib/supabase/types'
import { MSG } from '@/lib/i18n/messages'
import { track, Events } from '@/lib/analytics/posthog'

export function Step5Agent() {
  const router = useRouter()
  const { selectedRole, companyName, mission, tone, industry, set } = useOnboarding()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const next = async () => {
    if (!companyName || !industry) {
      setErr('회사 정보가 부족해요. 3단계로 돌아가주세요')
      return
    }
    setBusy(true)
    setErr(null)

    // 회사 생성 (서버가 에이전트 8명 자동 시드)
    const compRes = await fetch('/api/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: companyName, industry, mission, tone }),
    })
    const compJson = await compRes.json()
    if (!compRes.ok) {
      setBusy(false)
      setErr(compJson.error ?? MSG.errors.unknown)
      return
    }
    set('companyId', compJson.company.id)

    // 선택된 역할 에이전트 고용
    const agentsRes = await fetch(`/api/agents?company_id=${compJson.company.id}`)
    const agentsJson = await agentsRes.json()
    const target = agentsJson.agents.find((a: any) => a.role === selectedRole)
    if (!target) {
      setBusy(false)
      setErr(MSG.errors.unknown)
      return
    }
    await fetch(`/api/agents/${target.id}/hire`, { method: 'POST' })
    set('hiredAgentId', target.id)

    track(Events.COMPANY_CREATED, { industry })
    track(Events.AGENT_HIRED, { role: selectedRole, model: target.recommended_model })
    track(Events.ONBOARDING_STEP_COMPLETED, { step: 5 })
    setBusy(false)
    router.push('/onboarding/6')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{MSG.onboarding.step5Title}</h1>
        <p className="text-gray-500 text-sm mt-1">언제든 다른 직원도 고용할 수 있어요</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {AGENT_PRESETS.map((p) => {
          const sel = selectedRole === p.role
          return (
            <button
              key={p.role}
              onClick={() => set('selectedRole', p.role as AgentRoleKey)}
              className={`card text-center transition-all ${sel ? 'ring-2 ring-polaris-500 bg-polaris-50' : ''}`}
            >
              <div className="text-3xl mb-1">{p.emoji}</div>
              <div className="font-semibold text-sm">{p.name}</div>
              <div className="text-[10px] text-gray-500 mt-1">{p.description}</div>
            </button>
          )
        })}
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="flex justify-between">
        <button onClick={() => router.push('/onboarding/4')} className="btn-secondary">{MSG.common.prev}</button>
        <button onClick={next} disabled={busy} className="btn-primary">
          {busy ? MSG.common.loading : '고용하고 다음'}
        </button>
      </div>
    </div>
  )
}
