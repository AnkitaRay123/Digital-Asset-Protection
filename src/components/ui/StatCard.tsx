import { motion } from 'framer-motion'
import type { DashboardMetric } from '../../types/models'

interface StatCardProps {
  metric: DashboardMetric
}

export function StatCard({ metric }: StatCardProps) {
  return (
    <motion.article
      className="panel stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <p className="stat-card__label">{metric.label}</p>
      <div className="stat-card__value-row">
        <strong>{metric.value}</strong>
        <span className={`trend-pill trend-pill--${metric.trend}`}>{metric.trend}</span>
      </div>
      <p className="muted">{metric.delta}</p>
    </motion.article>
  )
}
