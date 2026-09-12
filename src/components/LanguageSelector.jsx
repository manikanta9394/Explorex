import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'EN', label: 'English', native: 'English' },
  { code: 'TE', label: 'Telugu', native: 'తెలుగు' },
  { code: 'HI', label: 'Hindi', native: 'हिंदी' },
  { code: 'UR', label: 'Urdu', native: 'اردو' },
]

export default function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(() => {
    try {
      return localStorage.getItem('tourmate_lang') || 'EN'
    } catch {
      return 'EN'
    }
  })
  const menuRef = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem('tourmate_lang', selected)
    } catch (e) {
      console.warn('Failed to save language preference:', e)
    }
  }, [selected])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="language-selector-dropdown" ref={menuRef}>
      <button
        type="button"
        className="language-button"
        onClick={() => setOpen(!open)}
        aria-label="Select language"
      >
        <Globe size={13} />
        <span>{selected}</span>
        <ChevronDown size={14} className={`chevron-icon ${open ? 'rotate' : ''}`} />
      </button>

      {open && (
        <div className="language-menu-card">
          <div className="menu-header">Select Language</div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`language-menu-item ${selected === lang.code ? 'active' : ''}`}
              onClick={() => {
                setSelected(lang.code)
                setOpen(false)
              }}
            >
              <span className="lang-code-pill">{lang.code}</span>
              <div className="lang-names">
                <span className="main-name">{lang.label}</span>
                <small className="native-name">{lang.native}</small>
              </div>
              {selected === lang.code && <Check size={14} className="check-icon" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
