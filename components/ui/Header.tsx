import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MSG } from '@/lib/i18n/messages'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="font-bold text-lg flex items-center gap-1">
          <span>⭐</span>
          <span>폴라리스 에이전시</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="hover:text-polaris-600">대시보드</Link>
          <Link href="/agents" className="hover:text-polaris-600">직원</Link>
          <Link href="/relay" className="hover:text-polaris-600">릴레이</Link>
          <Link href="/settings" className="hover:text-polaris-600">설정</Link>
          <Link href="/guide" className="hover:text-polaris-600">가이드</Link>
          <Link href="/faq" className="hover:text-polaris-600">도움말</Link>
          {user && (
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="text-gray-500 hover:text-gray-700">
                {MSG.auth.logout}
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  )
}
