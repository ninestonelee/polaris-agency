#!/usr/bin/env bash
# Supabase 프로젝트 자동 연결 + 마이그레이션 일괄 적용
# 사용법: bash scripts/setup-supabase.sh <project-ref>
# project-ref: Supabase Dashboard URL https://supabase.com/dashboard/project/<ref>/...

set -euo pipefail

SUPABASE_BIN="${SUPABASE_BIN:-$HOME/.local/bin/supabase}"

if [ ! -x "$SUPABASE_BIN" ]; then
  echo "❌ Supabase CLI를 찾을 수 없습니다: $SUPABASE_BIN"
  echo "   설치: brew install supabase/tap/supabase  또는"
  echo "        curl -sL https://github.com/supabase/cli/releases/latest/download/supabase_darwin_arm64.tar.gz | tar -xz -C ~/.local/bin"
  exit 1
fi

if [ $# -lt 1 ]; then
  echo "사용법: bash scripts/setup-supabase.sh <project-ref>"
  echo ""
  echo "project-ref 찾는 법:"
  echo "  Supabase Dashboard → 프로젝트 선택 → URL에서 /project/[여기]"
  echo "  예: https://supabase.com/dashboard/project/abcdefghijklmnop"
  echo "       → project-ref = abcdefghijklmnop"
  exit 1
fi

PROJECT_REF="$1"
cd "$(dirname "$0")/.."

echo "🔑 Supabase CLI 로그인 (브라우저가 열립니다)"
"$SUPABASE_BIN" login

echo ""
echo "🔗 프로젝트 연결 ($PROJECT_REF)"
"$SUPABASE_BIN" link --project-ref "$PROJECT_REF"

echo ""
echo "📥 마이그레이션 적용 (4개 SQL)"
"$SUPABASE_BIN" db push

echo ""
echo "✅ 완료!"
echo ""
echo "다음 단계:"
echo "  1) .env.local에 SUPABASE URL/Key 입력 (대시보드 → Settings → API)"
echo "  2) npm install"
echo "  3) npm run dev"
echo "  4) 카카오 OAuth는 Supabase Dashboard → Auth → Providers에서 수동 설정"
