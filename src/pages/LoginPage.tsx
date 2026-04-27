import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { heroMedia } from '../data/mockData'

export function LoginPage() {
  const navigate = useNavigate()
  const { loginAs } = useAppContext()

  const handleLogin = (role: 'broadcaster' | 'admin') => {
    loginAs(role)
    
    // Play Welcome Voice
    const voice = new Audio('/dashboard-entry.mp3')
    voice.volume = 1.0
    voice.play().catch(e => console.warn('Voice play blocked', e))

    // Play Background Music
    const music = new Audio('/dashboard-bg.mp3')
    music.volume = 0.3
    music.loop = true
    music.play().catch(e => console.warn('Music play blocked', e))

    // Make the music instance available globally so it can be stopped/toggled later if needed
    ;(window as any).dashboardMusic = music

    navigate('/app/overview')
  }

  return (
    <div className="login-page">
      <video className="login-page__bg" src={heroMedia.tertiary} autoPlay loop muted playsInline />
      <div className="login-page__veil" />

      <div className="login-card panel">
        <span className="eyebrow">Mock sign-in</span>
        <h1>Choose a demo persona.</h1>
        <p>Authentication is frontend-only for now, but the flows mirror the broadcaster roles planned for Firebase.</p>

        <div className="persona-grid">
          <motion.button
            type="button"
            className="persona-card"
            whileHover={{ y: -4 }}
            onClick={() => handleLogin('broadcaster')}
          >
            <span className="eyebrow">Broadcaster</span>
            <h2>Aarav Mehta</h2>
            <p>Own uploads, monitor live threats, and coordinate takedown review.</p>
          </motion.button>

          <motion.button
            type="button"
            className="persona-card"
            whileHover={{ y: -4 }}
            onClick={() => handleLogin('admin')}
          >
            <span className="eyebrow">Admin</span>
            <h2>Naina Roy</h2>
            <p>Manage policy, reviewer routing, and platform integration readiness.</p>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
