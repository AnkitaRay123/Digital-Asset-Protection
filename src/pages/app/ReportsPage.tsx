import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartFrame } from '../../components/ui/ChartFrame'
import { useAppContext } from '../../context/AppContext'
import { formatPercent } from '../../lib/formatters'

export function ReportsPage() {
  const { reportTrend, platformBreakdown, alerts, mediaAssets } = useAppContext()

  const targetedAssets = mediaAssets.map((asset) => ({
    title: asset.title,
    incidents: alerts.filter((alert) => alert.assetId === asset.id).length,
  }))

  return (
    <section className="page-section stack-lg">
      <div className="page-grid page-grid--two">
        <ChartFrame title="Weekly enforcement" kicker="Operational history">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={reportTrend}>
              <CartesianGrid stroke="rgba(151, 161, 203, 0.15)" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#8ca0cf" />
              <YAxis tickLine={false} axisLine={false} stroke="#8ca0cf" />
              <Tooltip />
              <Bar dataKey="takedowns" fill="#4ff1ff" radius={[6, 6, 0, 0]} />
              <Bar dataKey="falsePositives" fill="#ffb347" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>

        <ChartFrame title="Response latency" kicker="Efficiency">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={reportTrend}>
              <CartesianGrid stroke="rgba(151, 161, 203, 0.15)" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#8ca0cf" />
              <YAxis tickLine={false} axisLine={false} stroke="#8ca0cf" />
              <Tooltip />
              <Line type="monotone" dataKey="responseMinutes" stroke="#ff5fd2" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>

      <div className="page-grid page-grid--two">
        <section className="panel stack-md">
          <span className="eyebrow">Top targeted assets</span>
          <h2>Content at highest risk</h2>
          <div className="rank-list">
            {targetedAssets.map((asset) => (
              <div key={asset.title} className="rank-list__row">
                <strong>{asset.title}</strong>
                <span>{asset.incidents} linked cases</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel stack-md">
          <span className="eyebrow">Platform performance</span>
          <h2>Enforcement rates</h2>
          <div className="rank-list">
            {platformBreakdown.map((item) => (
              <div key={item.platform} className="rank-list__row">
                <strong>{item.platform}</strong>
                <span>{formatPercent(item.enforcementRate)} resolved · {item.incidents} incidents</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
