import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('id, prompt, response, status, created_at, agent:agents(name, role)')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .not('response', 'is', null)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const EMOJI_MAP: Record<string, string> = {
    ceo: '⭐', marketer: '🌙', writer: '✍️', editor: '📝',
    designer: '🎨', sales: '💼', support: '💬', analyst: '📊',
  }

  const formatted = (tasks ?? []).map(t => {
    const agent = t.agent as unknown as { name: string; role: string } | null
    return {
      id: t.id,
      prompt: t.prompt,
      response: t.response ?? '',
      created_at: t.created_at,
      agent_name: agent?.name ?? '알 수 없음',
      agent_emoji: agent ? (EMOJI_MAP[agent.role] ?? '🤖') : '🤖',
    }
  })

  return NextResponse.json({ tasks: formatted })
}
