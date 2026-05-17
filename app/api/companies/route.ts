import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AGENT_PRESETS } from '@/lib/seeds/agent-presets'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ companies: data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, industry, mission, tone } = body
  if (!name || !industry) {
    return NextResponse.json({ error: 'name과 industry는 필수입니다' }, { status: 400 })
  }

  const { data: company, error } = await supabase
    .from('companies')
    .insert({ owner_id: user.id, name, industry, mission, tone })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 8개 에이전트 프리셋 자동 시드 (is_hired=false)
  const agentRows = AGENT_PRESETS.map((p) => ({
    company_id: company.id,
    role: p.role,
    name: p.name,
    recommended_model: p.recommended_model,
    is_hired: false,
  }))
  await supabase.from('agents').insert(agentRows)

  return NextResponse.json({ company })
}
