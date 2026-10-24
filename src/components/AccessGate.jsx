import { useEffect } from 'react'
import { Compass } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function AccessGate({ currentRoute, onNavigate, children }) {
  const { user, session, loading } = useAuth()

  const routePath = typeof currentRoute === 'string' ? currentRoute : currentRoute?.route || '/'
  const isAuthRoute =
    routePath === '/welcome' ||
    routePath === '/login' ||
    routePath === '/signup' ||
    routePath === '/reset-password'

  useEffect(() => {
    // If not loading, and user is not authenticated (neither account nor guest), redirect to /welcome
    if (!loading && !user && !session && !isAuthRoute) {
      const redirectParam = encodeURIComponent(routePath)
      const target = `/welcome?redirect=${redirectParam}`
      if (onNavigate) {
        onNavigate(target)
      } else {
        const base = import.meta.env.BASE_URL || '/Explorex/'
        const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
        try {
          window.history.pushState(null, '', `${normalizedBase}#/welcome?redirect=${redirectParam}`)
        } catch {
          window.location.hash = `#/welcome?redirect=${redirectParam}`
        }
        window.dispatchEvent(new PopStateEvent('popstate'))
      }
    }
  }, [loading, user, session, isAuthRoute, routePath, onNavigate])

  // While restoring session, display clean loading screen
  if (loading) {
    return (
      <div className="access-gate-loading-screen">
        <div className="gate-loading-card">
          <div className="gate-compass-spin">
            <Compass size={36} color="#C9A227" />
          </div>
          <h3>Authenticating Explorex...</h3>
          <p>Verifying secure session &amp; database privileges</p>
        </div>
      </div>
    )
  }

  // Allow auth routes to render without session
  if (isAuthRoute) {
    return children
  }

  // If no session, do not render protected children while redirecting
  if (!user && !session) {
    return null
  }

  // Session present (either account or guest session)
  return children
}
