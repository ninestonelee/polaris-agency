import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies: { name: string; value: string; options?: Record<string, unknown> }[]) => {
          cookies.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isProtected =
    path.startsWith('/dashboard') ||
    path.startsWith('/onboarding') ||
    path.startsWith('/agents') ||
    path.startsWith('/companies') ||
    path.startsWith('/settings') ||
    path.startsWith('/relay')
  const isAuthPage = path === '/login' || path === '/signup'

  if (isProtected && !user) {
    const url = new URL('/login', request.url)
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 온보딩 미완료 가드
  if (user && isProtected && !path.startsWith('/onboarding')) {
    const { data: profile } = await supabase
      .from('users')
      .select('onboarded_at')
      .eq('id', user.id)
      .maybeSingle()
    if (profile && !profile.onboarded_at) {
      return NextResponse.redirect(new URL('/onboarding/1', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
