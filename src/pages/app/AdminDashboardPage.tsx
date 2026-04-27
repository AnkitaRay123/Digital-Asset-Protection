import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import API_BASE_URL from '../../config/api'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────
interface AnalyticsData {
  total_media: number
  total_scans: number
  total_violations: number
  total_alerts: number
  avg_detection_time: string
  chart_data: { time: string; scans: number }[]
}

// ─── Fallback data shown instantly so UI never blocks ────────────────────────
function buildFallback(): AnalyticsData {
  const now = new Date()
  return {
    total_media: 0,
    total_scans: 0,
    total_violations: 0,
    total_alerts: 0,
    avg_detection_time: '—',
    chart_data: Array.from({ length: 24 }, (_, i) => {
      const d = new Date(now)
      d.setHours(d.getHours() - (23 - i))
      return {
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        scans: 0,
      }
    }),
  }
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string | number
  icon: string
  color: string
  sublabel?: string
  pulse?: boolean
}

function LiveStatCard({ label, value, icon, color, sublabel, pulse }: StatCardProps) {
  return (
    <article className="admin-stat-card" style={{ '--accent': color } as React.CSSProperties}>
      <div className="admin-stat-card__icon" aria-hidden="true">{icon}</div>
      <div className="admin-stat-card__body">
        <span className="admin-stat-card__label eyebrow">
          {label}
          {pulse && <span className="admin-live-dot" title="Live" />}
        </span>
        <strong className="admin-stat-card__value">{value}</strong>
        {sublabel && <p className="admin-stat-card__sub">{sublabel}</p>}
      </div>
    </article>
  )
}

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="admin-chart-tooltip">
      <span className="admin-chart-tooltip__label">{label}</span>
      <strong>{payload[0].value} scans</strong>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function AdminDashboardPage() {
  // Start with fallback so the page ALWAYS renders immediately
  const [data, setData] = useState<AnalyticsData>(buildFallback)
  // null = initial check, true = online, false = offline
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [refreshing, setRefreshing] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchAnalytics = async () => {
    setRefreshing(true)
    try {
      const controller = new AbortController()
      // Hard 5-second timeout — no more infinite loading
      const timer = setTimeout(() => controller.abort(), 5000)

      const res = await fetch(`${API_BASE_URL}/analytics`, {
        signal: controller.signal,
      })
      clearTimeout(timer)

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: AnalyticsData = await res.json()
      setData(json)
      setBackendOnline(true)
      setLastRefresh(new Date())
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === 'AbortError'
          ? 'Request timed out after 5s'
          : err instanceof Error
          ? err.message
          : 'Unknown error'
      console.warn('[AdminDashboard] Backend unreachable:', msg)
      setBackendOnline(false)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
    intervalRef.current = setInterval(fetchAnalytics, 10_000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cards: StatCardProps[] = [
    {
      label: 'Total Media',
      value: data.total_media,
      icon: '🎞',
      color: 'var(--cyan)',
      sublabel: 'Assets stored in database',
      pulse: backendOnline === true,
    },
    {
      label: 'Total Scans',
      value: data.total_scans,
      icon: '🔍',
      color: '#a78bfa',
      sublabel: 'Similarity checks performed',
      pulse: backendOnline === true,
    },
    {
      label: 'Violations Detected',
      value: data.total_violations,
      icon: '⚠️',
      color: 'var(--red)',
      sublabel: 'Incidents in database',
    },
    {
      label: 'Active Alerts',
      value: data.total_alerts,
      icon: '🚨',
      color: 'var(--amber)',
      sublabel: 'Alerts triggered total',
    },
    {
      label: 'Avg Detection Time',
      value: data.avg_detection_time,
      icon: '⏱',
      color: 'var(--green)',
      sublabel: 'Upload → first alert latency',
    },
  ]

  const isOffline = backendOnline === false

  return (
    <section className="page-section stack-lg admin-dashboard">
      {/* ── Header ── */}
      <header className="section-heading">
        <div>
          <span className="eyebrow">System Monitoring</span>
          <h1>Admin Live Dashboard</h1>
        </div>
        <div className="admin-refresh-info">
          <span
            className="admin-live-dot"
            style={
              isOffline
                ? { background: 'var(--amber)', boxShadow: '0 0 6px var(--amber)' }
                : {}
            }
          />
          <span>
            {isOffline ? 'Backend offline' : 'Auto-refreshes every 10s'}
          </span>
          <span className="admin-refresh-time">
            Last: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            className="button button--ghost"
            onClick={fetchAnalytics}
            disabled={refreshing}
            id="btn-refresh-analytics"
          >
            {refreshing ? '…' : '↻ Refresh'}
          </button>
        </div>
      </header>

      {/* ── Connecting indicator (first load only) ── */}
      {backendOnline === null && (
        <p
          style={{
            color: 'var(--muted)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span
            className="admin-spinner"
            style={{ width: 14, height: 14, borderWidth: 2, display: 'inline-block' }}
          />
          Connecting to backend…
        </p>
      )}

      {/* ── Offline warning banner (non-blocking) ── */}
      {isOffline && (
        <div className="admin-error-banner" role="alert">
          <span>⚠ Flask backend unreachable at {API_BASE_URL}</span>
          <span className="admin-error-hint">
            Restart the Flask server: in the <strong>backend/</strong> folder run{' '}
            <code>python app.py</code>. The page will auto-reconnect every 10 seconds.
          </span>
        </div>
      )}

      {/* ── Sub-Sections Navigation ── */}
      <div className="admin-nav-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <Link to="/app/admin/library" className="panel admin-stat-card admin-nav-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', transition: 'all 0.3s ease', border: '1px solid rgba(79, 241, 255, 0.2)', position: 'relative', overflow: 'hidden' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.6 }}
          >
            <source src="/nav-card-bg.mp4" type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10, 15, 30, 0.4) 0%, rgba(10, 15, 30, 0.8) 100%)', zIndex: 1 }} />
          
          <div className="stat-icon" style={{ background: 'rgba(79, 241, 255, 0.15)', color: 'var(--cyan)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', zIndex: 2, backdropFilter: 'blur(4px)', border: '1px solid rgba(79, 241, 255, 0.3)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#fff', zIndex: 2, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Media Library</h3>
          <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.8)', zIndex: 2 }}>Manage uploaded files</p>
        </Link>
        <Link to="/app/admin/incidents" className="panel admin-stat-card admin-nav-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', transition: 'all 0.3s ease', border: '1px solid rgba(251, 113, 133, 0.2)', position: 'relative', overflow: 'hidden' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.7 }}
          >
            <source src="/incidents-card-bg.mp4" type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10, 15, 30, 0.4) 0%, rgba(10, 15, 30, 0.8) 100%)', zIndex: 1 }} />

          <div className="stat-icon" style={{ background: 'rgba(251, 113, 133, 0.15)', color: 'var(--rose)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', zIndex: 2, backdropFilter: 'blur(4px)', border: '1px solid rgba(251, 113, 133, 0.3)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#fff', zIndex: 2, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Incidents</h3>
          <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.8)', zIndex: 2 }}>Review detected violations</p>
        </Link>
      </div>

      {/* ── Stat Cards — always visible ── */}
      <div className="admin-stat-grid">
        {cards.map((c) => (
          <LiveStatCard key={c.label} {...c} />
        ))}
      </div>

      {/* ── Scan Activity Chart ── */}
      <section className="panel stack-md admin-chart-panel">
        <header className="section-heading">
          <div>
            <span className="eyebrow">Last 24 Hours</span>
            <h2>Scan Activity Timeline</h2>
          </div>
        </header>

        {data.chart_data.every((d) => d.scans === 0) ? (
          <p className="admin-chart-empty">
            No scans recorded in the last 24 hours.{' '}
            {isOffline
              ? 'Start the Flask server then run a similarity test.'
              : 'Run a similarity test on the Upload page to see live data here.'}
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data.chart_data}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(151,161,203,0.12)" vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                stroke="#8ca0cf"
                interval={3}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="#8ca0cf"
                allowDecimals={false}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="scans"
                stroke="#a78bfa"
                strokeWidth={2.5}
                fill="url(#scanGradient)"
                dot={false}
                activeDot={{ r: 5, fill: '#a78bfa', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </section>


    </section>
  )
}
