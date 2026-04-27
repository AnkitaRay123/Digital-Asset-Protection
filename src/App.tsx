import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ActionModal } from './components/ui/ActionModal'
import { EmptyState } from './components/ui/EmptyState'
import { ToastStack } from './components/ui/ToastStack'
import { useAppContext } from './context/AppContext'

const AppShell = lazy(() => import('./components/layout/AppShell').then((module) => ({ default: module.AppShell })))
const LandingPage = lazy(() => import('./pages/LandingPage').then((module) => ({ default: module.LandingPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })))
const OverviewPage = lazy(() => import('./pages/app/OverviewPage').then((module) => ({ default: module.OverviewPage })))
const LibraryPage = lazy(() => import('./pages/app/LibraryPage').then((module) => ({ default: module.LibraryPage })))
const UploadPage = lazy(() => import('./pages/app/UploadPage').then((module) => ({ default: module.UploadPage })))
const MonitoringPage = lazy(() =>
  import('./pages/app/MonitoringPage').then((module) => ({ default: module.MonitoringPage })),
)
const AlertsPage = lazy(() => import('./pages/app/AlertsPage').then((module) => ({ default: module.AlertsPage })))
const AlertDetailPage = lazy(() =>
  import('./pages/app/AlertDetailPage').then((module) => ({ default: module.AlertDetailPage })),
)
const ReportsPage = lazy(() => import('./pages/app/ReportsPage').then((module) => ({ default: module.ReportsPage })))
const SettingsPage = lazy(() =>
  import('./pages/app/SettingsPage').then((module) => ({ default: module.SettingsPage })),
)
const AboutUsPage = lazy(() =>
  import('./pages/app/AboutUsPage').then((module) => ({ default: module.AboutUsPage })),
)
const PrivacyPolicyPage = lazy(() =>
  import('./pages/app/PrivacyPolicyPage').then((module) => ({ default: module.PrivacyPolicyPage })),
)
const ContactUsPage = lazy(() =>
  import('./pages/app/ContactUsPage').then((module) => ({ default: module.ContactUsPage })),
)
const AdminDashboardPage = lazy(() =>
  import('./pages/app/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })),
)
const AdminMediaLibraryPage = lazy(() =>
  import('./pages/app/AdminMediaLibraryPage').then((module) => ({ default: module.AdminMediaLibraryPage })),
)
const AdminIncidentsPage = lazy(() =>
  import('./pages/app/AdminIncidentsPage').then((module) => ({ default: module.AdminIncidentsPage })),
)
const AdminLayout = lazy(() =>
  import('./components/layout/AdminLayout').then((module) => ({ default: module.AdminLayout })),
)



function RequireSession({ children }: { children: React.ReactNode }) {
  const { session } = useAppContext()

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const { modal, closeModal, confirmModal, dismissToast, toasts } = useAppContext()
  const timerAudioRef = useRef<HTMLAudioElement>(null)
  const welcomeAudioRef = useRef<HTMLAudioElement>(null)
  const sectionChangeAudioRef = useRef<HTMLAudioElement>(null)
  const bgAudioRef = useRef<HTMLAudioElement>(null)
  const [showBootOverlay, setShowBootOverlay] = useState(false)
  const location = useLocation()
  const isFirstRender = useRef(true)
  const sectionAudioTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Handle section change sounds
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (sectionChangeAudioRef.current) {
      if (sectionAudioTimeoutRef.current) {
        clearTimeout(sectionAudioTimeoutRef.current)
      }

      sectionChangeAudioRef.current.currentTime = 0
      sectionChangeAudioRef.current.volume = 0.2 // Greatly decreased volume
      sectionChangeAudioRef.current.play().then(() => {
        // Cut the last portion of the sound (e.g. trailing echo/tail) by pausing it aggressively
        sectionAudioTimeoutRef.current = setTimeout(() => {
          if (sectionChangeAudioRef.current) {
            sectionChangeAudioRef.current.pause()
            sectionChangeAudioRef.current.currentTime = 0
          }
        }, 700) // Adjust this ms value if you want it longer or shorter
      }).catch(e => console.log('Section change sound blocked:', e))
    }
  }, [location.pathname])

  useEffect(() => {
    let playAttempted = false;
    let welcomeAttempted = false;

    const tryPlayAudio = () => {
      if (timerAudioRef.current && timerAudioRef.current.paused && !playAttempted) {
        timerAudioRef.current.volume = 0.5 // Medium level
        timerAudioRef.current.play().then(() => {
          playAttempted = true;
        }).catch(e => console.log('Global timer autoplay blocked:', e))
      }

      if (welcomeAudioRef.current && welcomeAudioRef.current.paused && !welcomeAttempted) {
        welcomeAudioRef.current.volume = 0.8
        welcomeAudioRef.current.play().then(() => {
          welcomeAttempted = true;
        }).catch(e => console.log('Welcome voice autoplay blocked:', e))
      }

      if (bgAudioRef.current && bgAudioRef.current.paused) {
        bgAudioRef.current.volume = 0.25
        bgAudioRef.current.play().then(() => {
          setShowBootOverlay(false)
        }).catch(e => {
          console.log('Background audio autoplay blocked:', e)
          setShowBootOverlay(true)
        })
      }

      if (playAttempted && welcomeAttempted && bgAudioRef.current && !bgAudioRef.current.paused) {
        document.removeEventListener('click', tryPlayAudio)
        document.removeEventListener('keydown', tryPlayAudio)
      }
    }

    tryPlayAudio()

    document.addEventListener('click', tryPlayAudio)
    document.addEventListener('keydown', tryPlayAudio)

    return () => {
      document.removeEventListener('click', tryPlayAudio)
      document.removeEventListener('keydown', tryPlayAudio)
    }
  }, [])

  const handleBgAudioEnded = () => {
    if (bgAudioRef.current) {
      bgAudioRef.current.currentTime = 15 // Loop back to the cut point
      bgAudioRef.current.play().catch(e => console.log('Playback error on loop:', e))
    }
  }

  return (
    <>
      <audio ref={timerAudioRef} src="/tick-tick-timer.mpeg" loop autoPlay />
      <audio ref={welcomeAudioRef} src="/welcome-voice.mp3" autoPlay />
      <audio ref={sectionChangeAudioRef} src="/section-change-sound.mp3" />
      <audio ref={bgAudioRef} src="/dashboard-bg.mp3#t=15" autoPlay onEnded={handleBgAudioEnded} />

      {showBootOverlay && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, 
          background: 'rgba(3, 8, 15, 0.95)', backdropFilter: 'blur(10px)',
          display: 'grid', placeItems: 'center', cursor: 'pointer',
          color: '#38bdf8', fontFamily: 'monospace', textAlign: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '3rem', letterSpacing: '0.2em', margin: '0 0 1rem', textShadow: '0 0 20px rgba(56, 189, 248, 0.5)' }}>SYSTEM STANDBY</h1>
            <p style={{ fontSize: '1.2rem', color: '#94a3b8', letterSpacing: '0.1em' }}>Click anywhere to initialize audio engine and access system</p>
          </div>
        </div>
      )}

      <Suspense
        fallback={
          <div className="suspense-shell">
            <EmptyState title="Loading workspace" description="Preparing the broadcaster dashboard interface." />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/app"
            element={
              <RequireSession>
                <AppShell />
              </RequireSession>
            }
          >
            <Route index element={<Navigate to="/app/overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="monitoring" element={<MonitoringPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="alerts/:id" element={<AlertDetailPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="about" element={<AboutUsPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="contact" element={<ContactUsPage />} />
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="library" element={<AdminMediaLibraryPage />} />
              <Route path="incidents" element={<AdminIncidentsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      {modal ? <ActionModal modal={modal} onClose={closeModal} onConfirm={confirmModal} /> : null}
    </>
  )
}

export default App
