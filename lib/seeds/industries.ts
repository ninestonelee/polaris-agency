import type { IndustryKey } from '@/lib/supabase/types'

export const INDUSTRY_TEMPLATES: Record<
  Exclude<IndustryKey, 'other'>,
  { label: string; icon: string; mission: string; tone: string }
> = {
  shopping: {
    label: '온라인 쇼핑몰',
    icon: '🛍️',
    mission: '합리적 가격의 좋은 제품을 추천한다',
    tone: '친근하고 신뢰감 있게',
  },
  cafe: {
    label: '카페·식음료',
    icon: '☕',
    mission: '단골 손님과의 일상적 소통',
    tone: '따뜻하고 캐주얼하게',
  },
  academy: {
    label: '학원·교육',
    icon: '📚',
    mission: '학생의 성장에 책임진다',
    tone: '전문적이고 따뜻하게',
  },
  clinic: {
    label: '병원·의료',
    icon: '🏥',
    mission: '환자의 불안을 줄이는 의료 정보',
    tone: '정중하고 정확하게',
  },
  manufacturing: {
    label: '제조·B2B',
    icon: '🏭',
    mission: '품질과 납기를 약속한다',
    tone: '신뢰감 있고 전문적으로',
  },
}

export const INDUSTRY_KEYS = Object.keys(INDUSTRY_TEMPLATES) as Array<keyof typeof INDUSTRY_TEMPLATES>
