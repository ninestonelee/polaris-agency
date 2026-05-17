import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const checks: Record<string, unknown> = {}

  // 1. 환경변수 체크
  checks.env = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ set' : '❌ missing',
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `✅ ...${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(-8)}` : '❌ missing',
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? `✅ ...${process.env.SUPABASE_SERVICE_ROLE_KEY.slice(-8)}` : '❌ missing',
  }

  // 2. Supabase anon 연결 체크
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('users').select('count').limit(0)
    checks.supabase_anon = error ? `❌ ${error.message}` : '✅ connected'
  } catch (e) {
    checks.supabase_anon = `❌ ${e instanceof Error ? e.message : String(e)}`
  }

  // 3. Supabase admin 연결 체크
  try {
    const admin = await createAdminClient()
    const { count, error } = await admin.from('users').select('*', { count: 'exact', head: true })
    checks.supabase_admin = error ? `❌ ${error.message}` : `✅ connected (${count} users)`
  } catch (e) {
    checks.supabase_admin = `❌ ${e instanceof Error ? e.message : String(e)}`
  }

  // 4. auth.users 체크 (admin으로)
  try {
    const admin = await createAdminClient()
    const { data, error } = await admin.auth.admin.listUsers({ perPage: 5 })
    checks.auth_users = error
      ? `❌ ${error.message}`
      : `✅ ${data.users.length} users: ${data.users.map(u => u.email).join(', ') || 'none'}`
  } catch (e) {
    checks.auth_users = `❌ ${e instanceof Error ? e.message : String(e)}`
  }

  // 5. 현재 세션 체크
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    checks.current_session = error
      ? `❌ ${error.message}`
      : user ? `✅ logged in as ${user.email}` : '⚠️ no session'
  } catch (e) {
    checks.current_session = `❌ ${e instanceof Error ? e.message : String(e)}`
  }

  // 6. 테이블 존재 확인
  try {
    const admin = await createAdminClient()
    const tables = ['users', 'companies', 'agents', 'tasks', 'usage_logs']
    const tableChecks: Record<string, string> = {}
    for (const t of tables) {
      const { count, error } = await admin.from(t).select('*', { count: 'exact', head: true })
      tableChecks[t] = error ? `❌ ${error.message}` : `✅ ${count} rows`
    }
    checks.tables = tableChecks
  } catch (e) {
    checks.tables = `❌ ${e instanceof Error ? e.message : String(e)}`
  }

  return NextResponse.json(checks, { status: 200 })
}
