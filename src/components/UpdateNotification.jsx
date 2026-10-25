import { useState, useEffect } from 'react'
import { RefreshCw, X, Sparkles } from 'lucide-react'

export default function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    const handleUpdate = () => {
      setUpdateAvailable(true)
    }

    window.addEventListener('explorex-update-available', handleUpdate)

    // Also check if controller changed
    let refreshing = false
    navigator.serviceWorker?.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    })

    return () => {
      window.removeEventListener('explorex-update-available', handleUpdate)
    }
  }, [])

  if (!updateAvailable) return null

  const handleRefresh = () => {
    // Tell waiting service worker to skip waiting and activate
    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' })
        }
      })
    }
    window.location.reload()
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: '#1F3A2E',
        color: '#FFFFFF',
        padding: '12px 20px',
        borderRadius: '30px',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(201, 162, 39, 0.4)',
        animation: 'toastSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        fontSize: '14px',
        fontWeight: '500',
        maxWidth: '92vw',
      }}
    >
      <Sparkles size={18} style={{ color: '#C9A227', flexShrink: 0 }} />
      <span>A new version of Explorex is available.</span>
      <button
        type="button"
        onClick={handleRefresh}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'linear-gradient(135deg, #C9A227 0%, #B38F1E 100%)',
          color: '#1F3A2E',
          border: 'none',
          padding: '6px 14px',
          borderRadius: '20px',
          fontWeight: '700',
          fontSize: '13px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(201, 162, 39, 0.3)',
          transition: 'transform 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
      >
        <RefreshCw size={13} />
        Refresh
      </button>
      <button
        type="button"
        onClick={() => setUpdateAvailable(false)}
        aria-label="Dismiss notification"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.7)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <X size={15} />
      </button>
    </div>
  )
}
