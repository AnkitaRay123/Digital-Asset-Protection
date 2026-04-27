import { useState, useEffect } from 'react'
import axios from 'axios'
import { Loader2, Trash2, RefreshCw, FileText, Search, Image as ImageIcon, Film } from 'lucide-react'
import { MediaSurface } from '../../components/ui/MediaSurface'

// ─── Types ────────────────────────────────────────────────────────────────────
interface MediaItem {
  _id: string
  filename: string
  type: 'image' | 'video'
  hashes: string[]
  upload_time: string
}

export function AdminMediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'All' | 'image' | 'video'>('All')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [isRescanning, setIsRescanning] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // ─── Data Fetching ──────────────────────────────────────────────────────────
  const fetchMedia = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get('http://localhost:5000/media')
      setMediaItems(res.data.media || [])
    } catch (err) {
      console.error('Failed to fetch media library:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchMedia() }, [])

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this media?')) return
    setDeletingId(id)
    try {
      await axios.delete(`http://localhost:5000/media/${id}`)
      setMediaItems((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      console.error('Failed to delete media:', err)
      alert('Failed to delete media')
    } finally {
      setDeletingId(null)
    }
  }

  const handleRescan = async (id: string) => {
    setIsRescanning(id)
    try {
      const res = await axios.post(`http://localhost:5000/media/rescan/${id}`)
      setMediaItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, hashes: res.data.hashes } : item))
      )
      alert('Media rescanned successfully!')
    } catch (err) {
      console.error('Failed to rescan media:', err)
      alert('Failed to rescan media')
    } finally {
      setIsRescanning(null)
    }
  }

  // ─── Filtering ──────────────────────────────────────────────────────────────
  const filteredMedia = mediaItems.filter((item) => {
    const matchesQuery = item.filename.toLowerCase().includes(query.toLowerCase())
    const matchesType = typeFilter === 'All' || item.type === typeFilter
    return matchesQuery && matchesType
  })

  // ─── Details Modal ──────────────────────────────────────────────────────────
  const renderDetailsModal = () => {
    if (!selectedItem) return null
    return (
      <div className="admin-modal-overlay" onClick={() => setSelectedItem(null)}>
        <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
          <header className="admin-modal__header">
            <h3>Media Details</h3>
            <button className="button button--ghost" onClick={() => setSelectedItem(null)}>✕</button>
          </header>
          <div className="admin-modal__content stack-md">
            <div className="admin-modal__preview">
              <MediaSurface
                src={`http://localhost:5000/uploads/${selectedItem.filename}`}
                kind={selectedItem.type as 'image' | 'video'}
                alt={selectedItem.filename}
              />
            </div>
            <div className="admin-modal__info">
              <p><strong>File Name:</strong> {selectedItem.filename}</p>
              <p><strong>Type:</strong> <span className="admin-chip">{selectedItem.type}</span></p>
              <p><strong>Uploaded:</strong> {new Date(selectedItem.upload_time).toLocaleString()}</p>
              <div className="admin-modal__hashes">
                <strong>Fingerprint Hash(es):</strong>
                {selectedItem.hashes && selectedItem.hashes.length > 0 ? (
                  <ul className="admin-hash-list">
                    {selectedItem.hashes.map((h, i) => <li key={i}><code>{h}</code></li>)}
                  </ul>
                ) : (
                  <p className="admin-hash-list--empty">No hashes found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Main Render ────────────────────────────────────────────────────────────
  return (
      <section className="page-section stack-lg admin-media-library">
        <header className="section-heading">
          <div>
            <span className="eyebrow">Admin Panel</span>
            <h1>Media Library Management</h1>
          </div>
        </header>

        {/* ── Toolbar ── */}
        <div className="admin-toolbar">
          <div className="search-input">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by filename..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="admin-filters">
            <button className={`admin-filter-btn ${typeFilter === 'All' ? 'active' : ''}`} onClick={() => setTypeFilter('All')}>All</button>
            <button className={`admin-filter-btn ${typeFilter === 'image' ? 'active' : ''}`} onClick={() => setTypeFilter('image')}><ImageIcon size={14} /> Images</button>
            <button className={`admin-filter-btn ${typeFilter === 'video' ? 'active' : ''}`} onClick={() => setTypeFilter('video')}><Film size={14} /> Videos</button>
          </div>
        </div>

        {/* ── Content ── */}
        {isLoading ? (
          <div className="admin-loading-state">
            <Loader2 className="spinner" size={32} />
            <p>Loading media library...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="admin-empty-state">
            <FileText size={48} opacity={0.5} />
            <h3>No Media Found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="admin-media-grid">
            {filteredMedia.map((item) => {
              const shortHash = item.hashes?.[0]?.substring(0, 8) || 'N/A'
              return (
                <article key={item._id} className="admin-media-card">
                  <div className="admin-media-card__preview">
                    <MediaSurface
                      src={`http://localhost:5000/uploads/${item.filename}`}
                      kind={item.type as 'image' | 'video'}
                      alt={item.filename}
                    />
                    <div className="admin-media-card__type-badge">
                      {item.type === 'image' ? <ImageIcon size={14} /> : <Film size={14} />}
                    </div>
                  </div>
                  <div className="admin-media-card__body">
                    <h4 className="admin-media-card__title" title={item.filename}>{item.filename}</h4>
                    <div className="admin-media-card__meta">
                      <span>{new Date(item.upload_time).toLocaleDateString()}</span>
                      <span className="admin-media-card__hash">Hash: <code>{shortHash}...</code></span>
                    </div>
                  </div>
                  <div className="admin-media-card__actions">
                    <button className="button button--secondary button--sm" onClick={() => setSelectedItem(item)}>View Details</button>
                    <button
                      className="button button--ghost button--sm"
                      onClick={() => handleRescan(item._id)}
                      disabled={isRescanning === item._id}
                      title="Re-run fingerprinting & AI similarity check"
                    >
                      {isRescanning === item._id ? <Loader2 className="spinner" size={16} /> : <RefreshCw size={16} />}
                    </button>
                    <button
                      className="button button--danger button--sm"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      title="Permanently delete"
                    >
                      {deletingId === item._id ? <Loader2 className="spinner" size={16} /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {renderDetailsModal()}
      </section>
  )
}
