import { Link } from 'react-router-dom'
import { formatPercent, formatRelativeTime } from '../../lib/formatters'
import type { PiracyAlert } from '../../types/models'
import { StatusBadge } from './StatusBadge'

interface AlertRowProps {
  alert: PiracyAlert
}

export function AlertRow({ alert }: AlertRowProps) {
  return (
    <article className="alert-row">
      <div className="alert-row__primary">
        <div>
          <div className="alert-row__title-line">
            <StatusBadge value={alert.severity} />
            <h3>{alert.sourcePlatform}</h3>
          </div>
          <p>{alert.summary}</p>
        </div>
      </div>

      <div className="alert-row__meta">
        <div>
          <span className="label">Confidence</span>
          <strong>{formatPercent(alert.confidence)}</strong>
        </div>
        <div>
          <span className="label">Status</span>
          <StatusBadge value={alert.status} />
        </div>
        <div>
          <span className="label">Updated</span>
          <strong>{formatRelativeTime(alert.matchedAt)}</strong>
        </div>
        <Link className="button button--ghost" to={`/app/alerts/${alert.id}`}>
          Open case
        </Link>
      </div>
    </article>
  )
}
