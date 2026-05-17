'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Agent } from '@/lib/supabase/types'
import { findPreset } from '@/lib/seeds/agent-presets'
import { MSG } from '@/lib/i18n/messages'
import { track, Events } from '@/lib/analytics/posthog'

interface Props {
  agent: Agent
  onChanged?: (a: Agent) => void
}

export function AgentCard({ agent, onChanged }: Props) {
  const preset = findPreset(agent.role)
  const [busy, setBusy] = useState(false)

  const hire = async () => {
    setBusy(true)
    const res = await fetch(`/api/agents/${agent.id}/hire`, { method: 'POST' })
    const json = await res.json()
    setBusy(false)
    if (json.agent) {
      onChanged?.(json.agent)
      track(Events.AGENT_HIRED, { role: agent.role, model: agent.recommended_model })
    }
  }

  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-start justify-between mb-2">
        <div className="text-3xl">{preset.emoji}</div>
        {agent.is_hired && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            ✅ {MSG.agents.hired}
          </span>
        )}
      </div>
      <h3 className="font-bold text-lg">{agent.name}</h3>
      <p className="text-sm text-gray-500 mb-3 flex-1">{preset.description}</p>
      <p className="text-xs text-gray-400 mb-3">추천 모델: {agent.recommended_model}</p>

      {agent.is_hired ? (
        <Link href={`/agents/${agent.id}`} className="btn-secondary text-center">
          작업 시키기 →
        </Link>
      ) : (
        <button onClick={hire} disabled={busy} className="btn-primary">
          {busy ? MSG.common.loading : MSG.agents.hire}
        </button>
      )}
    </div>
  )
}
