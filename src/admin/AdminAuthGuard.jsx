import { useAuth } from '../context/useAuth'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function AdminAuthGuard({ children, onNavigate }) {
  const { user, loading } = useAuth()

  // During auth hydration, show a minimal slate spinner
  if (loading) {
    return (
      <div className="admin-app-root" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--adm-text-muted)' }}>
            Verifying Administrator Credentials...
          </div>
        </div>
      </div>
    )
  }

  // Determine if active user is an authorized admin
  let sessionAdmin = false
  try {
    const raw = localStorage.getItem('sb_emu_session')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.user?.role === 'admin' || parsed.user?.email?.includes('admin')) {
        sessionAdmin = true
      }
    }
  } catch {}

  const userRole = user?.role || user?.user_metadata?.role || (user?.email?.includes('admin') ? 'admin' : (sessionAdmin ? 'admin' : 'user'))
  const isAdmin = (userRole === 'admin' || sessionAdmin) && !user?.is_disabled && !user?.user_metadata?.is_disabled

  if (!user || !isAdmin) {
    return (
      <div className="admin-app-root" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            maxWidth: '440px',
            background: 'var(--adm-surface)',
            border: '1px solid var(--adm-border)',
            borderRadius: '10px',
            padding: '28px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--adm-danger-bg)',
              color: 'var(--adm-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <ShieldAlert size={26} />
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700 }}>
            Restricted Administrator Console
          </h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '12.5px', color: 'var(--adm-text-muted)', lineHeight: 1.5 }}>
            Access to Explorex Admin Operations is restricted strictly to accounts with the <code>admin</code> role. Normal users and guest explorers are not permitted.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              type="button"
              className="adm-btn-secondary"
              onClick={() => onNavigate?.('/')}
            >
              <ArrowLeft size={13} />
              Return to User App
            </button>
            <button
              type="button"
              className="adm-btn-primary"
              onClick={() => onNavigate?.('/admin/login')}
            >
              Admin Log In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}
