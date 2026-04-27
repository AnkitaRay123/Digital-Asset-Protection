import { useEffect, useMemo, useState } from 'react'
import { MediaSurface } from '../../components/ui/MediaSurface'
import { useAppContext } from '../../context/AppContext'
import { heroMedia } from '../../data/mockData'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

export function UploadPage() {
  const { addUpload, mediaAssets, recentUploadId } = useAppContext()
  const [title, setTitle] = useState('Weekend Prime Match Feed')
  const [sportCategory, setSportCategory] = useState('Football')
  const [sourceType, setSourceType] = useState('Live broadcast')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState(heroMedia.uploadPreview)
  
  // New States for API
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [fingerprintHash, setFingerprintHash] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [similarityResult, setSimilarityResult] = useState<{ match: boolean; similarity: number; matched_file: string; label: string } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(
    () => () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    },
    [previewUrl],
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null
    setSelectedFile(nextFile)
    setFingerprintHash(null)
    setSimilarityResult(null)
    setErrorMessage(null)
    setUploadStatus('')
    
    setPreviewUrl((currentPreview) => {
      if (currentPreview.startsWith('blob:')) {
        URL.revokeObjectURL(currentPreview)
      }
      return nextFile ? URL.createObjectURL(nextFile) : heroMedia.uploadPreview
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    new Audio('/action-sound.mp3').play().catch(e => console.log('Audio blocked', e))

    if (!selectedFile) {
      return
    }

    setIsUploading(true)
    setErrorMessage(null)
    setSimilarityResult(null)
    setUploadStatus('uploading')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      setUploadStatus('watermarking')
      // Simulate watermarking step for UI
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setUploadStatus('fingerprinting')
      const response = await axios.post('http://localhost:5000/upload-media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const data = response.data.data
      const hash = data.hashes && data.hashes.length > 0 ? data.hashes[0] : null
      
      setUploadStatus('indexed')
      if (hash) {
        setFingerprintHash(hash)
      }

      addUpload({ title, sportCategory, sourceType, file: selectedFile, filename: data?.filename })
      new Audio('/upload-success.mp3').play().catch(e => console.log('Success audio blocked', e))
      
    } catch (error: unknown) {
      new Audio('/failed-sound.mp3').play().catch(e => console.log('Failed sound blocked', e))
      const err = error as { response?: { data?: { error?: string } } };
      console.error('Upload error:', error)
      setErrorMessage(err.response?.data?.error || 'Failed to upload media')
      setUploadStatus('error')
    } finally {
      setIsUploading(false)
    }
  }

  const checkSimilarity = async () => {
    if (!selectedFile) return
    new Audio('/action-sound.mp3').play().catch(e => console.log('Audio blocked', e))
    
    setIsChecking(true)
    setSimilarityResult(null)
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await axios.post('http://localhost:5000/test-similarity', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setSimilarityResult(response.data)
      console.log('Similarity result:', response.data)
    } catch (error: unknown) {
      new Audio('/failed-sound.mp3').play().catch(e => console.log('Failed sound blocked', e))
      const err = error as { response?: { data?: { error?: string } } };
      console.error('Similarity check error:', error)
      setErrorMessage(err.response?.data?.error || 'Failed to check similarity')
    } finally {
      setIsChecking(false)
    }
  }

  const pipeline = [
    { label: 'Upload accepted', active: uploadStatus !== '' },
    { label: 'Invisible watermarking', active: ['watermarking', 'fingerprinting', 'indexed'].includes(uploadStatus) },
    { label: 'Fingerprint generated', active: ['fingerprinting', 'indexed'].includes(uploadStatus) },
    { label: 'Indexed in Database', active: uploadStatus === 'indexed' },
  ]

  return (
    <section className="page-section page-grid page-grid--two">
      <div className="stack-md">
        <form className="panel stack-md" onSubmit={handleSubmit}>
          <header className="section-heading">
            <div>
              <span className="eyebrow">Backend ingest</span>
              <h2>Upload & Fingerprint</h2>
            </div>
          </header>

          <label className="field">
            <span>Asset title</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>

          <div className="form-grid">
            <label className="field">
              <span>Sport category</span>
              <select value={sportCategory} onChange={(event) => setSportCategory(event.target.value)}>
                <option>Football</option>
                <option>Cricket</option>
                <option>Basketball</option>
                <option>Motorsport</option>
              </select>
            </label>

            <label className="field">
              <span>Source type</span>
              <select value={sourceType} onChange={(event) => setSourceType(event.target.value)}>
                <option>Live broadcast</option>
                <option>Highlights</option>
                <option>Studio package</option>
                <option>Satellite ingest</option>
              </select>
            </label>
          </div>

          <label className="dropzone">
            <input
              type="file"
              accept="video/*,image/*"
              onChange={handleFileChange}
            />
            <strong>{selectedFile ? selectedFile.name : 'Drop media or browse files'}</strong>
            <p>Select a file to securely upload and generate its unique perceptual hash.</p>
          </label>

          {errorMessage && (
            <div style={{ color: '#ef4444', marginTop: '10px' }}>
              {errorMessage}
            </div>
          )}

          <button className="button" type="submit" disabled={!selectedFile || isUploading}>
            {isUploading ? <><Loader2 className="animate-spin" size={16} style={{marginRight: '8px', display: 'inline-block', verticalAlign: 'middle'}} /> Processing...</> : 'Upload to protected library'}
          </button>
        </form>

        {fingerprintHash && (
          <div className="panel stack-md" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#38bdf8' }}>Fingerprint Generated</h3>
            <div style={{ wordBreak: 'break-all', fontFamily: 'monospace', background: '#020617', padding: '12px', borderRadius: '4px', color: '#cbd5e1' }}>
              Hash: {fingerprintHash}
            </div>
          </div>
        )}

        <div className="panel stack-md" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
          <header className="section-heading">
            <div>
              <span className="eyebrow">Validation</span>
              <h2 style={{ fontSize: '1.2rem', color: 'white' }}>AI Similarity Testing</h2>
            </div>
          </header>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            Upload a file, then click below to test it against the protected library.
          </p>
          <button className="button" type="button" onClick={checkSimilarity} disabled={!selectedFile || isChecking} style={{ marginTop: '10px', background: '#8b5cf6', color: 'white', border: 'none' }}>
            {isChecking ? <><Loader2 className="animate-spin" size={16} style={{marginRight: '8px', display: 'inline-block', verticalAlign: 'middle'}} /> Checking...</> : 'Run Similarity Test'}
          </button>
        </div>

        {similarityResult && (
          <div className="panel stack-md" style={{ background: '#1e293b', border: '1px solid #334155' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>Similarity Result</h3>
            <div style={{ color: '#f8fafc', lineHeight: '1.8', paddingTop: '8px' }}>
              <div><strong>Match:</strong> <span style={{ color: similarityResult.match ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>{similarityResult.match ? 'YES' : 'NO'}</span></div>
              <div><strong>Similarity:</strong> <span style={{ color: '#38bdf8' }}>{similarityResult.similarity}%</span></div>
              <div><strong>Type:</strong> {similarityResult.label}</div>
              {similarityResult.matched_file && (
                <div><strong>Matched File:</strong> {similarityResult.matched_file}</div>
              )}
            </div>
          </div>
        )}
      </div>

      <section className="stack-md">
        <article className="panel stack-md">
          <header className="section-heading">
            <div>
              <span className="eyebrow">Preview surface</span>
              <h2>Selected media</h2>
            </div>
          </header>
          <MediaSurface
            src={previewUrl}
            alt="Upload preview"
            eyebrow={selectedFile ? selectedFile.type.split('/')[0] : 'Demo media'}
            title={selectedFile?.name ?? 'Awaiting selected file'}
            kind={selectedFile?.type?.startsWith('image/') ? 'image' : 'video'}
          />
        </article>

        <article className="panel stack-md">
          <header className="section-heading">
            <div>
              <span className="eyebrow">Pipeline status</span>
              <h2>{selectedFile?.name ?? 'Ready'}</h2>
            </div>
          </header>

          <div className="pipeline-list">
            {pipeline.map((step) => (
              <div key={step.label} className={`pipeline-list__item ${step.active ? 'is-active' : ''}`}>
                <span className="pipeline-list__dot" />
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </section>
  )
}
