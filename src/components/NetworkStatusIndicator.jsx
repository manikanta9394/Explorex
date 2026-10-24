import { useState, useEffect } from 'react'
import { WifiOff, Wifi, RefreshCw } from 'lucide-react'

export default function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true))
  const [showRestored, setShowRestored] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowRestored(true)
      const timer = setTimeout(() => setShowRestored(false), 3500)
      return () => clearTimeout(timer)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowRestored(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline && !showRestored) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: isOnline ? '#064E3B' : '#7F1D1D',
        color: '#FFFFFF',
        padding: '8px 18px',
        borderRadius: '9999px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.01em',
        animation: 'slideUpFade 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {isOnline ? (
        <>
          <Wifi size={14} style={{ color: '#10B981' }} />
          <span>Back online! Live data synchronized.</span>
        </>
      ) : (
        <>
          <WifiOff size={14} style={{ color: '#F87171' }} />
          <span>You are offline. Cached destinations and saved trips remain available.</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '4px',
              padding: '2px 8px',
              color: '#FFFFFF',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginLeft: '4px',
            }}
          >
            <RefreshCw size={11} />
            <span>Retry</span>
          </button>
        </>
      )}
    </div>
  )
}
