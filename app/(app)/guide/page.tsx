import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '사용 가이드 — 폴라리스 에이전시',
  description: 'AI 직원 8명을 활용하는 완전 가이드. 시작부터 실무 활용까지.',
}

/* ── 데이터 ── */

const AGENTS = [
  { emoji: '⭐', name: 'CEO 폴라', model: 'GPT-4o', cost: '중간', desc: '전략·비전·의사결정을 함께 고민', sample: '다음 분기 KPI 3개를 제안해줘', color: 'bg-amber-50 border-amber-200' },
  { emoji: '🌙', name: '마케터 루나', model: 'Claude Sonnet', cost: '중간', desc: 'SNS·광고 카피를 빠르게 생산', sample: '신상품 인스타 카피 3가지 톤으로', color: 'bg-rose-50 border-rose-200' },
  { emoji: '✍️', name: '작가 노바', model: 'Claude Sonnet', cost: '중간', desc: '블로그·뉴스레터·장문 콘텐츠', sample: '브랜드 스토리를 블로그 글로 써줘', color: 'bg-violet-50 border-violet-200' },
  { emoji: '📝', name: '편집자 시리우스', model: 'GPT-4o', cost: '중간', desc: '교정·톤 통일·문맥 다듬기', sample: '아래 글의 톤을 신뢰감 있게 다듬어줘', color: 'bg-sky-50 border-sky-200' },
  { emoji: '🎨', name: '디자이너 베가', model: 'Claude Sonnet', cost: '중간', desc: '디자인 시안·컬러·텍스트 가이드', sample: '봄 시즌 배너 카피와 색상 제안', color: 'bg-emerald-50 border-emerald-200' },
  { emoji: '💼', name: '영업 알타이르', model: 'GPT-4o', cost: '중간', desc: '제안서·콜드 메일·응대 멘트', sample: '소상공인 협력 제안 메일 짧게', color: 'bg-orange-50 border-orange-200' },
  { emoji: '💬', name: '고객지원 미라', model: 'Claude Haiku', cost: '저렴 💚', desc: 'FAQ·응대 템플릿·CS 가이드', sample: '배송 지연 응대 메시지 작성해줘', color: 'bg-green-50 border-green-200' },
  { emoji: '📊', name: '분석가 카펠라', model: 'GPT-4o', cost: '중간', desc: '데이터 요약·인사이트·실행 제안', sample: '매출 15% 증가 분석과 액션 제안', color: 'bg-pink-50 border-pink-200' },
]

const STEPS = [
  { num: '01', title: '환영', desc: '"시작하기" 누르세요' },
  { num: '02', title: '업종 선택', desc: '템플릿 선택 시 미션/톤 자동 채움' },
  { num: '03', title: '회사 정보', desc: '회사명·미션·톤 입력' },
  { num: '04', title: 'API 키', desc: 'OpenAI 또는 Anthropic 최소 1개' },
  { num: '05', title: '첫 직원 고용', desc: '8명 중 원하는 직원 클릭' },
  { num: '06', title: '샘플 작업', desc: '자동 실행 — 결과물 미리보기' },
  { num: '07', title: '완료!', desc: '대시보드로 이동' },
]

const SCENARIOS = [
  {
    icon: '🛍️', title: '쇼핑몰', subtitle: '주간 콘텐츠 루틴', color: 'from-amber-100 to-yellow-50',
    items: [
      { day: '월', agent: 'CEO 폴라', task: '주간 SNS 캘린더 기획' },
      { day: '화~목', agent: '마케터 루나', task: '릴스·피드 카피 생산' },
      { day: '금', agent: '분석가 카펠라', task: '주간 매출 인사이트' },
    ]
  },
  {
    icon: '📚', title: '학원', subtitle: '학부모 소통', color: 'from-rose-100 to-pink-50',
    items: [
      { day: '공지', agent: '작가 노바', task: '특강 안내·카카오톡 발송문' },
      { day: '수시', agent: '고객지원 미라', task: '결석·보강 응대 메시지' },
      { day: '월말', agent: 'CEO 폴라', task: '운영 방향 리뷰' },
    ]
  },
  {
    icon: '☕', title: '카페', subtitle: '시즌 메뉴 런칭', color: 'from-emerald-100 to-green-50',
    items: [
      { day: '기획', agent: '마케터 루나', task: '메뉴 네이밍 & 카피' },
      { day: '비주얼', agent: '디자이너 베가', task: '인스타 피드 6장 컨셉' },
      { day: '전략', agent: 'CEO 폴라', task: '프로모션 일정 설계' },
    ]
  },
  {
    icon: '🏭', title: 'B2B 제조', subtitle: '거래처 관리', color: 'from-violet-100 to-purple-50',
    items: [
      { day: '제안', agent: '영업 알타이르', task: '시범납품 제안 메일' },
      { day: '리포트', agent: '분석가 카펠라', task: '주간 생산 분석' },
      { day: '전략', agent: 'CEO 폴라', task: '신규 거래선 전략' },
    ]
  },
]

const TEAMS = [
  { type: '쇼핑몰', agents: '루나 + 노바 + 미라', why: '콘텐츠 대량 생산 + CS' },
  { type: '학원', agents: '노바 + 미라 + 폴라', why: '공지 + 학부모 소통 + 운영' },
  { type: '카페', agents: '루나 + 베가 + 폴라', why: 'SNS + 시각 컨셉 + 기획' },
  { type: 'B2B 제조', agents: '알타이르 + 카펠라 + 폴라', why: '영업 + 분석 + 전략' },
  { type: '크리에이터', agents: '노바 + 루나 + 시리우스', why: '작성 + 마케팅 + 교정' },
]

const FAQS = [
  { q: 'API 키는 어디서 받나요?', a: 'OpenAI → platform.openai.com/api-keys  /  Anthropic → console.anthropic.com' },
  { q: '비용이 얼마나 나올까요?', a: '주 5일 × 하루 3작업 기준 월 ₩15,000~50,000. 미라만 쓰면 월 ₩3,000 이하도 가능.' },
  { q: '한국어를 잘 이해하나요?', a: '회사 미션·톤이 시스템 프롬프트에 반영되어 일관된 한국어 결과를 제공합니다.' },
  { q: '내 데이터는 안전한가요?', a: '키와 작업 내용은 본인만 접근 가능(RLS). OpenAI/Anthropic API로만 전달됩니다.' },
  { q: '"API 키를 등록해주세요" 에러가 뜨면?', a: '설정에서 해당 키 추가. OpenAI 직원(폴라/시리우스/알타이르/카펠라) ↔ Anthropic 직원(루나/노바/베가/미라)' },
  { q: 'API 키를 나중에 바꾸고 싶으면?', a: '상단 메뉴 "설정"에서 언제든 변경할 수 있어요.' },
]

/* ── 페이지 ── */

export default function GuidePage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fdf0e6 0%, #fef6ee 30%, #fefaf5 60%, #ffffff 100%)' }}>
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* ── 히어로 ── */}
        <header className="text-center mb-16">
          <p className="text-sm tracking-widest text-rose-400 mb-4" style={{ fontStyle: 'italic' }}>
            Complete User Guide
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            AI 직원을 선택하면<br />
            <span className="text-rose-500" style={{ fontStyle: 'italic' }}>비즈니스</span> 자동화가 열립니다
          </h1>
          <p className="text-gray-500 mt-4">8명의 AI 직원을 200% 활용하는 완전 가이드</p>
        </header>

        {/* ── 통계 카드 ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { num: '8', label: 'AI 직원' },
            { num: '5', label: '업종 템플릿' },
            { num: '₩0', label: '서비스 이용료' },
            { num: '5분', label: '첫 결과물까지' },
          ].map(s => (
            <div key={s.label} className="bg-white/70 backdrop-blur rounded-2xl p-5 text-center border border-white/50 shadow-sm">
              <p className="text-3xl font-bold text-gray-900" style={{ fontStyle: 'italic' }}>{s.num}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── 목차 ── */}
        <nav className="bg-white/60 backdrop-blur rounded-2xl p-6 border border-white/50 shadow-sm mb-16">
          <h2 className="font-bold text-lg mb-4">📑 목차</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {['시작하기', '대시보드', 'AI 직원 8인', '작업 실행', '설정 관리', '비용 안내', '실무 시나리오', '에이전트 협업', '팀 세팅', '고급 활용법', 'FAQ'].map((t, i) => (
              <a key={t} href={`#s${i+1}`} className="text-gray-600 hover:text-rose-500 transition-colors">
                <span className="text-rose-400 font-semibold mr-1">{i+1}.</span>{t}
              </a>
            ))}
          </div>
        </nav>

        {/* ══════ 1. 시작하기 ══════ */}
        <Section id="s1" num="01" title="시작하기" subtitle="가입부터 첫 결과물까지 5분">
          <h3 className="text-lg font-semibold mt-6 mb-3">온보딩 7단계</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STEPS.map(s => (
              <div key={s.num} className="bg-white/70 backdrop-blur rounded-xl p-4 border border-white/50 shadow-sm">
                <p className="text-2xl font-bold text-rose-400" style={{ fontStyle: 'italic' }}>{s.num}</p>
                <p className="font-semibold text-sm mt-1">{s.title}</p>
                <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mt-8 mb-3">업종 템플릿</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: '🛍️', name: '온라인 쇼핑몰', mission: '합리적 가격의 좋은 제품을 추천한다', tone: '친근하고 신뢰감 있게', color: 'from-amber-100 to-yellow-50' },
              { icon: '☕', name: '카페·식음료', mission: '단골 손님과의 일상적 소통', tone: '따뜻하고 캐주얼하게', color: 'from-orange-100 to-amber-50' },
              { icon: '📚', name: '학원·교육', mission: '학생의 성장에 책임진다', tone: '전문적이고 따뜻하게', color: 'from-rose-100 to-pink-50' },
              { icon: '🏥', name: '병원·의료', mission: '환자의 불안을 줄이는 의료 정보', tone: '정중하고 정확하게', color: 'from-sky-100 to-blue-50' },
              { icon: '🏭', name: '제조·B2B', mission: '품질과 납기를 약속한다', tone: '신뢰감 있고 전문적으로', color: 'from-emerald-100 to-green-50' },
            ].map(t => (
              <div key={t.name} className={`bg-gradient-to-br ${t.color} rounded-2xl p-5 border border-white/50`}>
                <p className="text-2xl mb-2">{t.icon}</p>
                <p className="font-bold text-sm">{t.name}</p>
                <p className="text-xs text-gray-600 mt-2">{t.mission}</p>
                <p className="text-xs text-gray-400 mt-1">톤: {t.tone}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ══════ 2. 대시보드 ══════ */}
        <Section id="s2" num="02" title="대시보드" subtitle="한눈에 보는 에이전시 현황">
          {/* 대시보드 비주얼 목업 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* 헤더 바 */}
            <div className="bg-gray-50 border-b px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
              </div>
              <p className="text-[10px] text-gray-400">localhost:3000/dashboard</p>
              <div />
            </div>
            {/* 본문 */}
            <div className="p-5 space-y-4">
              {/* 사용량 카드 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                  <p className="text-xs text-gray-500">오늘 사용량</p>
                  <p className="text-2xl font-bold mt-1">₩1,200 <span className="text-sm text-red-400">↑30%</span></p>
                  <p className="text-[10px] text-gray-400 mt-1">5회 작업 · 3,200 토큰 · 어제 대비</p>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-100">
                  <p className="text-xs text-gray-500">이번 달 누적</p>
                  <p className="text-2xl font-bold mt-1">₩45,000</p>
                  <p className="text-[10px] text-gray-400 mt-1">127회 작업 · 89,340 토큰</p>
                </div>
              </div>
              {/* 차트 영역 */}
              <div className="grid grid-cols-2 gap-3">
                {/* 일별 막대 */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-600 mb-3">일별 사용량</p>
                  <div className="flex items-end gap-1 h-16">
                    {[40, 25, 65, 50, 30, 70, 45, 55, 35, 60, 80, 50, 42, 68].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-rose-300 to-rose-200 rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[8px] text-gray-300">05/03</span>
                    <span className="text-[8px] text-gray-300">05/16</span>
                  </div>
                </div>
                {/* 모델별 파이 */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-600 mb-3">모델별 비율</p>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full relative" style={{ background: 'conic-gradient(#f472b6 0% 42%, #a78bfa 42% 72%, #34d399 72% 100%)' }}>
                      <div className="absolute inset-2 bg-gray-50 rounded-full" />
                    </div>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-400" /> GPT-4o 42%</div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-400" /> Sonnet 30%</div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Haiku 28%</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 고용 직원 */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">고용된 AI 직원</p>
                <div className="flex gap-2 flex-wrap">
                  {['⭐ 폴라', '🌙 루나', '✍️ 노바', '📝 시리우스'].map(a => (
                    <span key={a} className="bg-white border border-gray-100 rounded-lg px-3 py-1.5 text-sm shadow-sm">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ══════ 3. AI 직원 ══════ */}
        <Section id="s3" num="03" title="AI 직원 8인" subtitle="각자의 전문 분야가 있습니다">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AGENTS.map(a => (
              <div key={a.name} className={`${a.color} border rounded-2xl p-5 transition-transform hover:scale-[1.02]`}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{a.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">{a.name}</p>
                      <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded-full text-gray-500">{a.cost}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{a.model}</p>
                    <p className="text-sm text-gray-600 mt-2">{a.desc}</p>
                    <div className="bg-white/60 rounded-lg p-2.5 mt-3">
                      <p className="text-[10px] text-gray-400 mb-1">💬 샘플 프롬프트</p>
                      <p className="text-xs text-gray-700">&ldquo;{a.sample}&rdquo;</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ══════ 4. 작업 실행 ══════ */}
        <Section id="s4" num="04" title="작업 실행" subtitle="프롬프트 하나로 결과물을 받으세요">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {['직원 클릭', '프롬프트 입력', '"시키기" 클릭', '실시간 응답', '비용 확인'].map((s, i) => (
              <div key={s} className="flex items-center gap-2 bg-white/60 rounded-xl px-4 py-3 flex-1 border border-white/50">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-500 text-xs flex items-center justify-center font-bold">{i+1}</span>
                <span className="text-sm">{s}</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-3">좋은 프롬프트 vs 나쁜 프롬프트</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
              <p className="font-bold text-red-400 text-sm mb-3">❌ 이렇게 하면 아쉬워요</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>"글 써줘"</li>
                <li>"마케팅해줘"</li>
                <li>톤·분량·형식 미지정</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
              <p className="font-bold text-green-500 text-sm mb-3">✅ 이렇게 하면 완벽해요</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>"카페 신메뉴 인스타 카피 3개 써줘"</li>
                <li>"을지로 카페, 2030 타겟, 여름 신메뉴"</li>
                <li>"500자 이내, MZ 감성 톤, 번호 매겨줘"</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* ══════ 5. 설정 ══════ */}
        <Section id="s5" num="05" title="설정 관리" subtitle="API 키를 언제든 변경·추가할 수 있어요">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 border border-green-100">
              <p className="font-bold">OpenAI API 키</p>
              <p className="text-xs text-gray-500 mt-1">GPT-4o · GPT-4o-mini</p>
              <p className="text-xs text-gray-400 mt-2">직원: 폴라, 시리우스, 알타이르, 카펠라</p>
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" className="text-xs text-green-600 underline mt-3 inline-block">키 발급 →</a>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 border border-violet-100">
              <p className="font-bold">Anthropic API 키</p>
              <p className="text-xs text-gray-500 mt-1">Claude Sonnet · Claude Haiku</p>
              <p className="text-xs text-gray-400 mt-2">직원: 루나, 노바, 베가, 미라</p>
              <a href="https://console.anthropic.com" target="_blank" rel="noopener" className="text-xs text-violet-600 underline mt-3 inline-block">키 발급 →</a>
            </div>
          </div>
        </Section>

        {/* ══════ 6. 비용 ══════ */}
        <Section id="s6" num="06" title="비용 안내" subtitle="서비스 이용료는 무료, AI 사용료만 직접 과금">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100 mb-6">
            <p className="font-bold text-green-700">🎉 폴라리스 에이전시 자체는 무료!</p>
            <p className="text-sm text-green-600 mt-1">AI 모델 사용료(OpenAI/Anthropic)만 본인 계정에서 과금됩니다.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white/70 rounded-2xl overflow-hidden">
              <thead>
                <tr className="border-b" style={{ background: 'linear-gradient(135deg, #fef3e6, #fff1f0)' }}>
                  <th className="p-3 text-left text-gray-600">작업 유형</th>
                  <th className="p-3 text-center text-gray-600">GPT-4o 직원</th>
                  <th className="p-3 text-center text-gray-600">Sonnet 직원</th>
                  <th className="p-3 text-center text-green-600">Haiku (미라)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-3">짧은 카피 1개</td><td className="p-3 text-center">₩50~200</td><td className="p-3 text-center">₩80~300</td><td className="p-3 text-center font-semibold text-green-600">₩10~50</td></tr>
                <tr className="border-b"><td className="p-3">블로그 글 1편</td><td className="p-3 text-center">₩300~1,500</td><td className="p-3 text-center">₩500~2,000</td><td className="p-3 text-center font-semibold text-green-600">₩50~200</td></tr>
                <tr><td className="p-3">보고서/분석</td><td className="p-3 text-center">₩1,000~5,000</td><td className="p-3 text-center">₩1,500~7,000</td><td className="p-3 text-center font-semibold text-green-600">₩100~500</td></tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="bg-white/50 rounded-xl p-4 border border-white/50">💡 간단한 작업은 <strong>미라</strong>에게</div>
            <div className="bg-white/50 rounded-xl p-4 border border-white/50">📝 초안은 미라 → 마무리는 시리우스</div>
            <div className="bg-white/50 rounded-xl p-4 border border-white/50">🎯 프롬프트를 구체적으로 → 재작업 ↓</div>
            <div className="bg-white/50 rounded-xl p-4 border border-white/50">📊 대시보드로 일별 비용 모니터링</div>
          </div>
        </Section>

        {/* ══════ 7. 실무 시나리오 ══════ */}
        <Section id="s7" num="07" title="실무 활용 시나리오" subtitle="업종별 주간 루틴 예시">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SCENARIOS.map(s => (
              <div key={s.title} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 border border-white/50`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <p className="font-bold">{s.title}</p>
                    <p className="text-xs text-gray-500">{s.subtitle}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {s.items.map(item => (
                    <div key={item.day} className="bg-white/60 rounded-lg px-3 py-2 flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-white/80 px-1.5 py-0.5 rounded text-gray-500 shrink-0">{item.day}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400">{item.agent}</p>
                        <p className="text-sm text-gray-700 truncate">{item.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ══════ 8. 에이전트 협업 ══════ */}
        <Section id="s8" num="08" title="에이전트 협업" subtitle="여러 직원이 함께 일하면 결과가 달라집니다">

          {/* 협업 패턴 1: 콘텐츠 생산 라인 */}
          <h3 className="text-lg font-semibold mb-3">패턴 1 — 콘텐츠 생산 라인</h3>
          <p className="text-sm text-gray-500 mb-4">기획 → 작성 → 교정 → 비주얼을 직원 4명이 릴레이로 처리</p>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-200 via-violet-200 to-emerald-200 hidden sm:block" />
            <div className="space-y-4">
              {[
                { step: 1, emoji: '⭐', agent: 'CEO 폴라', task: '"이번 주 블로그 주제 3개 추천해줘. 우리 카페 봄 메뉴 관련으로"', output: '주제 3개 + 각각의 타겟 독자·핵심 메시지', color: 'bg-amber-50 border-amber-200' },
                { step: 2, emoji: '✍️', agent: '작가 노바', task: '"1번 주제(딸기 디저트 트렌드)로 블로그 글 써줘. 2,000자, SEO 키워드 포함"', output: '완성된 블로그 초안 2,000자', color: 'bg-violet-50 border-violet-200' },
                { step: 3, emoji: '📝', agent: '편집자 시리우스', task: '"아래 글을 다듬어줘. 톤은 따뜻하고 캐주얼하게. 문장이 긴 부분 잘라줘"', output: '교정 완료된 최종본', color: 'bg-sky-50 border-sky-200' },
                { step: 4, emoji: '🎨', agent: '디자이너 베가', task: '"이 블로그 글에 어울리는 썸네일 컨셉 제안. 색상, 텍스트 배치, 분위기 설명"', output: '썸네일 디자인 브리프 (디자이너에게 전달용)', color: 'bg-emerald-50 border-emerald-200' },
              ].map(s => (
                <div key={s.step} className={`${s.color} border rounded-2xl p-5 sm:ml-10 relative`}>
                  <div className="absolute -left-12 top-5 w-8 h-8 rounded-full bg-white border-2 border-rose-200 flex items-center justify-center text-sm font-bold text-rose-400 hidden sm:flex">
                    {s.step}
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{s.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{s.agent}</p>
                      <div className="bg-white/60 rounded-lg p-3 mt-2 text-sm text-gray-700">{s.task}</div>
                      <p className="text-xs text-gray-400 mt-2">→ 산출물: {s.output}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 협업 패턴 2: 마케팅 캠페인 */}
          <h3 className="text-lg font-semibold mt-10 mb-3">패턴 2 — 마케팅 캠페인 풀세트</h3>
          <p className="text-sm text-gray-500 mb-4">하나의 프로모션을 여러 채널에 맞게 변환</p>
          <div className="bg-white/60 backdrop-blur rounded-2xl border border-white/50 p-5">
            <div className="text-center mb-4">
              <span className="bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-sm font-semibold">프로모션: 여름 세일 30%</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-100">
                <p className="text-lg mb-1">🌙</p>
                <p className="font-semibold text-sm">마케터 루나</p>
                <p className="text-xs text-gray-500 mt-1">인스타 피드 카피 3종</p>
                <p className="text-xs text-gray-500">+ 스토리 문구 + 해시태그</p>
              </div>
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
                <p className="text-lg mb-1">✍️</p>
                <p className="font-semibold text-sm">작가 노바</p>
                <p className="text-xs text-gray-500 mt-1">이메일 뉴스레터 본문</p>
                <p className="text-xs text-gray-500">+ 카카오톡 발송 메시지</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <p className="text-lg mb-1">💼</p>
                <p className="font-semibold text-sm">영업 알타이르</p>
                <p className="text-xs text-gray-500 mt-1">VIP 고객 맞춤 DM</p>
                <p className="text-xs text-gray-500">+ 도매 거래처 안내문</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">같은 프로모션 → 3명이 채널별로 최적화된 메시지 생산</p>
          </div>

          {/* 협업 패턴 3: CS 자동화 */}
          <h3 className="text-lg font-semibold mt-10 mb-3">패턴 3 — CS 자동화 파이프라인</h3>
          <p className="text-sm text-gray-500 mb-4">FAQ 50개를 빠르고 저렴하게, 품질은 높게</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
              <p className="text-2xl mb-2">💬</p>
              <p className="font-semibold text-sm">고객지원 미라</p>
              <p className="text-xs text-gray-500 mt-2">FAQ 50개 초안 작성</p>
              <p className="text-[10px] text-green-600 mt-1">💚 50건 = ₩500~2,500</p>
            </div>
            <div className="flex items-center justify-center text-2xl text-gray-300 hidden sm:flex">→</div>
            <div className="flex-1 bg-sky-50 border border-sky-100 rounded-2xl p-5 text-center">
              <p className="text-2xl mb-2">📝</p>
              <p className="font-semibold text-sm">편집자 시리우스</p>
              <p className="text-xs text-gray-500 mt-2">톤 통일 + 맞춤법 교정</p>
              <p className="text-[10px] text-gray-500 mt-1">50건 교정 = ₩2,500~5,000</p>
            </div>
            <div className="flex items-center justify-center text-2xl text-gray-300 hidden sm:flex">→</div>
            <div className="flex-1 bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center">
              <p className="text-2xl mb-2">⭐</p>
              <p className="font-semibold text-sm">CEO 폴라</p>
              <p className="text-xs text-gray-500 mt-2">CS 전략 리뷰 + 우선순위</p>
              <p className="text-[10px] text-gray-500 mt-1">1회 = ₩200~500</p>
            </div>
          </div>
          <div className="bg-white/50 rounded-xl p-3 mt-3 text-center">
            <p className="text-sm text-gray-600">총 비용: <strong className="text-rose-500">₩3,200~8,000</strong>으로 FAQ 50개 완성</p>
            <p className="text-xs text-gray-400 mt-1">사람이 직접 쓰면 2~3일, AI 협업이면 30분</p>
          </div>

          {/* 협업 패턴 4: 데이터→전략→실행 */}
          <h3 className="text-lg font-semibold mt-10 mb-3">패턴 4 — 데이터 → 전략 → 실행</h3>
          <p className="text-sm text-gray-500 mb-4">숫자에서 시작해서 실행 가능한 콘텐츠까지 한 번에</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-5 border border-pink-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-500 text-xs flex items-center justify-center font-bold">1</span>
                <span className="font-semibold text-sm">분석</span>
              </div>
              <p className="text-2xl mb-1">📊</p>
              <p className="font-semibold text-sm">분석가 카펠라</p>
              <p className="text-xs text-gray-500 mt-2">"이번 달 매출 데이터 분석하고 성장 기회 3개 뽑아줘"</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-500 text-xs flex items-center justify-center font-bold">2</span>
                <span className="font-semibold text-sm">전략</span>
              </div>
              <p className="text-2xl mb-1">⭐</p>
              <p className="font-semibold text-sm">CEO 폴라</p>
              <p className="text-xs text-gray-500 mt-2">"1번 기회(MZ 타겟 확대)를 실행 계획으로 바꿔줘"</p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-5 border border-rose-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-500 text-xs flex items-center justify-center font-bold">3</span>
                <span className="font-semibold text-sm">실행</span>
              </div>
              <p className="text-2xl mb-1">🌙</p>
              <p className="font-semibold text-sm">마케터 루나</p>
              <p className="text-xs text-gray-500 mt-2">"MZ 타겟 인스타 캠페인 카피 + 해시태그 생산"</p>
            </div>
          </div>
        </Section>

        {/* ══════ 9. 팀 세팅 ══════ */}
        <Section id="s9" num="09" title="팀 세팅 가이드" subtitle="업종에 맞는 최적의 팀 구성">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">1인 사업자라면 이 3명부터 고용하세요:</p>
            <div className="flex gap-2 flex-wrap">
              {['🌙 마케터 루나', '💬 고객지원 미라', '⭐ CEO 폴라'].map(a => (
                <span key={a} className="bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100 px-4 py-2 rounded-full text-sm">{a}</span>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {TEAMS.map(t => (
              <div key={t.type} className="bg-white/60 backdrop-blur rounded-xl p-4 border border-white/50 flex items-center gap-4">
                <span className="font-bold text-sm w-20 shrink-0">{t.type}</span>
                <span className="text-sm text-rose-500 flex-1">{t.agents}</span>
                <span className="text-xs text-gray-400 hidden sm:block">{t.why}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ══════ 9. 고급 ══════ */}
        <Section id="s10" num="10" title="고급 활용법" subtitle="AI 직원을 200% 활용하는 전략">
          <h3 className="text-lg font-semibold mb-3">체이닝 — 직원 릴레이</h3>
          <div className="flex flex-col gap-2 mb-8">
            {[
              { step: '1', agent: 'CEO 폴라', task: '마케팅 전략 3가지 제안' },
              { step: '2', agent: '마케터 루나', task: '1번 전략으로 인스타 카피 5개' },
              { step: '3', agent: '편집자 시리우스', task: '3번 카피를 더 세련되게' },
              { step: '4', agent: '디자이너 베가', task: '이 카피에 맞는 배너 컨셉' },
            ].map(c => (
              <div key={c.step} className="flex items-center gap-3 bg-white/60 rounded-xl px-4 py-3 border border-white/50">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 text-rose-500 text-xs flex items-center justify-center font-bold">{c.step}</span>
                <span className="text-xs text-gray-400 w-24 shrink-0">{c.agent}</span>
                <span className="text-sm">{c.task}</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-3">AB 테스트 — 비교 후 선택</h3>
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-rose-50 rounded-xl p-4 border border-rose-100 text-center">
              <p className="text-sm font-semibold">🌙 루나</p>
              <p className="text-xs text-gray-500 mt-1">"MZ 감성으로"</p>
            </div>
            <div className="bg-violet-50 rounded-xl p-4 border border-violet-100 text-center">
              <p className="text-sm font-semibold">✍️ 노바</p>
              <p className="text-xs text-gray-500 mt-1">"스토리텔링으로"</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">비용 최적화</h3>
          <div className="space-y-2">
            {[
              { case: '대량 반복 (FAQ 50개)', who: '미라', why: '50건 = ₩500~2,500' },
              { case: '초안 + 마무리', who: '미라 → 시리우스', why: '싸게 초안, 고급 마무리' },
              { case: '품질 중시 (제안서)', who: '알타이르', why: '한 번에 완성도 높게' },
            ].map(c => (
              <div key={c.case} className="bg-white/60 rounded-xl p-4 border border-white/50 flex items-center gap-4 text-sm">
                <span className="flex-1">{c.case}</span>
                <span className="text-rose-500 font-semibold">{c.who}</span>
                <span className="text-xs text-gray-400 hidden sm:block">{c.why}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ══════ 10. FAQ ══════ */}
        <Section id="s11" num="11" title="FAQ" subtitle="자주 묻는 질문">
          <div className="space-y-3">
            {FAQS.map(f => (
              <div key={f.q} className="bg-white/60 backdrop-blur rounded-xl p-5 border border-white/50">
                <p className="font-semibold text-sm">{f.q}</p>
                <p className="text-sm text-gray-500 mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 푸터 ── */}
        <footer className="text-center mt-20 pb-10">
          <p className="text-xs text-gray-400">폴라리스 에이전시 · 사용 가이드 v0.1.0 · 2026-05-16</p>
        </footer>
      </div>
    </div>
  )
}

/* ── Section 래퍼 ── */
function Section({ id, num, title, subtitle, children }: {
  id: string; num: string; title: string; subtitle: string; children: React.ReactNode
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <div className="mb-6">
        <span className="text-3xl font-bold text-rose-300" style={{ fontStyle: 'italic' }}>{num}</span>
        <h2 className="text-2xl font-bold mt-1">{title}</h2>
        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}
