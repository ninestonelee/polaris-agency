import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { openai, anthropic } = await request.json()
  const updates: { openai_key?: string | null; anthropic_key?: string | null } = {}
  if (openai !== undefined) updates.openai_key = openai
  if (anthropic !== undefined) updates.anthropic_key = anthropic

  const { error } = await supabase.from('users').update(updates).eq('id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
