import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://polaris-agency.vercel.app'

export const metadata: Metadata = {
  title: '폴라리스 에이전시 - AI 직원이 일하는 에이전시',
  description: '한국 중소기업 사장이 30분 안에 첫 AI 에이전트로 콘텐츠를 만드는 가장 쉬운 방법',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: '폴라리스 에이전시',
    description: 'AI 직원을 고용하고 30분 안에 첫 결과물을 받아보세요',
    url: SITE_URL,
    siteName: '폴라리스 에이전시',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '폴라리스 에이전시',
    description: 'AI 직원을 고용하고 30분 안에 첫 결과물을 받아보세요',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body className="font-sans antialiased text-gray-900 bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
