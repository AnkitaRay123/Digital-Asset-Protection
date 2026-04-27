import { useDeferredValue, useMemo, useState, useEffect } from 'react'
import { EmptyState } from '../../components/ui/EmptyState'
import { MediaSurface } from '../../components/ui/MediaSurface'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useAppContext } from '../../context/AppContext'
import { formatDateTime } from '../../lib/formatters'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

export function LibraryPage() {
  const { mediaAssets } = useAppContext()
  const [query, setQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState('All')
  const deferredQuery = useDeferredValue(query)
  const [backendAssets, setBackendAssets] = useState<{ _id: string; filename: string; type: string; hashes: string[]; upload_time: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get('http://localhost:5000/media')
        setBackendAssets(response.data.media || [])
      } catch (err) {
        new Audio('/failed-sound.mp3').play().catch(e => console.log('Failed sound blocked', e))
        console.error('Failed to fetch backend media', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMedia()
  }, [])

  const sources = ['All', ...new Set(mediaAssets.map((asset) => asset.sourceType))]
  const filteredAssets = useMemo(
    () =>
      mediaAssets.filter((asset) => {
        const matchesQuery = asset.title.toLowerCase().includes(deferredQuery.toLowerCase())
        const matchesSource = sourceFilter === 'All' || asset.sourceType === sourceFilter
        return matchesQuery && matchesSource
      }),
    [deferredQuery, mediaAssets, sourceFilter],
  )

  const getHashForAsset = (title: string) => {
    const found = backendAssets.find(b => b.filename.includes(title) || title.includes(b.filename.split('.')[0]))
    if (found && found.hashes && found.hashes.length > 0) return found.hashes[0]
    // Generate a consistent pseudo-random hex string based on the title for mock data
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hex = (hash >>> 0).toString(16).padStart(8, '0');
    return `${hex}e4b2a1c9...`; 
  }

  return (
    <section className="page-section stack-lg">
      <div className="toolbar">
        <label className="field">
          <span>Search library</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title" />
        </label>
        <label className="field">
          <span>Source type</span>
          <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 className="animate-spin" size={48} color="#38bdf8" />
        </div>
      ) : filteredAssets.length === 0 && backendAssets.length === 0 ? (
        <EmptyState title="No assets match this filter." description="Try another source type or broaden the search." />
      ) : (
        <div className="card-grid">
          {/* Render Backend Fingerprints First */}
          {backendAssets.map((bAsset) => (
            <article key={bAsset._id} className="panel media-card" style={{ border: '1px solid #38bdf8' }}>
              <MediaSurface 
                src={`http://localhost:5000/uploads/${bAsset.filename}`} 
                alt={bAsset.filename} 
                eyebrow={bAsset.type} 
                title={bAsset.filename} 
                kind={bAsset.type === 'video' ? 'video' : 'image'} 
              />
              <div className="media-card__content">
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>File: {bAsset.filename}</h3>
                <p className="muted" style={{ textTransform: 'capitalize' }}>{bAsset.type} Asset</p>
                <div style={{ background: '#020617', padding: '8px', borderRadius: '4px', marginTop: '10px' }}>
                  <p className="muted" style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Fingerprint Hash:</p>
                  <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem', color: '#38bdf8', wordBreak: 'break-all' }}>
                    {bAsset.hashes && bAsset.hashes.length > 0 ? bAsset.hashes[0] : 'N/A'}
                  </p>
                </div>
                <p className="muted" style={{ marginTop: '10px' }}>Uploaded {new Date(bAsset.upload_time).toLocaleString()}</p>
              </div>
            </article>
          ))}
          
          {/* Render Mock App Assets */}
          {filteredAssets.map((asset) => (
            <article key={asset.id} className="panel media-card">
              <MediaSurface 
                src={asset.videoSrc} 
                alt={asset.title} 
                eyebrow={asset.sportCategory} 
                title={asset.title} 
                kind={asset.videoSrc?.match(/\.(mp4|avi|mov|mkv|webm)$/i) ? 'video' : 'image'}
              />
              <div className="media-card__content">
                <p className="muted">{asset.sourceType}</p>
                <div className="badge-row">
                  <StatusBadge value={asset.watermarkStatus} />
                  <StatusBadge value={asset.embeddingStatus} />
                  <StatusBadge value={asset.indexStatus} />
                </div>
                <div style={{ background: '#0f172a', padding: '8px', borderRadius: '4px', marginTop: '10px' }}>
                  <p className="muted" style={{ margin: 0, fontSize: '0.8rem' }}>Fingerprint Hash:</p>
                  <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8', wordBreak: 'break-all' }}>
                    {getHashForAsset(asset.title)}
                  </p>
                </div>
                <p className="muted" style={{ marginTop: '10px' }}>Uploaded {formatDateTime(asset.uploadedAt)}</p>
                <strong>{asset.duration}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
