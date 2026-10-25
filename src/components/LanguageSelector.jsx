import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', codeUpper: 'EN' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', codeUpper: 'TE' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', codeUpper: 'HI' },
]

export default function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const menuRef = useRef(null)

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

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
        aria-label={`Select language: ${currentLang.codeUpper}`}
        title="Change application language (English, తెలుగు, हिन्दी)"
      >
        <Globe size={13} />
        <span>{currentLang.codeUpper}</span>
        <ChevronDown size={14} className={`chevron-icon ${open ? 'rotate' : ''}`} />
      </button>

      {open && (
        <div className="language-menu-card">
          <div className="menu-header">Select Language / భాష / भाषा</div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`language-menu-item ${language === lang.code ? 'active' : ''}`}
              onClick={() => {
                setLanguage(lang.code)
                setOpen(false)
              }}
            >
              <span className="lang-code-pill">{lang.codeUpper}</span>
              <div className="lang-names">
                <span className="main-name">{lang.label}</span>
                <small className="native-name">{lang.native}</small>
              </div>
              {language === lang.code && <Check size={14} className="check-icon" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
