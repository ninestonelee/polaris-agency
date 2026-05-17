import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function verifyOwnership(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, agentId: string) {
  const { data: agent } = await supabase
    .from('agents')
    .select('id, company:companies!inner(owner_id)')
    .eq('id', agentId)
    .single()

  if (!agent) return { ok: false as const, status: 404, error: '에이전트를 찾을 수 없습니다' }
  const company = agent.company as unknown as { owner_id: string }
  if (company.owner_id !== userId) return { ok: false as const, status: 403, error: '권한이 없습니다' }
  return { ok: true as const }
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const check = await verifyOwnership(supabase, user.id, id)
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status })

  const { data, error } = await supabase
    .from('agents')
    .update({ is_hired: true, hired_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ agent: data })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const check = await verifyOwnership(supabase, user.id, id)
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status })

  const { error } = await supabase
    .from('agents')
    .update({ is_hired: false, hired_at: null })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
