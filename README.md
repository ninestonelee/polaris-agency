# 폴라리스 에이전시 (Polaris Agency)

> 한국 중소기업을 위한 가장 쉬운 AI 에이전트 SaaS — Paperclip 포크 + 한국형 SaaS화

## 빠른 시작

```bash
# 1) 의존성 설치
npm install

# 2) 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 Supabase URL/Key 입력

# 3) Supabase 마이그레이션 실행
# supabase/migrations/ 폴더의 SQL을 Supabase 대시보드에서 실행

# 4) 개발 서버 시작
npm run dev
# → http://localhost:3000
```

## 사전 준비 (사용자 액션)

1. **Supabase 프로젝트 생성**: https://supabase.com → New project (Seoul region, Free tier)
2. **카카오 디벨로퍼스**: https://developers.kakao.com → 앱 생성 → REST API 키
3. **OAuth Redirect URI**: `https://<project>.supabase.co/auth/v1/callback` 등록

## 프로젝트 구조

```
polaris-agency/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 비로그인 라우트
│   ├── (app)/               # 보호 라우트
│   └── api/                 # API 라우트
├── components/              # UI 컴포넌트
├── lib/                     # 비즈니스 로직
│   ├── agents/             # LLM 어댑터, 시스템 프롬프트
│   ├── analytics/          # Posthog
│   ├── format/             # 포맷터 (원화, 날짜)
│   ├── i18n/               # 한국어 메시지
│   ├── onboarding/         # 온보딩 store
│   ├── pricing/            # 모델별 가격
│   ├── seeds/              # 산업/에이전트 시드
│   └── supabase/           # Supabase 클라이언트
└── supabase/
    └── migrations/         # SQL 마이그레이션
```

## 8개 핵심 Feature

- **F01** 인증 (카카오/구글/이메일)
- **F02** 회사 만들기 (5개 산업 템플릿)
- **F03** 에이전트 프리셋 (8개 역할)
- **F04** 작업 실행 (OpenAI/Anthropic)
- **F05** 사용량 추적 (원화 환산)
- **F06** 한글 UI (Pretendard + 톤앤매너)
- **F07** 온보딩 마법사 (7단계)
- **F08** 베타 분석 (Posthog + FAQ)

## 라이선스

MIT (원본 Paperclip 라이선스 승계, `LICENSE` 참조)
