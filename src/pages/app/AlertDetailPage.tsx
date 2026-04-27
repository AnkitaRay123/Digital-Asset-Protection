import { Link, useParams } from 'react-router-dom'
import { MediaSurface } from '../../components/ui/MediaSurface'
import { EmptyState } from '../../components/ui/EmptyState'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useAppContext } from '../../context/AppContext'
import { formatDateTime, formatPercent } from '../../lib/formatters'

export function AlertDetailPage() {
  const { id } = useParams()
  const { alerts, mediaAssets, evidence, openModal } = useAppContext()

  const alert = alerts.find((item) => item.id === id)

  if (!alert) {
    return <EmptyState title="Case not found." description="The alert may have been cleared from the active queue." />
  }

  const asset = mediaAssets.find((item) => item.id === alert.assetId)
  const caseEvidence = evidence[alert.id]

  if (!asset || !caseEvidence) {
    return <EmptyState title="Evidence missing." description="This demo case is missing its linked asset or evidence." />
  }

  return (
    <section className="page-section stack-lg">
      <div className="page-backlink">
        <Link to="/app/alerts">Back to alerts</Link>
      </div>

      <section className="page-grid page-grid--two">
        <article className="panel stack-md">
          <header className="section-heading">
            <div>
              <span className="eyebrow">Matched asset</span>
              <h2>{asset.title}</h2>
            </div>
          </header>
          <MediaSurface src={asset.videoSrc} alt={asset.title} eyebrow={asset.sportCategory} title={asset.sourceType} />
          <div className="badge-row">
            <StatusBadge value={alert.severity} />
            <StatusBadge value={alert.status} />
          </div>
          <p>{alert.summary}</p>
        </article>

        <article className="panel stack-md">
          <span className="eyebrow">Reasoning summary</span>
          <h2>Gemini-style verification</h2>
          <p>{caseEvidence.reasoningSummary}</p>
          <div className="metric-band metric-band--compact">
            <div className="metric-chip">
              <strong>{formatPercent(caseEvidence.similarityScore)}</strong>
              <span>Similarity</span>
            </div>
            <div className="metric-chip">
              <strong>{formatDateTime(alert.matchedAt)}</strong>
              <span>Matched at</span>
            </div>
          </div>
          <p className="muted">{caseEvidence.recommendedAction}</p>
        </article>
      </section>

      <section className="page-grid page-grid--two">
        <article className="panel stack-md">
          <span className="eyebrow">Context evidence</span>
          <h2>Transcript and surrounding text</h2>
          <p>{caseEvidence.transcriptSnippet}</p>
          <p className="muted">{caseEvidence.contextText}</p>

          <div className="thumbnail-strip">
            {caseEvidence.extractedFrames.map((frame, index) => (
              <img key={`${frame}-${index}`} src={frame} alt={`Evidence frame ${index + 1}`} />
            ))}
          </div>
        </article>

        <article className="panel stack-md">
          <span className="eyebrow">Action panel</span>
          <h2>Case controls</h2>
          <div className="button-group">
            <button className="button" type="button" onClick={() => openModal('takedown', alert.id)}>
              Request takedown
            </button>
            <button className="button button--ghost" type="button" onClick={() => openModal('assign', alert.id)}>
              Assign owner
            </button>
            <button className="button button--ghost" type="button" onClick={() => openModal('escalate', alert.id)}>
              Escalate
            </button>
            <button
              className="button button--ghost"
              type="button"
              onClick={() => openModal('false_positive', alert.id)}
            >
              Mark false positive
            </button>
          </div>
        </article>
      </section>

      <section className="panel stack-md">
        <span className="eyebrow">Activity log</span>
        <h2>Evidence timeline</h2>
        <div className="timeline-list">
          {caseEvidence.activityLog.map((entry) => (
            <article key={entry.id} className="timeline-entry">
              <div className="timeline-entry__dot" />
              <div>
                <strong>{entry.action}</strong>
                <p>{entry.detail}</p>
                <span>{entry.actor} · {formatDateTime(entry.timestamp)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
