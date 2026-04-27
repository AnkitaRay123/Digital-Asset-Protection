import { Link } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()
  
  return (
    <footer className="app-footer">
      <div className="app-footer__content">
        <div className="app-footer__brand">
          <span className="app-footer__logo">🛡️</span>
          <p>Digital Asset Protection &copy; {year}</p>
        </div>
        
        <nav className="app-footer__links">
          <Link to="/app/about">About Us</Link>
          <Link to="/app/privacy">Privacy Policy</Link>
          <Link to="/app/contact">Contact Us</Link>
        </nav>
      </div>
    </footer>
  )
}
