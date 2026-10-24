import { useEffect, useState, useCallback } from 'react'
import { SavedPlacesContext } from './SavedPlacesContextObject'
import { useAuth } from './useAuth'
import { authApi } from '../services/authApi'

export function SavedPlacesProvider({ children }) {
  const { user, token, promptLogin } = useAuth()
  const userId = user?.id || null

  // Function to load saved IDs for current user or guest
  const loadUserSaved = useCallback((uid) => {
    const key = uid ? `explorex_saved_${uid}` : 'explorex_saved_guest'
    try {
      const stored = localStorage.getItem(key)
      if (stored) return JSON.parse(stored)
      if (uid && Array.isArray(user?.savedPlaces)) return user.savedPlaces
      return []
    } catch {
      return []
    }
  }, [user])

  const [savedIds, setSavedIds] = useState(() => loadUserSaved(userId))
  const [prevUserId, setPrevUserId] = useState(userId)

  // When user changes (login, logout, switch user), update state during render
  if (userId !== prevUserId) {
    setPrevUserId(userId)
    if (!prevUserId && userId) {
      try {
        const guestItems = JSON.parse(localStorage.getItem('explorex_saved_guest') || '[]')
        const userItems = loadUserSaved(userId)
        setSavedIds(Array.from(new Set([...userItems, ...guestItems])))
      } catch {
        setSavedIds(loadUserSaved(userId))
      }
    } else {
      setSavedIds(loadUserSaved(userId))
    }
  }

  // Sync to localStorage (and backend if logged in)
  useEffect(() => {
    const key = userId ? `explorex_saved_${userId}` : 'explorex_saved_guest'
    try {
      localStorage.setItem(key, JSON.stringify(savedIds))
      if (token && userId) {
        authApi.syncSavedPlaces(token, savedIds).catch(() => {})
      }
    } catch (e) {
      console.warn('Failed to sync saved places:', e)
    }
  }, [savedIds, userId, token])

  const isSaved = useCallback((id) => {
    if (!id) return false
    return savedIds.includes(id)
  }, [savedIds])

  const toggleSave = useCallback((id) => {
    if (!id) return false
    setSavedIds((prev) => {
      const exists = prev.includes(id)
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id]
      return next
    })
    return true
  }, [])

  return (
    <SavedPlacesContext.Provider value={{ savedIds, isSaved, toggleSave }}>
      {children}
    </SavedPlacesContext.Provider>
  )
}
