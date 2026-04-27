import { useState, useEffect } from 'react'
import axios from 'axios'
import { Loader2, Trash2, CheckCircle, Search, ShieldAlert, ArrowUpRight } from 'lucide-react'
import { formatDateTime } from '../../lib/formatters'

interface Incident {
  _id: string
  source_url?: string
  media_url?: string
  matched_file: string
  similarity: number
  status: 'open' | 'resolved'
  created_at: string
}

export function AdminIncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'open' | 'resolved'>('All')

  // Action states
  const [resolvingId, setResolvingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // ─── Fetch Data ─────────────────────────────────────────────────────────────
  const fetchIncidents = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get('http://localhost:5000/incidents')
      setIncidents(res.data || [])
    } catch (err) {
      console.error('Failed to fetch incidents:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchIncidents()
  }, [])

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleResolve = async (id: string) => {
    setResolvingId(id)
    try {
      await axios.post(`http://localhost:5000/incidents/${id}/resolve`)
      setIncidents((prev) =>
        prev.map((inc) => (inc._id === id ? { ...inc, status: 'resolved' } : inc))
      )
    } catch (err) {
      console.error('Failed to resolve incident:', err)
      alert('Failed to resolve incident.')
    } finally {
      setResolvingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this incident? This action cannot be undone.')) return
    
    setDeletingId(id)
    try {
      await axios.delete(`http://localhost:5000/incidents/${id}`)
      setIncidents((prev) => prev.filter((inc) => inc._id !== id))
    } catch (err) {
      console.error('Failed to delete incident:', err)
      alert('Failed to delete incident.')
    } finally {
      setDeletingId(null)
    }
  }

  // ─── Filtering ──────────────────────────────────────────────────────────────
  const filteredIncidents = incidents
    .filter((inc) => {
      const q = query.toLowerCase()
      const matchesSearch =
        (inc.source_url && inc.source_url.toLowerCase().includes(q)) ||
        (inc.matched_file && inc.matched_file.toLowerCase().includes(q))
      
      const matchesStatus = statusFilter === 'All' || inc.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Sort by similarity descending, then by date
      if (b.similarity !== a.similarity) return b.similarity - a.similarity
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <section className="page-section stack-lg admin-incidents">
      <header className="section-heading">
        <div>
          <span className="eyebrow">Admin Panel</span>
          <h1>Incident Management</h1>
        </div>
      </header>

      {/* ── Toolbar ── */}
      <div className="admin-toolbar">
        <div className="search-input">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by URL or filename..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <div className="admin-filters">
          <button
            className={`admin-filter-btn ${statusFilter === 'All' ? 'active' : ''}`}
            onClick={() => setStatusFilter('All')}
          >
            All
          </button>
          <button
            className={`admin-filter-btn ${statusFilter === 'open' ? 'active' : ''}`}
            onClick={() => setStatusFilter('open')}
          >
            Open
          </button>
          <button
            className={`admin-filter-btn ${statusFilter === 'resolved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('resolved')}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="admin-loading-state">
          <Loader2 className="spinner" size={32} />
          <p>Loading incidents...</p>
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div className="admin-empty-state">
          <ShieldAlert size={48} opacity={0.5} />
          <h3>No Incidents Found</h3>
          <p>No violations match your current filters.</p>
        </div>
      ) : (
        <div className="admin-incident-list">
          {filteredIncidents.map((incident) => {
            const isResolved = incident.status === 'resolved'
            return (
              <article
                key={incident._id}
                className={`admin-incident-row ${isResolved ? 'admin-incident-row--resolved' : ''}`}
              >
                <div className="admin-incident-row__info">
                  <div className="admin-incident-row__header">
                    <span className={`admin-status-badge ${isResolved ? 'resolved' : 'open'}`}>
                      {incident.status.toUpperCase()}
                    </span>
                    <span className="admin-incident-row__date">
                      {incident.created_at ? formatDateTime(incident.created_at) : 'Unknown Date'}
                    </span>
                  </div>
                  
                  <div className="admin-incident-row__details stack-sm">
                    {incident.source_url && (
                      <p className="admin-incident-row__source">
                        <strong>Source:</strong>{' '}
                        <a href={incident.source_url} target="_blank" rel="noreferrer">
                          {incident.source_url} <ArrowUpRight size={14} />
                        </a>
                      </p>
                    )}
                    <p>
                      <strong>Matched File:</strong> {incident.matched_file}
                    </p>
                    <div className="admin-incident-row__similarity">
                      <strong>Similarity:</strong>
                      <div className="admin-progress-bar">
                        <div
                          className="admin-progress-bar__fill"
                          style={{
                            width: `${incident.similarity}%`,
                            background: incident.similarity > 90 ? 'var(--red)' : 'var(--amber)'
                          }}
                        />
                      </div>
                      <span>{incident.similarity.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="admin-incident-row__actions stack-sm">
                  {incident.media_url && (
                    <a
                      href={incident.media_url.startsWith('http') ? incident.media_url : `http://localhost:5000/uploads/${incident.media_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="button button--secondary button--sm"
                    >
                      View Media
                    </a>
                  )}
                  {!isResolved && (
                    <button
                      className="button button--ghost button--sm"
                      onClick={() => handleResolve(incident._id)}
                      disabled={resolvingId === incident._id}
                    >
                      {resolvingId === incident._id ? (
                        <Loader2 className="spinner" size={16} />
                      ) : (
                        <><CheckCircle size={16} style={{ marginRight: '0.4rem' }}/> Mark Resolved</>
                      )}
                    </button>
                  )}
                  <button
                    className="button button--danger button--sm"
                    onClick={() => handleDelete(incident._id)}
                    disabled={deletingId === incident._id}
                  >
                    {deletingId === incident._id ? (
                      <Loader2 className="spinner" size={16} />
                    ) : (
                      <><Trash2 size={16} style={{ marginRight: '0.4rem' }}/> Delete</>
                    )}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
