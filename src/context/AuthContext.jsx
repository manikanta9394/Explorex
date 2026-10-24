import { useEffect, useState, useCallback } from 'react'
import { AuthContext } from './AuthContextObject'
import {
  signInWithEmail,
  signUpWithEmail,
  signInAnonymously,
  signInWithGoogle,
  upgradeGuestAccount,
  resetPassword,
  signOut,
  getSession,
} from '../lib/api/auth'
import { supabase } from '../lib/api/supabaseClient'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Modal controls
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login') // 'login' | 'signup' | 'upgrade'
  const [authPromptMessage, setAuthPromptMessage] = useState(null)

  // Normalize Supabase user to Explorex user profile shape
  const normalizeUser = (sbUser) => {
    if (!sbUser) return null
    const meta = sbUser.user_metadata || {}
    const isAnonymous = Boolean(sbUser.is_anonymous || meta.is_anonymous)
    const displayName =
      meta.name ||
      meta.full_name ||
      (sbUser.email && !sbUser.email.endsWith('@explorex.guest') ? sbUser.email.split('@')[0] : null) ||
      (isAnonymous ? 'Guest Explorer' : 'Traveler')

    return {
      id: sbUser.id,
      email: sbUser.email || '',
      name: displayName,
      displayName,
      avatarUrl: meta.avatar_url || meta.picture || null,
      is_anonymous: isAnonymous,
      is_guest: isAnonymous,
      createdAt: sbUser.created_at,
    }
  }

  // Initial session restoration and Supabase auth state subscriber
  useEffect(() => {
    let mounted = true

    getSession()
      .then((sess) => {
        if (!mounted) return
        setSession(sess)
        setUser(sess?.user ? normalizeUser(sess.user) : null)
        setLoading(false)
      })
      .catch(() => {
        if (mounted) setLoading(false)
      })

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return
      setSession(newSession)
      setUser(newSession?.user ? normalizeUser(newSession.user) : null)
      setLoading(false)
    })

    return () => {
      mounted = false
      authListener?.subscription?.unsubscribe?.()
    }
  }, [])

  // 1. Email / Password Sign In
  const login = async (email, password) => {
    setLoading(true)
    try {
      const data = await signInWithEmail(email, password)
      const norm = normalizeUser(data.user)
      setUser(norm)
      setSession(data.session)
      setAuthModalOpen(false)
      setAuthPromptMessage(null)
      return norm
    } finally {
      setLoading(false)
    }
  }

  // 2. Email / Password Sign Up
  const signup = async (name, email, password, confirmPassword) => {
    if (confirmPassword && password !== confirmPassword) {
      throw new Error('Passwords do not match')
    }
    setLoading(true)
    try {
      const data = await signUpWithEmail(email, password, name)
      const norm = normalizeUser(data.user)
      setUser(norm)
      setSession(data.session)
      setAuthModalOpen(false)
      setAuthPromptMessage(null)
      return norm
    } finally {
      setLoading(false)
    }
  }

  // 3. Anonymous Guest Sign In
  const signInAsGuest = async () => {
    setLoading(true)
    try {
      const data = await signInAnonymously()
      const norm = normalizeUser(data.user)
      setUser(norm)
      setSession(data.session)
      setAuthModalOpen(false)
      setAuthPromptMessage(null)
      return norm
    } finally {
      setLoading(false)
    }
  }

  // 4. Upgrade Guest Account to Permanent (Preserves Same User ID!)
  const upgradeGuest = async (email, password, displayName) => {
    setLoading(true)
    try {
      const data = await upgradeGuestAccount(email, password, displayName)
      const norm = normalizeUser(data.user)
      setUser(norm)
      setAuthModalOpen(false)
      return norm
    } finally {
      setLoading(false)
    }
  }

  // 5. Google Sign In
  const googleLogin = async () => {
    setLoading(true)
    try {
      return await signInWithGoogle()
    } finally {
      setLoading(false)
    }
  }

  // 6. Password Reset
  const sendPasswordReset = async (email) => {
    setLoading(true)
    try {
      return await resetPassword(email)
    } finally {
      setLoading(false)
    }
  }

  // 7. Sign Out
  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await signOut()
      setUser(null)
      setSession(null)
      setAuthModalOpen(false)
      // Navigate to welcome page
      const base = import.meta.env.BASE_URL || '/Explorex/'
      const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
      try {
        window.history.pushState(null, '', `${normalizedBase}/welcome`)
      } catch {
        window.location.hash = '#/welcome'
      }
      window.dispatchEvent(new PopStateEvent('popstate'))
    } finally {
      setLoading(false)
    }
  }, [])

  const promptLogin = useCallback((message = 'Please log in or continue as guest to proceed.') => {
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
    setUser((prev) => {
      if (!prev) return null
      const updated = {
        ...prev,
        ...partial,
        user_metadata: {
          ...(prev.user_metadata || {}),
          ...partial,
        },
      }
      try {
        const raw = localStorage.getItem('sb_emu_session')
        if (raw) {
          const parsed = JSON.parse(raw)
          parsed.user = { ...parsed.user, ...updated }
          localStorage.setItem('sb_emu_session', JSON.stringify(parsed))
        }
      } catch {}
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        token: session?.access_token || null,
        loading,
        login,
        signup,
        signInAsGuest,
        upgradeGuest,
        googleLogin,
        resetPassword: sendPasswordReset,
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
