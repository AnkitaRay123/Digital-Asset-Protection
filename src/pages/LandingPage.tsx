import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { heroMedia, manualVsAi } from '../data/mockData'
import { MediaSurface } from '../components/ui/MediaSurface'

const architectureCards = [
  {
    title: 'Secure ingest',
    copy: 'Upload official footage, attach provenance metadata, and stage every asset for watermarking and indexing.',
  },
  {
    title: 'Real-time hunt',
    copy: 'Continuously monitor suspicious channels, mirror sites, and social chatter for rapid propagation bursts.',
  },
  {
    title: 'Evidence-first response',
    copy: 'Verify suspected piracy with multimodal reasoning, preserve the case trail, and initiate takedowns fast.',
  },
]

export function LandingPage() {
  useEffect(() => {
    // Ensure no dashboard music is playing if the user navigated back to the landing page
    if ((window as any).dashboardMusic) {
      ;(window as any).dashboardMusic.pause()
      ;(window as any).dashboardMusic.currentTime = 0
    }
  }, [])

  return (
    <div className="landing-page">
      <section className="landing-hero">
        <video className="landing-hero__bg" src={heroMedia.background} autoPlay loop muted playsInline />
        <div className="landing-hero__veil" />

        <div className="landing-hero__content">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">Near real-time digital asset protection</span>
            <h1>See the piracy window before it becomes a revenue loss.</h1>
            <p className="hero-copy">
              Built around the Solution Challenge brief, this broadcaster dashboard turns the visibility gap into an
              action pipeline: ingest, fingerprint, monitor, verify, and respond within minutes.
            </p>

            <div className="hero-actions">
              <Link className="button" to="/login">
                Launch dashboard
              </Link>
              <Link className="button button--ghost" to="/app/overview">
                Preview product
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-highlight"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <MediaSurface
              src={heroMedia.secondary}
              alt="Monitoring wall preview"
              eyebrow="Live command feed"
              title="Automated detection paired with analyst-ready evidence"
            />
          </motion.div>
        </div>
      </section>

      <section className="metric-band">
        <div className="panel">
          <strong>30 sec</strong>
          <p>Pirated live streams can appear within seconds of the original broadcast.</p>
        </div>
        <div className="panel">
          <strong>$28.3B</strong>
          <p>Estimated annual damage attributed to sports streaming piracy.</p>
        </div>
        <div className="panel">
          <strong>2.7%</strong>
          <p>Only a small portion of unauthorized retransmissions are removed early enough to matter.</p>
        </div>
      </section>

      <section className="content-section content-section--split">
        <div>
          <span className="eyebrow">Why this matters</span>
          <h2>Shift from perimeter defense to asset-centric defense.</h2>
          <p>
            The PDF frames the real challenge clearly: once premium sports media leaves the secure broadcast path, the
            web fragments it into a fast-moving, decentralized distribution network. The frontend makes that chain
            visible to the broadcaster.
          </p>
        </div>

        <div className="architecture-grid">
          {architectureCards.map((card) => (
            <article key={card.title} className="panel">
              <span className="eyebrow">Module</span>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section content-section--split">
        <div className="panel">
          <span className="eyebrow">Manual vs automated</span>
          <h2>Mitigation timeline</h2>
          <div className="timeline-compare">
            {manualVsAi.map((row) => (
              <div key={row.phase} className="timeline-compare__row">
                <strong>{row.phase}</strong>
                <span>{row.manual}</span>
                <span>{row.automated}</span>
              </div>
            ))}
          </div>
        </div>

        <MediaSurface
          src={heroMedia.tertiary}
          alt="Signal visualization"
          eyebrow="Defense workflow"
          title="Uploads, live monitoring, alerts, case review, and takedown support"
        />
      </section>
    </div>
  )
}
