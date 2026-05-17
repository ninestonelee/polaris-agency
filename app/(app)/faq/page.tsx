'use client'

import { useEffect } from 'react'
import { track, Events } from '@/lib/analytics/posthog'

const FAQS = [
  {
    q: 'API 키는 어떻게 받나요?',
    a: `1) OpenAI: https://platform.openai.com/api-keys 접속 → "Create new secret key" 버튼 → 키 복사
2) Anthropic: https://console.anthropic.com 접속 → "Create Key" 버튼 → 키 복사
3) 둘 중 하나만 있어도 사용 가능합니다.
4) 결제 수단을 등록하지 않으면 첫 사용 후 ${'₩'}5,000~10,000 충전 안내가 뜰 수 있어요.`,
  },
  {
    q: '비용이 얼마나 드나요?',
    a: `토큰당 가격이 다릅니다.
- 짧은 SNS 카피 1건: 약 ${'₩'}50~200
- 블로그 글 1편 (1000자): 약 ${'₩'}300~1,500
- 긴 보고서 1건 (3000자): 약 ${'₩'}1,000~5,000

대시보드에서 실시간 누적 사용량을 원화로 확인할 수 있어요.
무료 베타 기간에는 폴라리스 에이전시 자체 요금은 없습니다. (AI 모델 API 비용만 발생)`,
  },
  {
    q: '한국어로만 사용할 수 있나요?',
    a: `폴라리스 에이전시의 화면(UI)은 모두 한국어입니다.
AI에게는 영어로 시켜도 됩니다. 다만 시스템 프롬프트가 "한국어로 응답"하도록 설정되어 있어, 한국어 결과를 우선 받아요.
영어 결과가 필요하면 프롬프트 끝에 "(영어로 답해줘)"를 붙이면 됩니다.`,
  },
  {
    q: '회사 정보가 외부로 새지 않나요?',
    a: `1) Supabase의 Row-Level Security(RLS)로 본인 데이터만 조회 가능합니다.
2) API 키는 본인 계정에만 저장됩니다.
3) 단, AI 모델 제공사(OpenAI/Anthropic)에는 입력한 프롬프트가 전달됩니다. 민감한 개인정보·고객정보는 입력하지 마세요.
4) 무료 베타 기간 종료 시 모든 데이터를 안전하게 다운로드/삭제할 수 있습니다.`,
  },
  {
    q: '카카오 로그인이 안 돼요',
    a: `다음을 차례로 확인해주세요:
1) 팝업 차단 해제 (브라우저 주소창 옆 자물쇠 아이콘 클릭)
2) Chrome 또는 Safari 최신 버전 사용
3) 시크릿/프라이빗 모드 종료
4) 카카오 계정 로그아웃 후 다시 로그인
계속 안 되면 카카오톡 채널로 문의해주세요.`,
  },
] as const

export default function FaqPage() {
  useEffect(() => {
    track(Events.FAQ_VIEWED, {})
  }, [])

  const onKakaoClick = () => {
    track(Events.KAKAO_CHANNEL_CLICKED, {})
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">자주 묻는 질문</h1>

      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <details key={i} className="card cursor-pointer">
            <summary className="font-semibold list-none flex justify-between items-center">
              <span>{f.q}</span>
              <span className="text-gray-400 text-xs">⌄</span>
            </summary>
            <p className="mt-3 text-gray-700 whitespace-pre-line text-sm leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-8 card bg-yellow-50 border-yellow-200">
        <p className="mb-3 font-medium">더 궁금한 점이 있다면?</p>
        <a
          href="https://pf.kakao.com/_polaris_agency"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onKakaoClick}
          className="btn-kakao inline-block"
        >
          💬 카카오톡 채널로 문의하기
        </a>
      </div>
    </main>
  )
}
