'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MSG } from '@/lib/i18n/messages'

export default function SignupPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setBusy(false)
    if (error) {
      setMsg(error.message.includes('already') ? '이미 가입된 이메일이에요.' : MSG.auth.authFailed)
      return
    }
    // Confirm Email OFF인 경우 세션이 바로 반환됨 → 즉시 온보딩으로
    if (data.session) {
      window.location.href = '/onboarding/1'
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center bg-white p-8 rounded-2xl shadow-sm space-y-3">
          <p className="text-4xl">📬</p>
          <h2 className="text-xl font-bold">메일을 확인해주세요</h2>
          <p className="text-sm text-gray-600">
            {email}로 인증 메일을 보냈어요. 메일 속 링크를 클릭하면 가입이 완료됩니다.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-center">이메일로 가입</h1>
        <form onSubmit={handleSignup} className="space-y-3">
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
            placeholder="비밀번호 (8자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            className="input"
          />
          {msg && <p className="text-sm text-red-600">{msg}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full py-3">
            {busy ? MSG.common.loading : '가입하기'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          이미 계정이 있으세요? <Link href="/login" className="underline text-polaris-600">로그인</Link>
        </p>
      </div>
    </main>
  )
}
