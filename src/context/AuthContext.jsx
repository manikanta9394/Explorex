import { useEffect, useState, useCallback } from 'react'
import { AuthContext } from './AuthContextObject'
import { authApi } from '../services/authApi'

const TOKEN_KEY = 'explorex_auth_token'
const USER_KEY = 'explorex_user'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) || null
    } catch {
      return null
    }
  })

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login') // 'login' | 'signup'
  const [authPromptMessage, setAuthPromptMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  // Sync token & user to localStorage
  useEffect(() => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token)
      else localStorage.removeItem(TOKEN_KEY)

      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
      else localStorage.removeItem(USER_KEY)
    } catch (e) {
      console.warn('Failed to sync auth in storage:', e)
    }
  }, [token, user])

  // Restore & verify session on mount
  useEffect(() => {
    if (token) {
      authApi.getMe(token).then((freshUser) => {
        if (freshUser) {
          setUser((prev) => ({ ...prev, ...freshUser }))
        }
      }).catch(() => {
        // Token might still be valid for offline mode
      })
    }
  }, [token])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const data = await authApi.login({ email, password })
      setUser(data.user)
      setToken(data.token)
      setAuthModalOpen(false)
      setAuthPromptMessage(null)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name, email, password, confirmPassword) => {
    setLoading(true)
    try {
      const data = await authApi.signup({ name, email, password, confirmPassword })
      setUser(data.user)
      setToken(data.token)
      setAuthModalOpen(false)
      setAuthPromptMessage(null)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async (customPayload) => {
    setLoading(true)
    try {
      const payload = customPayload || {
        name: 'Google Explorer',
        email: 'traveler.google@explorex.in',
        googleId: `g_${Date.now()}`,
      }
      const data = await authApi.googleAuth(payload)
      setUser(data.user)
      setToken(data.token)
      setAuthModalOpen(false)
      setAuthPromptMessage(null)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } catch {}
  }, [])

  const promptLogin = useCallback((message = 'Please log in to save places to your wishlist.') => {
    setAuthPromptMessage(message)
    setAuthModalMode('login')
    setAuthModalOpen(true)
  }, [])

  const openAuthModal = useCallback((mode = 'login') => {
    setAuthPromptMessage(null)
    setAuthModalMode(mode)
    setAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false)
    setAuthPromptMessage(null)
  }, [])

  const updateUserProfile = useCallback((partial) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : null))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        googleLogin,
        logout,
        authModalOpen,
        authModalMode,
        authPromptMessage,
        promptLogin,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
