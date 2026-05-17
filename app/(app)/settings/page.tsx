'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MSG } from '@/lib/i18n/messages'

export default function SettingsPage() {
  const supabase = createClient()
  const [openaiKey, setOpenaiKey] = useState('')
  const [anthropicKey, setAnthropicKey] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('users')
        .select('openai_key, anthropic_key')
        .eq('id', user.id)
        .single()
      if (data) {
        setOpenaiKey(data.openai_key ?? '')
        setAnthropicKey(data.anthropic_key ?? '')
      }
      setLoading(false)
    }
    load()
  }, [supabase])

  const save = async () => {
    setBusy(true)
    setMsg(null)
    try {
      const res = await fetch('/api/auth/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openai: openaiKey || null, anthropic: anthropicKey || null }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setMsg({ type: 'err', text: body.error || `저장 실패 (${res.status})` })
      } else {
        setMsg({ type: 'ok', text: '저장 완료!' })
      }
    } catch (e) {
      setMsg({ type: 'err', text: e instanceof Error ? e.message : '네트워크 에러' })
    }
    setBusy(false)
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-gray-400">{MSG.common.loading}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">설정</h1>

      <section className="card space-y-4">
        <h2 className="font-semibold text-lg">API 키 관리</h2>
        <p className="text-sm text-gray-500">키는 본인 계정에만 저장되고 외부로 새지 않아요.</p>

        <div>
          <label className="block text-sm font-medium mb-1">OpenAI API 키</label>
          <input
            type="password"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            placeholder="sk-..."
            className="input font-mono text-sm"
          />
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" className="text-xs text-polaris-600 underline mt-1 inline-block">
            OpenAI에서 키 받기 →
          </a>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Anthropic API 키</label>
          <input
            type="password"
            value={anthropicKey}
            onChange={(e) => setAnthropicKey(e.target.value)}
            placeholder="sk-ant-..."
            className="input font-mono text-sm"
          />
          <a href="https://console.anthropic.com" target="_blank" rel="noopener" className="text-xs text-polaris-600 underline mt-1 inline-block">
            Anthropic에서 키 받기 →
          </a>
        </div>

        {msg && (
          <p className={`text-sm ${msg.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
            {msg.text}
          </p>
        )}

        <button onClick={save} disabled={busy} className="btn-primary">
          {busy ? MSG.common.loading : '키 저장'}
        </button>
      </section>
    </div>
  )
}
