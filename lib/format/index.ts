export function formatKRW(amount: number): string {
  return `₩${Math.round(amount).toLocaleString('ko-KR')}`
}

export function formatKRWPrecise(amount: number): string {
  if (amount < 1) return `₩${amount.toFixed(2)}`
  return formatKRW(amount)
}

export function formatNumber(n: number): string {
  return n.toLocaleString('ko-KR')
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}일 전`
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}초`
  const minutes = Math.floor(ms / 60_000)
  return `${minutes}분 ${Math.floor((ms % 60_000) / 1000)}초`
}
