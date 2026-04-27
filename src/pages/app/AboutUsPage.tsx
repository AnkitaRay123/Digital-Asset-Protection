import React from 'react'

const TEAM_MEMBERS = [
  {
    name: 'Subhradip Adhikari',
    role: 'Backend Engineer',
    image: '/team-subhradip.jpg',
  },
  {
    name: 'Avrojit Saha',
    role: 'Frontend Engineer',
    image: '/team-avrojit.jpg',
  },
  {
    name: 'Ankita Ray',
    role: 'Frontend Engineer',
    image: '/team-ankita.jpg',
  },
  {
    name: 'Pritam Mondal',
    role: 'AI / ML Specialist',
    image: '/team-pritam.jpg',
  },
]

export function AboutUsPage() {
  return (
    <section className="page-section stack-xl about-us-page">
      {/* ── Header ── */}
      <header className="section-heading text-center" style={{ justifyContent: 'center', marginBottom: '3rem' }}>
        <div>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Who We Are</span>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>About Us</h2>
          <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'var(--muted)' }}>
            We are the team behind the Digital Asset Protection System. Passionate about securing digital rights and building intelligent monitoring tools to protect creative content across the web.
          </p>
        </div>
      </header>

      {/* ── Team Grid ── */}
      <div className="team-grid">
        {TEAM_MEMBERS.map((member) => (
          <div key={member.name} className="team-card panel">
            <div className="team-card__image-wrap">
              <img src={member.image} alt={member.name} className="team-card__image" />
            </div>
            <div className="team-card__info">
              <h3>{member.name}</h3>
              <p className="team-card__role">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
