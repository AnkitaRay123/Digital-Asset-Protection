interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="panel empty-state">
      <span className="eyebrow">Nothing here yet</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}
