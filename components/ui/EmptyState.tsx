interface Props {
  emoji?: string
  title: string
  description?: string
  cta?: { label: string; href: string }
}

export function EmptyState({ emoji = '✨', title, description, cta }: Props) {
  return (
    <div className="card text-center py-12 px-6">
      <div className="text-5xl mb-3">{emoji}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      {cta && (
        <a href={cta.href} className="btn-primary inline-block">
          {cta.label}
        </a>
      )}
    </div>
  )
}
