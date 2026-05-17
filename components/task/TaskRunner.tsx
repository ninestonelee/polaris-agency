'use client'

import { useState, useRef, useCallback } from 'react'
import { MSG } from '@/lib/i18n/messages'
import { formatKRWPrecise, formatNumber, formatDuration, formatRelativeTime } from '@/lib/format'
import { track, Events } from '@/lib/analytics/posthog'

interface Props {
  agentId: string
  agentName: string
  samplePrompt: string
}

interface RunResult {
  response: string
  usage?: { inputTokens: number; outputTokens: number; model: string }
  cost?: { usd: number; krw: number }
  durationMs?: number
  error?: string
}

interface PastTask {
  id: string
  prompt: string
  response: string
  created_at: string
  agent_name: string
  agent_emoji: string
}

export function TaskRunner({ agentId, agentName, samplePrompt }: Props) {
  const [prompt, setPrompt] = useState('')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<RunResult>({ response: '' })
  const startRef = useRef(0)

  // 이전 작업 불러오기
  const [showPastTasks, setShowPastTasks] = useState(false)
  const [pastTasks, setPastTasks] = useState<PastTask[]>([])
  const [loadingPast, setLoadingPast] = useState(false)

  const loadPastTasks = useCallback(async () => {
    if (showPastTasks) { setShowPastTasks(false); return }
    setLoadingPast(true)
    try {
      const res = await fetch('/api/tasks/recent')
      if (res.ok) {
        const data = await res.json()
        setPastTasks(data.tasks ?? [])
      }
    } catch { /* ignore */ }
    setLoadingPast(false)
    setShowPastTasks(true)
  }, [showPastTasks])

  const insertPastResult = (task: PastTask) => {
    const ref = `[${task.agent_emoji} ${task.agent_name}의 작업 결과]\n${task.response}\n\n---\n위 내용을 바탕으로 `
    setPrompt(prev => ref + prev)
    setShowPastTasks(false)
  }

  const useSample = () => setPrompt(samplePrompt)

  const run = async () => {
    if (!prompt.trim()) return
    setRunning(true)
    setResult({ response: '' })
    startRef.current = Date.now()

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, prompt }),
      })

      if (!res.ok || !res.body) {
        const json = await res.json().catch(() => ({ error: MSG.errors.unknown }))
        setResult({ response: '', error: json.error })
        track(Events.TASK_ERROR, { error_type: json.error })
        setRunning(false)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let accum = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = JSON.parse(line.slice(6))
          if (payload.type === 'delta') {
            accum += payload.delta
            setResult({ response: accum })
          } else if (payload.type === 'done') {
            const duration = Date.now() - startRef.current
            setResult({ response: accum, usage: payload.usage, cost: payload.cost, durationMs: duration })
            track(Events.TASK_EXECUTED, {
              model: payload.usage?.model,
              latency_ms: duration,
              tokens: (payload.usage?.inputTokens ?? 0) + (payload.usage?.outputTokens ?? 0),
            })
          } else if (payload.type === 'error') {
            setResult({ response: accum, error: payload.error })
            track(Events.TASK_ERROR, { error_type: payload.error })
          }
        }
      }
    } catch (err) {
      setResult({ response: '', error: MSG.errors.network })
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium">{agentName}에게 시킬 일</label>
          <button
            type="button"
            onClick={loadPastTasks}
            disabled={loadingPast}
            className="text-xs text-polaris-600 hover:text-polaris-700 flex items-center gap-1"
          >
            📋 {loadingPast ? '불러오는 중…' : showPastTasks ? '닫기' : '이전 작업 불러오기'}
          </button>
        </div>

        {showPastTasks && (
          <div className="border border-polaris-200 rounded-lg mb-2 max-h-60 overflow-y-auto bg-gray-50">
            {pastTasks.length === 0 ? (
              <p className="p-3 text-sm text-gray-400 text-center">아직 완료된 작업이 없어요</p>
            ) : (
              pastTasks.map(t => (
                <button
                  key={t.id}
                  onClick={() => insertPastResult(t)}
                  className="w-full text-left p-3 hover:bg-polaris-50 border-b border-gray-100 last:border-0 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{t.agent_emoji}</span>
                    <span className="text-xs font-semibold text-gray-600">{t.agent_name}</span>
                    <span className="text-[10px] text-gray-400 ml-auto">{formatRelativeTime(t.created_at)}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{t.response.slice(0, 120)}{t.response.length > 120 ? '…' : ''}</p>
                </button>
              ))
            )}
          </div>
        )}

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={MSG.task.promptPlaceholder}
          rows={4}
          className="input resize-y"
        />
        <div className="flex justify-between items-center mt-1">
          <button type="button" onClick={useSample} className="text-xs text-polaris-600 underline">
            {MSG.task.sample}
          </button>
          <button onClick={run} disabled={running || !prompt.trim()} className="btn-primary">
            {running ? MSG.task.streaming : MSG.task.execute}
          </button>
        </div>
      </div>

      {(result.response || result.error) && (
        <div className="border rounded-lg bg-white p-4 space-y-3">
          {result.response && (
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{result.response}</div>
          )}
          {result.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
              <p className="font-medium">{MSG.common.error}</p>
              <p className="text-sm mt-1">{result.error}</p>
              <button onClick={run} className="mt-2 text-sm underline">
                {MSG.common.retry}
              </button>
            </div>
          )}
          {result.usage && result.cost && (
            <div className="text-xs text-gray-500 border-t pt-2 flex flex-wrap gap-3">
              <span>모델: {result.usage.model}</span>
              <span>토큰: {formatNumber(result.usage.inputTokens + result.usage.outputTokens)}</span>
              <span>비용: {formatKRWPrecise(result.cost.krw)}</span>
              {result.durationMs && <span>소요: {formatDuration(result.durationMs)}</span>}
            </div>
          )}
          {result.response && !running && (
            <div className="border-t pt-2 mt-2">
              <button
                onClick={() => {
                  const text = result.response
                  navigator.clipboard.writeText(text)
                }}
                className="text-xs text-gray-400 hover:text-gray-600 mr-4"
              >
                📋 결과 복사
              </button>
              <a
                href="/agents"
                className="text-xs text-polaris-600 hover:text-polaris-700"
              >
                🔄 다른 직원에게 넘기기 →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
