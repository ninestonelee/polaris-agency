'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MSG } from '@/lib/i18n/messages'
import { track, Events } from '@/lib/analytics/posthog'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중…</div>}>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const next = searchParams.get('next') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const callbackUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?next=${encodeURIComponent(next)}`

  const handleOAuth = async (provider: 'kakao' | 'google') => {
    setBusy(true)
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl },
    })
  }

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMsg(MSG.auth.authFailed)
      setBusy(false)
      return
    }
    track(Events.SIGNUP_COMPLETED, { provider: 'email' })
    window.location.href = next
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm space-y-6 bg-white p-8 rounded-2xl shadow-sm">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">{MSG.auth.loginTitle}</h1>
          <p className="text-gray-600 text-sm">{MSG.auth.loginSubtitle}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">
            {MSG.auth.authFailed}
          </div>
        )}

        <div className="space-y-2">
          <button onClick={() => handleOAuth('kakao')} disabled={busy} className="btn-kakao">
            💬 {MSG.auth.kakao}
          </button>
          <button onClick={() => handleOAuth('google')} disabled={busy} className="btn-secondary w-full py-3">
            🔵 {MSG.auth.google}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-gray-500">또는</span></div>
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          {msg && <p className="text-sm text-red-600">{msg}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full py-3">
            {busy ? MSG.common.loading : MSG.auth.emailLogin}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          아직 계정이 없으세요? <Link href="/signup" className="underline text-polaris-600">이메일로 가입</Link>
        </p>
      </div>
    </main>
  )
}
