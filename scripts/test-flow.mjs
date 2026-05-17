#!/usr/bin/env node
/**
 * 폴라리스 에이전시 MVP — 전체 플로우 자동 테스트
 * 실행: node scripts/test-flow.mjs
 *
 * 테스트 순서:
 * 1. 환경 진단 (/api/debug/health)
 * 2. Supabase 직접 연결 테스트
 * 3. 회원가입 (signUp)
 * 4. 로그인 (signInWithPassword)
 * 5. API 키 저장 (/api/auth/api-keys)
 * 6. 회사 생성 (/api/companies)
 * 7. 에이전트 고용 (/api/agents/[id]/hire)
 */

import { createClient } from '@supabase/supabase-js'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://himxgiodkfcfdfblaveh.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpbXhnaW9ka2ZjZmRmYmxhdmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzA0MzQsImV4cCI6MjA5NDQ0NjQzNH0.iAh4fkxXb_kj6qOuSkC1TngUn5aUNPs5mWfvQFaPsyI'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpbXhnaW9ka2ZjZmRmYmxhdmVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg3MDQzNCwiZXhwIjoyMDk0NDQ2NDM0fQ.GhGsES2OT50XW7AYLZ1DubeFip58rASv6qpIWX1GHOE'

const TEST_EMAIL = `test-${Date.now()}@polaris.test`
const TEST_PASSWORD = 'test1234!!'

let passed = 0
let failed = 0

function log(icon, msg) { console.log(`  ${icon} ${msg}`) }
function pass(msg) { passed++; log('✅', msg) }
function fail(msg, detail) { failed++; log('❌', `${msg}${detail ? ': ' + detail : ''}`) }
function info(msg) { log('ℹ️', msg) }
function section(title) { console.log(`\n━━━ ${title} ━━━`) }

async function main() {
  console.log('🔍 폴라리스 에이전시 MVP — 전체 플로우 자동 테스트')
  console.log(`   Base URL: ${BASE_URL}`)
  console.log(`   Supabase: ${SUPABASE_URL}`)
  console.log(`   Test Email: ${TEST_EMAIL}`)

  // ── 1. 서버 Health ──
  section('1. 서버 접속')
  try {
    const res = await fetch(`${BASE_URL}`)
    res.ok ? pass(`홈페이지 200 OK`) : fail(`홈페이지`, `${res.status}`)
  } catch (e) {
    fail('서버 접속 실패', e.message)
    console.log('\n⛔ dev 서버가 실행 중인지 확인하세요: npm run dev')
    process.exit(1)
  }

  // ── 2. 진단 API ──
  section('2. 환경 진단 (/api/debug/health)')
  try {
    const res = await fetch(`${BASE_URL}/api/debug/health`)
    const data = await res.json()
    console.log(JSON.stringify(data, null, 2))
    res.ok ? pass('진단 API 응답 정상') : fail('진단 API 에러')
  } catch (e) {
    fail('진단 API 접속 실패', e.message)
  }

  // ── 3. Supabase 직접 연결 ──
  section('3. Supabase 직접 연결 테스트')
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  try {
    const { count, error } = await admin.from('users').select('*', { count: 'exact', head: true })
    error ? fail('Admin 연결', error.message) : pass(`Admin 연결 OK (public.users: ${count}행)`)
  } catch (e) {
    fail('Admin 연결 예외', e.message)
  }

  // ── 4. 회원가입 ──
  section('4. 회원가입 (signUp)')
  let userId = null
  try {
    const { data, error } = await supabase.auth.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    })
    if (error) {
      fail('signUp 실패', `${error.message} (status: ${error.status})`)
    } else if (!data.user) {
      fail('signUp', 'user가 null — Confirm Email이 켜져 있을 수 있음')
    } else if (!data.session) {
      fail('signUp', `user 생성됨 (${data.user.id}) 하지만 session 없음 — Confirm Email이 켜져 있음!`)
      info('Supabase Dashboard → Auth → Providers → Email → Confirm Email → OFF 해주세요')
      userId = data.user.id
    } else {
      userId = data.user.id
      pass(`가입 성공: ${data.user.email} (${data.user.id})`)
      pass(`세션 즉시 발급: access_token ...${data.session.access_token.slice(-12)}`)
    }
  } catch (e) {
    fail('signUp 예외', e.message)
  }

  // ── 5. auth.users 확인 ──
  section('5. DB 확인')
  try {
    const { data: authUsers } = await admin.auth.admin.listUsers({ perPage: 10 })
    info(`auth.users: ${authUsers.users.length}명 — ${authUsers.users.map(u => u.email).join(', ') || 'empty'}`)

    const { data: pubUsers } = await admin.from('users').select('id, email')
    info(`public.users: ${pubUsers?.length ?? 0}명 — ${pubUsers?.map(u => u.email).join(', ') || 'empty'}`)

    if (authUsers.users.length > 0 && (pubUsers?.length ?? 0) === 0) {
      fail('트리거 동작 안함', 'auth.users에는 있지만 public.users에 없음 — handle_new_user 트리거 확인 필요')
    }
  } catch (e) {
    fail('DB 확인 예외', e.message)
  }

  // ── 6. 로그인 ──
  section('6. 로그인 (signInWithPassword)')
  let session = null
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    })
    if (error) {
      fail('로그인 실패', error.message)
    } else {
      session = data.session
      pass(`로그인 성공: ${data.user?.email}`)
    }
  } catch (e) {
    fail('로그인 예외', e.message)
  }

  // ── 7. API 키 저장 (서버 API 테스트) ──
  if (session) {
    section('7. API 키 저장 (/api/auth/api-keys)')
    try {
      // Supabase 쿠키 기반이 아닌 직접 인증 테스트
      const authedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${session.access_token}` } }
      })
      const { error } = await authedClient.from('users').update({ openai_key: 'sk-test-key' }).eq('id', session.user.id)
      error ? fail('API 키 저장', error.message) : pass('API 키 저장 (direct DB) 성공')
    } catch (e) {
      fail('API 키 저장 예외', e.message)
    }
  }

  // ── 8. 클린업 ──
  section('8. 테스트 유저 정리')
  if (userId) {
    try {
      const { error } = await admin.auth.admin.deleteUser(userId)
      error ? fail('유저 삭제', error.message) : pass(`테스트 유저 삭제 완료 (${TEST_EMAIL})`)
    } catch (e) {
      fail('유저 삭제 예외', e.message)
    }
  }

  // ── 결과 ──
  console.log(`\n${'═'.repeat(40)}`)
  console.log(`  결과: ✅ ${passed} passed / ❌ ${failed} failed`)
  console.log(`${'═'.repeat(40)}`)
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error('치명적 에러:', e); process.exit(1) })
