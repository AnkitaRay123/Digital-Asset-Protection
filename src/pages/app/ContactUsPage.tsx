import React, { useState } from 'react'
import { Send, Mail, MapPin, Phone } from 'lucide-react'

export function ContactUsPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    // Simulate an API call
    setTimeout(() => {
      setStatus('success')
    }, 1500)
  }

  return (
    <section className="page-section stack-xl contact-page">
      {/* ── Header ── */}
      <header className="section-heading text-center" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Get in Touch</span>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>Contact Us</h2>
          <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'var(--muted)' }}>
            Have questions about digital rights management or need help setting up your asset protection? Our team is here to help.
          </p>
        </div>
      </header>

      <div className="contact-grid">
        {/* ── Contact Info Cards ── */}
        <div className="contact-info">
          <div className="panel contact-card">
            <div className="contact-icon-wrap">
              <Mail className="contact-icon" />
            </div>
            <div>
              <h3>Email Us</h3>
              <p>support@assetprotect.io</p>
              <p>legal@assetprotect.io</p>
            </div>
          </div>

          <div className="panel contact-card">
            <div className="contact-icon-wrap">
              <Phone className="contact-icon" />
            </div>
            <div>
              <h3>Call Us</h3>
              <p>+1 (555) 123-4567</p>
              <p>Mon-Fri, 9am-6pm EST</p>
            </div>
          </div>

          <div className="panel contact-card">
            <div className="contact-icon-wrap">
              <MapPin className="contact-icon" />
            </div>
            <div>
              <h3>Office</h3>
              <p>100 Security Plaza</p>
              <p>Tech Hub, NY 10001</p>
            </div>
          </div>
        </div>

        {/* ── Contact Form ── */}
        <div className="panel contact-form-wrapper">
          {status === 'success' ? (
            <div className="contact-success">
              <div className="success-icon">✓</div>
              <h3>Message Sent Successfully!</h3>
              <p>We've received your request and our team will get back to you within 24 hours.</p>
              <button className="button button--secondary" onClick={() => setStatus('idle')}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" required placeholder="John Doe" className="input-field" />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" required placeholder="john@company.com" className="input-field" />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" className="input-field">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>DMCA Takedown Assistance</option>
                  <option>Billing & Enterprise</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" required rows={5} placeholder="How can we help you?" className="input-field"></textarea>
              </div>

              <button type="submit" className="button button--primary submit-btn" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
