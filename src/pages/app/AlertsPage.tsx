import { useDeferredValue, useMemo, useState } from 'react'
import { AlertRow } from '../../components/ui/AlertRow'
import { EmptyState } from '../../components/ui/EmptyState'
import { useAppContext } from '../../context/AppContext'

export function AlertsPage() {
  const { alerts } = useAppContext()
  const [severity, setSeverity] = useState('All')
  const [status, setStatus] = useState('All')
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const filteredAlerts = useMemo(
    () =>
      alerts.filter((alert) => {
        const matchesSeverity = severity === 'All' || alert.severity === severity
        const matchesStatus = status === 'All' || alert.status === status
        const matchesQuery =
          alert.summary.toLowerCase().includes(deferredQuery.toLowerCase()) ||
          alert.sourcePlatform.toLowerCase().includes(deferredQuery.toLowerCase())
        return matchesSeverity && matchesStatus && matchesQuery
      }),
    [alerts, deferredQuery, severity, status],
  )

  return (
    <section className="page-section stack-lg">
      <div className="toolbar">
        <label className="field">
          <span>Search cases</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search alert summary" />
        </label>
        <label className="field">
          <span>Severity</span>
          <select value={severity} onChange={(event) => setSeverity(event.target.value)}>
            <option>All</option>
            <option>critical</option>
            <option>high</option>
            <option>medium</option>
            <option>low</option>
          </select>
        </label>
        <label className="field">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All</option>
            <option>open</option>
            <option>in_review</option>
            <option>escalated</option>
            <option>takedown_requested</option>
            <option>false_positive</option>
          </select>
        </label>
      </div>

      {filteredAlerts.length === 0 ? (
        <EmptyState title="No cases found." description="Change the filters or wait for the next simulated alert refresh." />
      ) : (
        <div className="panel alert-list">
          {filteredAlerts.map((alert) => (
            <AlertRow key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </section>
  )
}
