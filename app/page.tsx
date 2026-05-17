import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-3">
          <p className="text-polaris-500 font-semibold">폴라리스 에이전시</p>
          <h1 className="text-4xl md:text-5xl font-bold">
            AI 직원이 일하는
            <br />
            가장 쉬운 에이전시
          </h1>
          <p className="text-lg text-gray-600">
            한국 중소기업 사장님을 위한
            <br />
            30분 안에 시작하는 AI 자동화 SaaS
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="btn-primary px-8 py-3 text-lg">
            지금 시작하기
          </Link>
          <Link href="/faq" className="btn-secondary px-8 py-3 text-lg">
            자주 묻는 질문
          </Link>
        </div>

        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="card">
            <h3 className="font-semibold mb-1">🇰🇷 완전 한글</h3>
            <p className="text-sm text-gray-600">UI, 안내, 에러 모두 한국어</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-1">⚡ 30분 첫 경험</h3>
            <p className="text-sm text-gray-600">가입 → 첫 결과물까지</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-1">🏢 5개 산업 템플릿</h3>
            <p className="text-sm text-gray-600">쇼핑몰·카페·학원·병원·제조</p>
          </div>
        </div>
      </div>
    </main>
  )
}
