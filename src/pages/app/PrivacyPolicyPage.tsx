import React from 'react'

export function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <section className="page-section stack-xl privacy-page">
      {/* ── Header ── */}
      <header className="section-heading text-center" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Legal & Security</span>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>Privacy Policy</h2>
          <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>Last updated: {lastUpdated}</p>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="privacy-content panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem', borderRadius: '20px', lineHeight: '1.7' }}>
        <h3 style={{ color: 'var(--cyan)', marginTop: 0 }}>1. Introduction</h3>
        <p>
          Welcome to the <strong>Digital Asset Protection System</strong>. We respect your privacy and are committed to protecting the digital assets, personal data, and copyrighted media you entrust to us. This policy explains how we collect, use, and safeguard your information when you use our AI-powered similarity detection and web crawler services.
        </p>

        <h3 style={{ color: 'var(--cyan)', marginTop: '2.5rem' }}>2. Data We Collect</h3>
        <p>
          We collect and process the following types of information:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--muted)' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#fff' }}>Media Files:</strong> Images and videos uploaded to our Media Library for the purpose of baseline comparison and copyright protection.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#fff' }}>Scraped Content:</strong> URLs, image hashes, and web metadata collected automatically by our active Web Crawler.</li>
          <li><strong style={{ color: '#fff' }}>Usage Data:</strong> System logs, API requests, and administrative actions performed within the Admin Panel.</li>
        </ul>

        <h3 style={{ color: 'var(--cyan)', marginTop: '2.5rem' }}>3. How We Use AI Models</h3>
        <p>
          Our system utilizes advanced machine learning models (such as ResNet50) solely for <strong>feature extraction and similarity matching</strong>. Uploaded media is converted into mathematical feature vectors. We do <em>not</em> use your private media to train our AI models for general generative purposes.
        </p>

        <h3 style={{ color: 'var(--cyan)', marginTop: '2.5rem' }}>4. Data Storage & Security</h3>
        <p>
          All data is stored securely in our encrypted MongoDB instances and local secure storage. We employ strict role-based access control (RBAC), ensuring that only authorized administrators can view the Media Library, trigger scans, or manage detected incident reports.
        </p>

        <h3 style={{ color: 'var(--cyan)', marginTop: '2.5rem' }}>5. Incident Reporting</h3>
        <p>
          When a similarity violation (≥ 85%) is detected across the web, an incident report is generated containing the source URL and matched media. This data is kept strictly confidential and is used exclusively to assist you in issuing takedown notices or enforcing your digital rights.
        </p>

        <h3 style={{ color: 'var(--cyan)', marginTop: '2.5rem' }}>6. Contact Us</h3>
        <p style={{ marginBottom: 0 }}>
          If you have any questions or concerns regarding this Privacy Policy or how your digital assets are handled, please visit our Contact Us page or reach out to our administrative team directly.
        </p>
      </div>
    </section>
  )
}
