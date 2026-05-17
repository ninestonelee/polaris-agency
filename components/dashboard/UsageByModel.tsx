'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatKRW } from '@/lib/format'

interface ModelData {
  model: string
  tasks: number
  krw: number
  tokens: number
}

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

const MODEL_LABELS: Record<string, string> = {
  'gpt-4o': 'GPT-4o',
  'gpt-4o-mini': 'GPT-4o Mini',
  'claude-3-5-sonnet-latest': 'Claude 3.5 Sonnet',
  'claude-3-5-haiku-latest': 'Claude 3.5 Haiku',
}

function shortLabel(model: string) {
  return MODEL_LABELS[model] ?? model
}

export function UsageByModel() {
  const [data, setData] = useState<ModelData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/usage/summary?range=month')
      .then((r) => r.json())
      .then((d) => setData(d.byModel ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="card text-gray-400">차트 불러오는 중…</div>
  if (data.length === 0) {
    return <div className="card text-center text-gray-400 py-8">아직 사용 기록이 없어요</div>
  }

  const chartData = data.map((d) => ({ name: shortLabel(d.model), value: d.krw }))

  return (
    <div className="card">
      <h3 className="font-semibold mb-3">모델별 사용 비율</h3>
      <div className="flex items-center gap-4">
        <div className="w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={55}
                innerRadius={30}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatKRW(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex-1 space-y-1.5 text-sm">
          {data.map((d, i) => (
            <li key={d.model} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="flex-1 truncate">{shortLabel(d.model)}</span>
              <span className="text-gray-500">{formatKRW(d.krw)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
