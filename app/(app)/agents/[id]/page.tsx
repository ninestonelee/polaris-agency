import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TaskRunner } from '@/components/task/TaskRunner'
import { findPreset } from '@/lib/seeds/agent-presets'
import type { AgentRoleKey } from '@/lib/supabase/types'
import { formatRelativeTime } from '@/lib/format'

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: agent } = await supabase.from('agents').select('*').eq('id', id).maybeSingle()

  if (!agent) return notFound()

  const preset = findPreset(agent.role as AgentRoleKey)

  const { data: recentTasks } = await supabase
    .from('tasks')
    .select('id, prompt, response, status, created_at')
    .eq('agent_id', id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link href="/agents" className="text-sm text-gray-500 hover:text-gray-700">← 직원 목록으로</Link>

      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{preset.emoji}</div>
            <div>
              <h1 className="text-2xl font-bold">{agent.name}</h1>
              <p className="text-sm text-gray-500">{preset.description}</p>
            </div>
          </div>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{agent.recommended_model}</span>
        </div>
      </div>

      <TaskRunner agentId={agent.id} agentName={agent.name} samplePrompt={preset.sample_prompt} />

      {recentTasks && recentTasks.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">최근 작업</h2>
          <div className="space-y-3">
            {recentTasks.map((t) => (
              <details key={t.id} className="card">
                <summary className="cursor-pointer">
                  <span className="font-medium">{t.prompt.slice(0, 60)}{t.prompt.length > 60 ? '…' : ''}</span>
                  <span className="ml-2 text-xs text-gray-400">{formatRelativeTime(t.created_at)}</span>
                </summary>
                <div className="mt-3 text-sm whitespace-pre-wrap text-gray-700">
                  {t.response ?? '(응답 없음)'}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
