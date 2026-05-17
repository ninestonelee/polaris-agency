import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Range = 'today' | 'month'

function rangeStart(range: Range): string {
  const now = new Date()
  if (range === 'today') {
    now.setHours(0, 0, 0, 0)
  } else {
    now.setDate(1)
    now.setHours(0, 0, 0, 0)
  }
  return now.toISOString()
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const range = (searchParams.get('range') ?? 'today') as Range

  const { data: logs, error } = await supabase
    .from('usage_logs')
    .select('model, input_tokens, output_tokens, cost_krw, created_at')
    .eq('user_id', user.id)
    .gte('created_at', rangeStart(range))
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const totalKrw = logs.reduce((s, l) => s + Number(l.cost_krw), 0)
  const totalTokens = logs.reduce((s, l) => s + l.input_tokens + l.output_tokens, 0)
  const totalTasks = logs.length

  // 모델별 그룹
  const byModelMap = new Map<string, { tasks: number; krw: number; tokens: number }>()
  for (const l of logs) {
    const cur = byModelMap.get(l.model) ?? { tasks: 0, krw: 0, tokens: 0 }
    cur.tasks += 1
    cur.krw += Number(l.cost_krw)
    cur.tokens += l.input_tokens + l.output_tokens
    byModelMap.set(l.model, cur)
  }
  const byModel = Array.from(byModelMap.entries()).map(([model, v]) => ({ model, ...v }))

  // 일별 그룹 (최근 30일, range=month 기준)
  const byDayMap = new Map<string, number>()
  for (const l of logs) {
    const day = l.created_at.slice(0, 10)
    byDayMap.set(day, (byDayMap.get(day) ?? 0) + Number(l.cost_krw))
  }
  const byDay = Array.from(byDayMap.entries())
    .map(([day, krw]) => ({ day, krw }))
    .sort((a, b) => (a.day < b.day ? -1 : 1))

  // 어제 대비 비교 (range=today일 때만)
  let yesterdayKrw: number | null = null
  let changePercent: number | null = null
  if (range === 'today') {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    const yesterdayEnd = new Date(yesterday)
    yesterdayEnd.setHours(23, 59, 59, 999)

    const { data: yLogs } = await supabase
      .from('usage_logs')
      .select('cost_krw')
      .eq('user_id', user.id)
      .gte('created_at', yesterday.toISOString())
      .lte('created_at', yesterdayEnd.toISOString())

    if (yLogs) {
      yesterdayKrw = yLogs.reduce((s, l) => s + Number(l.cost_krw), 0)
      changePercent = yesterdayKrw > 0
        ? Math.round(((totalKrw - yesterdayKrw) / yesterdayKrw) * 100)
        : totalKrw > 0 ? 100 : 0
    }
  }

  return NextResponse.json({
    range,
    totalKrw: Number(totalKrw.toFixed(2)),
    totalTokens,
    totalTasks,
    byModel,
    byDay,
    ...(range === 'today' && { yesterdayKrw, changePercent }),
  })
}
