'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { MSG } from '@/lib/i18n/messages'
import { formatKRWPrecise, formatDuration } from '@/lib/format'

/* ── 타입 ── */

interface Agent {
  id: string
  name: string
  role: string
  recommended_model: string
  is_hired: boolean
}

interface RelayStep {
  agentId: string
  instruction: string // 이 직원에게 시킬 추가 지시
}

interface StepResult {
  status: 'pending' | 'running' | 'done' | 'error'
  response: string
  error?: string
  cost?: { krw: number }
  durationMs?: number
}

const EMOJI: Record<string, string> = {
  ceo: '⭐', marketer: '🌙', writer: '✍️', editor: '📝',
  designer: '🎨', sales: '💼', support: '💬', analyst: '📊',
}

/* ── 프리셋 릴레이 ── */

const RELAY_PRESETS = [
  {
    name: '콘텐츠 생산 라인',
    desc: '기획 → 작성 → 교정 → 비주얼',
    roles: ['ceo', 'writer', 'editor', 'designer'],
    instructions: [
      '이번 주 블로그 주제 3개를 추천해줘. 각각 타겟 독자와 핵심 메시지 포함.',
      '위 주제 중 1번으로 블로그 글을 써줘. 2,000자, SEO 키워드 포함.',
      '위 글을 다듬어줘. 톤은 따뜻하고 캐주얼하게. 긴 문장은 잘라줘.',
      '위 블로그 글에 어울리는 썸네일 컨셉을 제안해줘. 색상, 텍스트, 분위기.',
    ],
  },
  {
    name: '마케팅 캠페인',
    desc: '전략 → SNS 카피 → 이메일',
    roles: ['ceo', 'marketer', 'writer'],
    instructions: [
      '여름 세일 30% 프로모션의 마케팅 전략을 잡아줘. 타겟, 채널, 핵심 메시지.',
      '위 전략을 바탕으로 인스타 피드 카피 3종 + 해시태그를 써줘.',
      '같은 프로모션으로 이메일 뉴스레터 본문을 써줘. 제목 3가지 포함.',
    ],
  },
  {
    name: 'CS 자동화',
    desc: 'FAQ 작성 → 교정 → 전략 리뷰',
    roles: ['support', 'editor', 'ceo'],
    instructions: [
      '우리 쇼핑몰의 자주 묻는 질문 10개와 답변을 작성해줘.',
      '위 FAQ의 톤을 통일하고 맞춤법을 교정해줘. 정중하지만 친근하게.',
      '위 FAQ를 검토하고, 빠진 질문이나 개선할 점을 제안해줘.',
    ],
  },
  {
    name: '데이터→전략→실행',
    desc: '분석 → 전략 → 마케팅 실행',
    roles: ['analyst', 'ceo', 'marketer'],
    instructions: [
      '이번 달 매출이 전월 대비 20% 증가했어. 가능한 원인 분석과 성장 기회 3개를 뽑아줘.',
      '위 분석 중 1번 기회를 실행 계획으로 바꿔줘. 구체적 액션 아이템 포함.',
      '위 실행 계획에서 SNS 마케팅 부분을 인스타 캠페인 카피로 만들어줘.',
    ],
  },
]

/* ── 메인 컴포넌트 ── */

export default function RelayPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [steps, setSteps] = useState<RelayStep[]>([{ agentId: '', instruction: '' }, { agentId: '', instruction: '' }])
  const [results, setResults] = useState<StepResult[]>([])
  const [running, setRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const abortRef = useRef(false)

  // 에이전트 목록 로드
  useEffect(() => {
    fetch('/api/agents').then(r => r.json()).then(d => setAgents(d.agents ?? d ?? []))
  }, [])

  const hiredAgents = agents.filter(a => a.is_hired)

  const findAgent = (id: string) => agents.find(a => a.id === id)

  // 프리셋 적용
  const applyPreset = (preset: typeof RELAY_PRESETS[number]) => {
    const newSteps: RelayStep[] = preset.roles.map((role, i) => {
      const agent = hiredAgents.find(a => a.role === role)
      return { agentId: agent?.id ?? '', instruction: preset.instructions[i] }
    })
    setSteps(newSteps)
    setResults([])
    setCurrentStep(-1)
  }

  // 스텝 추가/제거
  const addStep = () => setSteps(s => [...s, { agentId: '', instruction: '' }])
  const removeStep = (i: number) => setSteps(s => s.filter((_, idx) => idx !== i))
  const updateStep = (i: number, patch: Partial<RelayStep>) => {
    setSteps(s => s.map((step, idx) => idx === i ? { ...step, ...patch } : step))
  }

  // 릴레이 실행
  const runRelay = useCallback(async () => {
    const valid = steps.every(s => s.agentId && s.instruction.trim())
    if (!valid) return

    setRunning(true)
    abortRef.current = false
    const newResults: StepResult[] = steps.map(() => ({ status: 'pending', response: '' }))
    setResults([...newResults])

    let prevOutput = ''

    for (let i = 0; i < steps.length; i++) {
      if (abortRef.current) break
      setCurrentStep(i)
      newResults[i] = { status: 'running', response: '' }
      setResults([...newResults])

      const prompt = i === 0
        ? steps[i].instruction
        : `[이전 직원의 작업 결과]\n${prevOutput}\n\n---\n${steps[i].instruction}`

      const start = Date.now()

      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId: steps[i].agentId, prompt }),
        })

        if (!res.ok || !res.body) {
          const json = await res.json().catch(() => ({ error: MSG.errors.unknown }))
          newResults[i] = { status: 'error', response: '', error: json.error }
          setResults([...newResults])
          break
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let accum = ''
        let cost: { krw: number } | undefined

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            try {
              const payload = JSON.parse(line.slice(6))
              if (payload.type === 'delta') {
                accum += payload.delta
                newResults[i] = { status: 'running', response: accum }
                setResults([...newResults])
              } else if (payload.type === 'done') {
                cost = payload.cost
              } else if (payload.type === 'error') {
                newResults[i] = { status: 'error', response: accum, error: payload.error }
                setResults([...newResults])
              }
            } catch { /* skip bad json */ }
          }
        }

        const duration = Date.now() - start
        if (newResults[i].status !== 'error') {
          newResults[i] = { status: 'done', response: accum, cost, durationMs: duration }
          setResults([...newResults])
        }
        prevOutput = accum

      } catch {
        newResults[i] = { status: 'error', response: '', error: MSG.errors.network }
        setResults([...newResults])
        break
      }
    }

    setCurrentStep(-1)
    setRunning(false)
  }, [steps])

  const stop = () => { abortRef.current = true }

  const totalCost = results.reduce((s, r) => s + (r.cost?.krw ?? 0), 0)
  const totalTime = results.reduce((s, r) => s + (r.durationMs ?? 0), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">릴레이 실행</h1>
        <p className="text-sm text-gray-500 mt-1">여러 직원이 순서대로 협업합니다. 이전 결과가 자동으로 다음 직원에게 전달됩니다.</p>
      </div>

      {/* 프리셋 */}
      {!running && results.length === 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">추천 릴레이</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RELAY_PRESETS.map(p => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className="card text-left hover:border-polaris-300 transition-colors"
              >
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="text-xs text-gray-400 mt-1">{p.desc}</p>
                <div className="flex gap-1 mt-2">
                  {p.roles.map(r => <span key={r} className="text-sm">{EMOJI[r]}</span>)}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 스텝 설정 */}
      {!running && results.length === 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-600">릴레이 순서 설정</h2>
          {steps.map((step, i) => {
            const agent = findAgent(step.agentId)
            return (
              <div key={i} className="card flex gap-3 items-start">
                <div className="flex flex-col items-center gap-1">
                  <span className="w-7 h-7 rounded-full bg-polaris-100 text-polaris-600 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                  {i < steps.length - 1 && <div className="w-0.5 h-6 bg-polaris-100" />}
                </div>
                <div className="flex-1 space-y-2">
                  <select
                    value={step.agentId}
                    onChange={e => updateStep(i, { agentId: e.target.value })}
                    className="input text-sm"
                  >
                    <option value="">직원 선택…</option>
                    {hiredAgents.map(a => (
                      <option key={a.id} value={a.id}>{EMOJI[a.role]} {a.name}</option>
                    ))}
                  </select>
                  <textarea
                    value={step.instruction}
                    onChange={e => updateStep(i, { instruction: e.target.value })}
                    placeholder={i === 0 ? '첫 번째 직원에게 시킬 일…' : '이전 결과를 받아서 할 일…'}
                    rows={2}
                    className="input text-sm resize-y"
                  />
                  {agent && (
                    <p className="text-[10px] text-gray-400">{agent.recommended_model}</p>
                  )}
                </div>
                {steps.length > 2 && (
                  <button onClick={() => removeStep(i)} className="text-gray-300 hover:text-red-400 text-lg mt-1">×</button>
                )}
              </div>
            )
          })}
          <div className="flex gap-2">
            {steps.length < 6 && (
              <button onClick={addStep} className="btn-secondary text-sm">+ 직원 추가</button>
            )}
            <button
              onClick={runRelay}
              disabled={!steps.every(s => s.agentId && s.instruction.trim())}
              className="btn-primary text-sm"
            >
              릴레이 시작
            </button>
          </div>
        </section>
      )}

      {/* 실행 결과 */}
      {results.length > 0 && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-600">실행 결과</h2>
            {running && (
              <button onClick={stop} className="text-xs text-red-500 hover:text-red-700">중단</button>
            )}
          </div>

          {results.map((r, i) => {
            const agent = findAgent(steps[i]?.agentId)
            return (
              <div
                key={i}
                className={`border rounded-xl overflow-hidden transition-all ${
                  r.status === 'running' ? 'border-polaris-300 shadow-md' :
                  r.status === 'done' ? 'border-green-200' :
                  r.status === 'error' ? 'border-red-200' : 'border-gray-100 opacity-50'
                }`}
              >
                {/* 스텝 헤더 */}
                <div className={`px-4 py-2 flex items-center gap-2 text-sm ${
                  r.status === 'running' ? 'bg-polaris-50' :
                  r.status === 'done' ? 'bg-green-50' :
                  r.status === 'error' ? 'bg-red-50' : 'bg-gray-50'
                }`}>
                  <span className="w-6 h-6 rounded-full bg-white text-xs flex items-center justify-center font-bold border">{i + 1}</span>
                  <span className="text-lg">{agent ? EMOJI[agent.role] : '🤖'}</span>
                  <span className="font-semibold">{agent?.name ?? '직원'}</span>
                  {r.status === 'running' && <span className="text-xs text-polaris-600 animate-pulse ml-auto">실행 중…</span>}
                  {r.status === 'done' && r.cost && (
                    <span className="text-xs text-gray-400 ml-auto">
                      {formatKRWPrecise(r.cost.krw)} · {r.durationMs ? formatDuration(r.durationMs) : ''}
                    </span>
                  )}
                  {r.status === 'done' && <span className="text-green-500 text-xs ml-1">✓</span>}
                </div>

                {/* 지시 내용 */}
                <div className="px-4 py-2 bg-gray-50 border-b text-xs text-gray-500">
                  {steps[i]?.instruction}
                </div>

                {/* 응답 */}
                {(r.response || r.error) && (
                  <div className="px-4 py-3">
                    {r.response && (
                      <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed max-h-64 overflow-y-auto">
                        {r.response}
                      </div>
                    )}
                    {r.error && (
                      <p className="text-sm text-red-600">{r.error}</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* 총 비용 */}
          {!running && results.some(r => r.status === 'done') && (
            <div className="card text-center">
              <p className="text-sm text-gray-600">
                총 비용: <strong className="text-polaris-600">{formatKRWPrecise(totalCost)}</strong>
                {totalTime > 0 && <span className="text-gray-400 ml-2">· 총 {formatDuration(totalTime)}</span>}
              </p>
            </div>
          )}

          {/* 리셋 */}
          {!running && (
            <div className="flex gap-2 justify-center">
              <button onClick={() => { setResults([]); setCurrentStep(-1) }} className="btn-secondary text-sm">
                다시 설정하기
              </button>
              <Link href="/dashboard" className="btn-primary text-sm inline-block">
                대시보드로
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
