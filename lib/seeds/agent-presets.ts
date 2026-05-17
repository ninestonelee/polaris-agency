import type { AgentRoleKey } from '@/lib/supabase/types'

export interface AgentPreset {
  role: AgentRoleKey
  name: string
  emoji: string
  recommended_model: string
  description: string
  sample_prompt: string
}

export const AGENT_PRESETS: AgentPreset[] = [
  {
    role: 'ceo',
    name: 'CEO 폴라',
    emoji: '⭐',
    recommended_model: 'gpt-4o',
    description: '전략·비전·의사결정을 함께 고민하는 임원',
    sample_prompt: '다음 분기 우리 회사의 핵심 KPI 3개를 제안해줘',
  },
  {
    role: 'marketer',
    name: '마케터 루나',
    emoji: '🌙',
    recommended_model: 'claude-sonnet-4-20250514',
    description: 'SNS·광고 카피를 빠르게 뽑아주는 마케터',
    sample_prompt: '신상품 인스타 카피를 3가지 톤으로 써줘',
  },
  {
    role: 'writer',
    name: '작가 노바',
    emoji: '✍️',
    recommended_model: 'claude-sonnet-4-20250514',
    description: '블로그·뉴스레터·장문 콘텐츠 전문가',
    sample_prompt: '우리 브랜드 스토리를 3분량 블로그 글로 써줘',
  },
  {
    role: 'editor',
    name: '편집자 시리우스',
    emoji: '📝',
    recommended_model: 'gpt-4o',
    description: '교정·톤 통일·문맥 다듬기 담당',
    sample_prompt: '아래 글의 톤을 더 신뢰감 있게 다듬어줘\n\n[글 붙여넣기]',
  },
  {
    role: 'designer',
    name: '디자이너 베가',
    emoji: '🎨',
    recommended_model: 'claude-sonnet-4-20250514',
    description: '디자인 시안·컬러·텍스트 가이드 제안',
    sample_prompt: '봄 시즌 메인 배너의 카피와 색상 톤을 제안해줘',
  },
  {
    role: 'sales',
    name: '영업 알타이르',
    emoji: '💼',
    recommended_model: 'gpt-4o',
    description: '제안서·콜드 메일·응대 멘트 작성',
    sample_prompt: '소상공인 협력 제안 메일을 짧게 써줘',
  },
  {
    role: 'support',
    name: '고객지원 미라',
    emoji: '💬',
    recommended_model: 'claude-3-5-haiku-latest',
    description: 'FAQ·응대 템플릿·CS 가이드 빠르게',
    sample_prompt: '배송 지연 문의에 대한 정중한 응대 메시지를 작성해줘',
  },
  {
    role: 'analyst',
    name: '분석가 카펠라',
    emoji: '📊',
    recommended_model: 'gpt-4o',
    description: '데이터 요약·인사이트·실행 제안',
    sample_prompt: '이번 주 매출이 전주 대비 15% 증가했어. 분석과 다음 액션을 제안해줘',
  },
]

export function findPreset(role: AgentRoleKey): AgentPreset {
  const p = AGENT_PRESETS.find((x) => x.role === role)
  if (!p) throw new Error(`Unknown agent role: ${role}`)
  return p
}
