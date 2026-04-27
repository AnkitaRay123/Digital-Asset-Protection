import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartFrame } from '../../components/ui/ChartFrame'
import { MediaSurface } from '../../components/ui/MediaSurface'
import { StatCard } from '../../components/ui/StatCard'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useAppContext } from '../../context/AppContext'
import { formatRelativeTime } from '../../lib/formatters'

export function OverviewPage() {
  const { dashboardMetrics, liveTrend, alerts, mediaAssets } = useAppContext()
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<any[]>([])
  const [hasScanned, setHasScanned] = useState(false)
  const [liveAlerts, setLiveAlerts] = useState<any[]>([])

  const prevAlertsLengthRef = useRef<number>(0)
  const isInitialFetchRef = useRef<boolean>(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('http://localhost:5000/alerts')
        const data = await res.json()
        if (data.alerts) {
          const newLength = data.alerts.length
          if (!isInitialFetchRef.current && newLength > prevAlertsLengthRef.current) {
             // A new alert has risen!
             new Audio('/alert-sound.mp3').play().catch(e => console.log('Alert sound blocked', e))
          }
          
          isInitialFetchRef.current = false
          prevAlertsLengthRef.current = newLength
          setLiveAlerts(data.alerts)
        }
      } catch (err) {
        new Audio('/failed-sound.mp3').play().catch(e => console.log('Failed sound blocked', e))
        console.error('Failed to fetch live alerts', err)
      }
    }
    
    fetchAlerts()
    const intervalId = setInterval(fetchAlerts, 5000)
    
    return () => clearInterval(intervalId)
  }, [])

  const handleScan = async () => {
    new Audio('/action-sound.mp3').play().catch(e => console.log('Audio blocked', e))
    setIsScanning(true)
    setHasScanned(false)
    try {
      const res = await fetch('http://localhost:5000/scan-web')
      const data = await res.json()
      if (data.violations) {
        setScanResults(data.violations)
      }
    } catch (err) {
      new Audio('/failed-sound.mp3').play().catch(e => console.log('Failed sound blocked', e))
      console.error(err)
    } finally {
      setIsScanning(false)
      setHasScanned(true)
    }
  }

  const processingSummary = [
    {
      label: 'Watermarked',
      count: mediaAssets.filter((asset) => asset.watermarkStatus === 'secured').length,
    },
    {
      label: 'Embedding ready',
      count: mediaAssets.filter((asset) => asset.embeddingStatus === 'ready').length,
    },
    {
      label: 'Indexed',
      count: mediaAssets.filter((asset) => asset.indexStatus === 'indexed').length,
    },
  ]

  return (
    <>
      <section className="page-section page-grid page-grid--stats">
        {dashboardMetrics.map((metric) => (
          <StatCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="page-section page-grid page-grid--two">
        <ChartFrame title="Detection pulse" kicker="Monitoring">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={liveTrend}>
              <CartesianGrid stroke="rgba(151, 161, 203, 0.15)" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#8ca0cf" />
              <YAxis tickLine={false} axisLine={false} stroke="#8ca0cf" />
              <Tooltip />
              <Line type="monotone" dataKey="liveMatches" stroke="#4ff1ff" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="anomalyIndex" stroke="#ff5fd2" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartFrame>

        <section className="panel stack-lg">
          <header className="section-heading">
            <div>
              <span className="eyebrow">Pipeline readiness</span>
              <h2>Media supply chain</h2>
            </div>
          </header>

          <div className="metric-band metric-band--compact">
            {processingSummary.map((item) => (
              <div key={item.label} className="metric-chip">
                <strong>{item.count}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <MediaSurface
            src={mediaAssets[0].videoSrc || mediaAssets[0].thumbnail}
            kind={mediaAssets[0].videoSrc ? 'video' : 'image'}
            alt={mediaAssets[0].title}
            eyebrow={mediaAssets[0].sportCategory}
            title={mediaAssets[0].title}
          />

          <Link className="button" to="/app/upload">
            Add protected media
          </Link>
        </section>
      </section>

      <section className="page-section">
        <section className="panel stack-md">
          <header className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="eyebrow">Web Crawler</span>
              <h2>Internet Scan</h2>
            </div>
            <button className="button" onClick={handleScan} disabled={isScanning}>
              {isScanning ? 'Scanning...' : 'Scan Internet'}
            </button>
          </header>
          
          {scanResults.length > 0 ? (
            <div className="story-card" style={{ marginTop: '1rem' }}>
              <h3>Detected Violations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {scanResults.map((v, i) => (
                  <div key={i} style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '4px' }}><strong>URL:</strong> {v.url}</div>
                    <div style={{ marginBottom: '4px' }}><strong>Similarity:</strong> {v.similarity}%</div>
                    <div><strong>Matched With:</strong> {v.matched_file}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : hasScanned ? (
            <div className="story-card" style={{ marginTop: '1rem' }}>
              <h3>Scan Complete</h3>
              <p style={{ marginTop: '0.5rem', color: '#a0aabf' }}>No new violations detected on the scanned internet sources.</p>
            </div>
          ) : null}
        </section>
      </section>

      <section className="page-section page-grid page-grid--two">
        <section className="panel stack-md">
          <header className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="eyebrow">Real-Time Tracker</span>
              <h2 style={{ display: 'flex', alignItems: 'center' }}>
                Live Alerts 
                {liveAlerts.filter(a => a.status === 'new').length > 0 && (
                  <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', marginLeft: '8px' }}>
                    {liveAlerts.filter(a => a.status === 'new').length}
                  </span>
                )}
              </h2>
            </div>
            <button className="button button--ghost" onClick={async () => {
              await fetch('http://localhost:5000/alerts/mark-read', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
            }}>
              Mark all read
            </button>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {liveAlerts.length === 0 ? (
               <p style={{ color: '#94a3b8' }}>No live alerts detected.</p>
            ) : liveAlerts.map((alert) => (
              <article key={alert._id} className="incident-card" style={{ borderLeft: alert.status === 'new' ? '4px solid #ef4444' : '4px solid #334155' }}>
                <div className="incident-card__header" style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🚨</span>
                  <strong style={{ color: 'white', fontSize: '1.05rem' }}>New Violation Detected</strong>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>Source:</strong> {alert.source_url}</div>
                  <div><strong>Similarity:</strong> {alert.similarity}%</div>
                  <div><strong>Type:</strong> {alert.type}</div>
                  <div><strong>Time:</strong> {new Date(alert.timestamp).toLocaleTimeString()}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel stack-md">
          <header className="section-heading">
            <div>
              <span className="eyebrow">Priority queue</span>
              <h2>Active incidents</h2>
            </div>
            <Link className="button button--ghost" to="/app/alerts">
              View all
            </Link>
          </header>

          {alerts.slice(0, 3).map((alert) => (
            <article key={alert.id} className="incident-card">
              <div className="incident-card__header">
                <StatusBadge value={alert.severity} />
                <StatusBadge value={alert.status} />
              </div>
              <h3>{alert.sourcePlatform}</h3>
              <p>{alert.summary}</p>
              <div className="incident-card__footer">
                <span>{formatRelativeTime(alert.matchedAt)}</span>
                <Link to={`/app/alerts/${alert.id}`}>Inspect evidence</Link>
              </div>
            </article>
          ))}
        </section>

        <section className="panel stack-md">
          <header className="section-heading">
            <div>
              <span className="eyebrow">Narrative</span>
              <h2>Minutes saved vs manual takedown</h2>
            </div>
          </header>

          <div className="story-card">
            <strong>47 minutes saved in the current fixture window</strong>
            <p>
              Detection, verification, and enforcement are compressed into a single workflow. Instead of waiting for
              user reports, the dashboard surfaces likely piracy clusters while they are still monetizable.
            </p>
            <ul className="signal-list">
              <li>New live threats surfaced in under 5 minutes.</li>
              <li>Context analysis distinguishes fair-use discussion from redistribution intent.</li>
              <li>Case evidence stays attached to every automated action.</li>
            </ul>
          </div>
        </section>
      </section>
    </>
  )
}
