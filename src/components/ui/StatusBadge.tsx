import { normalizeLabel } from '../../lib/formatters'

interface StatusBadgeProps {
  value: string
  tone?: string
}

export function StatusBadge({ value, tone }: StatusBadgeProps) {
  const normalizedTone = (tone ?? value).toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-')

  return (
    <span className={`status-badge status-badge--${normalizedTone}`}>
      {normalizeLabel(value)}
    </span>
  )
}
