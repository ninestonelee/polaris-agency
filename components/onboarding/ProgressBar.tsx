interface Props {
  step: number
  total: number
}

export function ProgressBar({ step, total }: Props) {
  const pct = Math.round((step / total) * 100)
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>폴라리스 에이전시 시작하기</span>
        <span>{step} / {total}</span>
      </div>
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-1 bg-polaris-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
