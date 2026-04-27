import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'

export function AdminLayout() {
  const [entered, setEntered] = useState(false)
  const [muted, setMuted] = useState(false)
  const musicRef = useRef<HTMLAudioElement | null>(null)

  // Pre-load the audio so it's ready the moment user clicks Enter
  useEffect(() => {
    const music = new Audio('/admin-theme.mp3')
    music.loop = true
    music.volume = 0.30
    music.preload = 'auto'
    musicRef.current = music

    return () => {
      music.pause()
      music.src = ''
    }
  }, [])

  // Sync mute
  useEffect(() => {
    if (musicRef.current) musicRef.current.muted = muted
  }, [muted])

  /**
   * Called when user clicks "Enter Admin Panel" button.
   * Because this runs INSIDE a click handler, browsers MUST allow play().
   */
  const handleEnter = () => {
    // ── Button Click Sound ───────────────────────────────────────────────────
    const clickSound = new Audio('/admin-click.mp3')
    clickSound.volume = 1.0
    clickSound.play().catch(() => {})

    // ── Robot voice via Web Speech API (no file needed) ──────────────────────
    if ('speechSynthesis' in window) {
      // Cancel any pending speech first
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(
        'Access granted. Welcome to the Admin Control Panel. Digital Asset Protection System is now active.'
      )
      utterance.rate  = 0.80   // Slightly slower — robotic
      utterance.pitch = 0.40   // Low pitch — robotic
      utterance.volume = 1.0

      // Pick a robotic-sounding voice if available (Google US English / Microsoft David)
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find((v) =>
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('mark') ||
        v.lang === 'en-US'
      )
      if (preferred) utterance.voice = preferred

      window.speechSynthesis.speak(utterance)
    }

    // ── Background music ─────────────────────────────────────────────────────
    if (musicRef.current) {
      musicRef.current.play()
    }

    setEntered(true)
  }

  return (
    <div className="admin-layout">
      {/* ── Video BG ── */}
      <video
        className="admin-layout__bg"
        src="/admin-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="admin-layout__veil" />

      {/* ── ENTER OVERLAY ── */}
      {!entered && (
        <div className="admin-enter-overlay">
          <div className="admin-enter-card">
            <div className="admin-enter-icon">🛡️</div>
            <h2>Admin Panel</h2>
            <p>Digital Asset Protection System</p>
            <button className="admin-enter-btn" onClick={handleEnter}>
              ▶ &nbsp; Enter Admin Panel
            </button>
          </div>
        </div>
      )}

      {/* ── Page content ── */}
      <div className={`admin-layout__content ${!entered ? 'admin-layout__content--hidden' : ''}`}>
        <Outlet />
      </div>

      {/* ── Mute / Unmute ── */}
      {entered && (
        <button
          className="admin-music-toggle"
          onClick={() => setMuted((m) => !m)}
          title={muted ? 'Unmute music' : 'Mute music'}
        >
          {muted ? '🔇' : '🎵'}
        </button>
      )}
    </div>
  )
}
