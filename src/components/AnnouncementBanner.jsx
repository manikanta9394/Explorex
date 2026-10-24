import { useState, useEffect } from 'react'
import { Megaphone, X, ArrowRight, Sparkles } from 'lucide-react'

export default function AnnouncementBanner({ onNavigate }) {
  const [banner, setBanner] = useState(() => {
    try {
      const raw = localStorage.getItem('explorex_announcement_banner')
      if (raw) return JSON.parse(raw)
    } catch {}
    return {
      is_active: false,
      message: 'Celebrate Navratri & Durga Puja across India with verified monument illuminations!',
      type: 'cultural_event',
      cta_text: 'Explore Festivals',
      cta_link: '/festivals',
    }
  })
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleStorage = () => {
      try {
        const raw = localStorage.getItem('explorex_announcement_banner')
        if (raw) setBanner(JSON.parse(raw))
      } catch {}
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  if (!banner.is_active || dismissed) return null

  const isTip = banner.type === 'tip'
  const isMaintenance = banner.type === 'maintenance'

  const bgGradient = isMaintenance
    ? 'linear-gradient(90deg, #78350F 0%, #B45309 100%)'
    : isTip
    ? 'linear-gradient(90deg, #064E3B 0%, #047857 100%)'
    : 'linear-gradient(90deg, #1C1917 0%, #322514 50%, #1C1917 100%)'

  const borderBottom = isMaintenance
    ? '1px solid #D97706'
    : isTip
    ? '1px solid #059669'
    : '1px solid rgba(217, 119, 6, 0.4)'

  return (
    <aside
      aria-label="Site announcement"
      style={{
        background: bgGradient,
        borderBottom,
        color: '#FBF8F1',
        padding: '8px 16px',
        fontSize: '12.5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 90,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Sparkles size={14} style={{ color: '#F59E0B', flexShrink: 0 }} />
        <span style={{ fontWeight: 500, letterSpacing: '0.01em' }}>{banner.message}</span>
        {banner.cta_link && (
          <button
            type="button"
            onClick={() => onNavigate?.(banner.cta_link)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '2px 10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginLeft: '4px',
            }}
          >
            <span>{banner.cta_text || 'Learn more'}</span>
            <ArrowRight size={11} />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        style={{
          position: 'absolute',
          right: '12px',
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.7)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <X size={14} />
      </button>
    </aside>
  )
}
