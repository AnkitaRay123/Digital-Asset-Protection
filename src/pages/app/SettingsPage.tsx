import { integrations, teamMembers } from '../../data/mockData'
import { useAppContext } from '../../context/AppContext'

export function SettingsPage() {
  const { session, toggleNotification } = useAppContext()

  if (!session) {
    return null
  }

  return (
    <section className="page-section page-grid page-grid--two">
      <article className="panel stack-md">
        <span className="eyebrow">Profile</span>
        <h2>{session.name}</h2>
        <p>{session.role} · {session.orgName}</p>

        <div className="toggle-list">
          {Object.entries(session.notificationPrefs).map(([channel, enabled]) => (
            <button
              key={channel}
              type="button"
              className={`toggle-row ${enabled ? 'is-enabled' : ''}`}
              onClick={() => toggleNotification(channel as keyof typeof session.notificationPrefs)}
            >
              <span>{channel}</span>
              <strong>{enabled ? 'On' : 'Off'}</strong>
            </button>
          ))}
        </div>
      </article>

      <article className="panel stack-md">
        <span className="eyebrow">Reviewer coverage</span>
        <h2>Team roles</h2>
        <div className="rank-list">
          {teamMembers.map((member) => (
            <div key={member.name} className="rank-list__row">
              <strong>{member.name}</strong>
              <span>{member.role} · {member.coverage}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="panel stack-md">
        <span className="eyebrow">Legal templates</span>
        <h2>Takedown drafts</h2>
        <div className="template-card">
          <strong>DMCA emergency template</strong>
          <p>Includes evidence bundle, matched asset metadata, and platform-specific escalation notes.</p>
        </div>
        <div className="template-card">
          <strong>Platform trust & safety memo</strong>
          <p>Structured for repeat-offender cases and mirror-network coordination.</p>
        </div>
      </article>

      <article className="panel stack-md">
        <span className="eyebrow">Integrations</span>
        <h2>Backend readiness</h2>
        <div className="card-grid card-grid--tight">
          {integrations.map((integration) => (
            <div key={integration.name} className="integration-card">
              <strong>{integration.name}</strong>
              <p>{integration.description}</p>
              <span className="status-pill">{integration.status}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
