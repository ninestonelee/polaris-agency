import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { UsageCard } from '@/components/dashboard/UsageCard'
import { UsageChart } from '@/components/dashboard/UsageChart'
import { UsageByModel } from '@/components/dashboard/UsageByModel'
import { EmptyState } from '@/components/ui/EmptyState'
import { DashboardTracker } from '@/components/analytics/DashboardTracker'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', user!.id)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()
  const { data: hiredAgents } = await supabase
    .from('agents')
    .select('id, name, role')
    .eq('company_id', company?.id ?? '')
    .eq('is_hired', true)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <DashboardTracker userId={user!.id} email={user!.email ?? ''} />
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        {company && (
          <p className="text-gray-500 text-sm mt-1">{company.name} · {company.industry}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UsageCard range="today" label="오늘 사용량" />
        <UsageCard range="month" label="이번 달 누적" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UsageChart range="month" />
        <UsageByModel />
      </div>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">고용된 AI 직원</h2>
          <Link href="/agents" className="text-sm text-polaris-600 underline">전체 보기 →</Link>
        </div>
        {hiredAgents && hiredAgents.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {hiredAgents.map((a) => (
              <Link key={a.id} href={`/agents/${a.id}`} className="card text-center">
                <p className="font-semibold">{a.name}</p>
                <p className="text-xs text-gray-500 mt-1">{a.role}</p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="👥"
            title="아직 고용된 직원이 없어요"
            description="에이전트 카탈로그에서 첫 직원을 고용해보세요."
            cta={{ label: '직원 보러가기', href: '/agents' }}
          />
        )}
      </section>
    </div>
  )
}
