import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { Footer } from './Footer'

const navItems = [
  { label: 'Overview', to: '/app/overview' },
  { label: 'Library', to: '/app/library' },
  { label: 'Upload', to: '/app/upload' },
  { label: 'Monitoring', to: '/app/monitoring' },
  { label: 'Alerts', to: '/app/alerts' },
  { label: 'Reports', to: '/app/reports' },
  { label: 'Settings', to: '/app/settings' },
  { label: '⚙ Admin Panel', to: '/app/admin', isAdmin: true, exact: true },
  { label: '📁 Media Library', to: '/app/admin/library', isAdmin: true, isSubItem: true },
  { label: '🚨 Incidents', to: '/app/admin/incidents', isAdmin: true, isSubItem: true },
]

export function AppShell() {
  const { pathname } = useLocation()
  const { session, logout } = useAppContext()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const pageTitle = useMemo(() => navItems.find((item) => pathname.startsWith(item.to))?.label ?? 'Case detail', [pathname])

  return (
    <div className={`app-shell ${collapsed ? 'app-shell--collapsed' : ''}`}>
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="brand-mark">DP</div>
          {!collapsed ? (
            <div>
              <strong>Digital Protection</strong>
              <p>{session?.orgName}</p>
            </div>
          ) : null}
        </div>

        <nav className="sidebar__nav">
          {navItems
            .filter((item) => !item.isAdmin || session?.role === 'admin')
            .map((item) => (
              <NavLink
                key={item.to}
                end={item.exact}
                className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''} ${item.isSubItem ? 'sidebar__link--sub' : ''}`}
                to={item.to}
                onClick={() => setMobileOpen(false)}
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
        </nav>

        <div className="sidebar__footer">
          <button className="button button--ghost" type="button" onClick={() => setCollapsed((current) => !current)}>
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
          <button className="button button--ghost" type="button" onClick={() => {
            if ((window as any).dashboardMusic) {
              (window as any).dashboardMusic.pause()
              ;(window as any).dashboardMusic.currentTime = 0
            }
            logout()
          }}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="app-shell__content">
        <header className="topbar">
          <div className="topbar__title">
            <button className="topbar__menu" type="button" onClick={() => setMobileOpen((current) => !current)}>
              Menu
            </button>
            <div>
              <span className="eyebrow">Broadcaster command center</span>
              <h1>{pageTitle}</h1>
            </div>
          </div>

          <div className="topbar__actions">
            <button className="button button--ghost" type="button">
              Search command
            </button>
            <div className="profile-chip">
              <span>{session?.avatar}</span>
              <div>
                <strong>{session?.name}</strong>
                <p>{session?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="content-grid">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  )
}
