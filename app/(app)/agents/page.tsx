'use client'

import { useEffect, useState } from 'react'
import { AgentCard } from '@/components/agent/AgentCard'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Agent } from '@/lib/supabase/types'
import { MSG } from '@/lib/i18n/messages'

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/agents')
      .then((r) => r.json())
      .then((d) => setAgents(d.agents ?? []))
      .finally(() => setLoading(false))
  }, [])

  const updateAgent = (a: Agent) => {
    setAgents((list) => list.map((x) => (x.id === a.id ? a : x)))
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-8 text-gray-400">{MSG.common.loading}</div>
  }

  if (agents.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <EmptyState
          emoji="🏢"
          title="회사를 먼저 만들어주세요"
          description="직원은 회사에 소속됩니다. 회사 정보를 입력하고 직원을 고용해보세요."
          cta={{ label: '회사 만들기', href: '/onboarding/2' }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{MSG.agents.title}</h1>
        <p className="text-gray-500 text-sm mt-1">8명의 AI 직원이 당신의 회사를 도와드려요</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agents.map((a) => (
          <AgentCard key={a.id} agent={a} onChanged={updateAgent} />
        ))}
      </div>
    </div>
  )
}
