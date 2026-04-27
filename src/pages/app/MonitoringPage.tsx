import { useEffect } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartFrame } from '../../components/ui/ChartFrame'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useAppContext } from '../../context/AppContext'
import { formatPercent, formatRelativeTime } from '../../lib/formatters'

export function MonitoringPage() {
  const { threatSignals, liveTrend } = useAppContext()

  useEffect(() => {
    // Play monitoring startup sound when this page is opened
    new Audio('/monitoring-start.mp3').play().catch(e => console.log('Monitoring audio blocked', e))
  }, [])

  const platformSummary = Array.from(
    threatSignals.reduce<Map<string, { platform: string; count: number; maxVelocity: number }>>((map, signal) => {
      const current = map.get(signal.platform) ?? { platform: signal.platform, count: 0, maxVelocity: 0 }
      current.count += 1
      current.maxVelocity = Math.max(current.maxVelocity, signal.velocityScore)
      map.set(signal.platform, current)
      return map
    }, new Map()).values(),
  )

  return (
    <section className="page-section stack-lg">
      <ChartFrame title="Propagation anomaly stream" kicker="BigQuery ML simulation">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={liveTrend}>
            <CartesianGrid stroke="rgba(151, 161, 203, 0.12)" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#8ca0cf" />
            <YAxis tickLine={false} axisLine={false} stroke="#8ca0cf" />
            <Tooltip />
            <Area type="monotone" dataKey="anomalyIndex" stroke="#ff5fd2" fill="rgba(255,95,210,0.22)" />
            <Area type="monotone" dataKey="takedowns" stroke="#4ff1ff" fill="rgba(79,241,255,0.16)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartFrame>

      <div className="card-grid card-grid--tight">
        {platformSummary.map((item) => (
          <article key={item.platform} className="panel platform-card">
            <span className="eyebrow">{item.platform}</span>
            <strong>{item.count} active signals</strong>
            <p>Peak velocity {formatPercent(item.maxVelocity)}</p>
          </article>
        ))}
      </div>

      <section className="panel stack-md">
        <header className="section-heading">
          <div>
            <span className="eyebrow">Watchlist</span>
            <h2>Live suspicious clips</h2>
          </div>
        </header>

        {threatSignals.map((signal) => (
          <article key={signal.id} className="watchlist-row">
            <div>
              <div className="alert-row__title-line">
                <StatusBadge value={signal.status} />
                <h3>{signal.platform}</h3>
              </div>
              <p>{signal.url}</p>
            </div>
            <div className="watchlist-row__stats">
              <span>Velocity {formatPercent(signal.velocityScore)}</span>
              <span>Anomaly {formatPercent(signal.anomalyScore)}</span>
              <span>{formatRelativeTime(signal.detectedAt)}</span>
            </div>
          </article>
        ))}
      </section>
    </section>
  )
}
