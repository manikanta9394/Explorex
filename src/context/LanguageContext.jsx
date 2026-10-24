import { createContext, useContext, useState } from 'react'
import { translations } from '../utils/translations'

export const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('explorex_app_lang') || 'en'
    } catch {
      return 'en'
    }
  })

  const setLanguage = (lang) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('explorex_app_lang', lang)
    } catch {}
  }

  // Helper t(key)
  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
