'use client'

import { useEffect, useState } from 'react'
import { formatKRW } from '@/lib/format'

interface DayPoint { day: string; krw: number }

interface Props {
  range: 'today' | 'month'
}

export function UsageChart({ range }: Props) {
  const [days, setDays] = useState<DayPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/usage/summary?range=${range}`)
      .then((r) => r.json())
      .then((d) => setDays(d.byDay ?? []))
      .finally(() => setLoading(false))
  }, [range])

  if (loading) return <div className="card text-gray-400">차트 불러오는 중…</div>
  if (days.length === 0) {
    return <div className="card text-center text-gray-400 py-8">아직 사용 기록이 없어요</div>
  }

  const max = Math.max(...days.map((d) => d.krw))

  return (
    <div className="card">
      <h3 className="font-semibold mb-3">일별 사용량</h3>
      <div className="flex items-end gap-1 h-32">
        {days.map((d) => {
          const heightPct = max === 0 ? 0 : (d.krw / max) * 100
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center justify-end" title={`${d.day}: ${formatKRW(d.krw)}`}>
              <div
                className="w-full bg-polaris-400 rounded-t"
                style={{ height: `${heightPct}%`, minHeight: d.krw > 0 ? '4px' : '0' }}
              />
              <span className="text-[10px] text-gray-400 mt-1">{d.day.slice(5)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
