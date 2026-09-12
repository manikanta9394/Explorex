import { useEffect, useState } from 'react'
import { SavedPlacesContext } from './SavedPlacesContextObject'

const STORAGE_KEY = 'tourmate_saved_places'

export function SavedPlacesProvider({ children }) {
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds))
    } catch (e) {
      console.warn('Failed to persist saved places:', e)
    }
  }, [savedIds])

  const isSaved = (id) => (id ? savedIds.includes(id) : false)

  const toggleSave = (id) => {
    if (!id) return
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <SavedPlacesContext.Provider value={{ savedIds, isSaved, toggleSave }}>
      {children}
    </SavedPlacesContext.Provider>
  )
}
