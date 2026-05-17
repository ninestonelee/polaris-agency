'use client'

import { useEffect, useState } from 'react'
import { formatKRW, formatNumber } from '@/lib/format'
import { MSG } from '@/lib/i18n/messages'

interface Summary {
  totalKrw: number
  totalTokens: number
  totalTasks: number
  changePercent?: number | null
}

interface Props {
  range: 'today' | 'month'
  label: string
}

export function UsageCard({ range, label }: Props) {
  const [data, setData] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/usage/summary?range=${range}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false))
  }, [range])

  return (
    <div className="card">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      {loading ? (
        <p className="text-2xl font-bold text-gray-300">{MSG.common.loading}</p>
      ) : data && data.totalTasks > 0 ? (
        <>
          <p className="text-3xl font-bold">
            {formatKRW(data.totalKrw)}
            {data.changePercent != null && data.changePercent !== 0 && (
              <span className={`text-sm ml-2 ${data.changePercent > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {data.changePercent > 0 ? '↑' : '↓'}{Math.abs(data.changePercent)}%
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatNumber(data.totalTasks)}회 작업 · {formatNumber(data.totalTokens)} 토큰
            {data.changePercent != null && <span> · 어제 대비</span>}
          </p>
        </>
      ) : (
        <>
          <p className="text-3xl font-bold text-gray-300">₩0</p>
          <p className="text-xs text-gray-500 mt-1">{MSG.usage.emptyMessage}</p>
        </>
      )}
    </div>
  )
}
