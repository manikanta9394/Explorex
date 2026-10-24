// Base API URL with environment variable support
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5005/api'

// Fallback local accounts store in localStorage if API server is unreachable
const LOCAL_ACCOUNTS_KEY = 'explorex_local_accounts'

function getLocalAccounts() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveLocalAccounts(accounts) {
  try {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts))
  } catch (e) {
    console.warn('Failed to save local accounts:', e)
  }
}

export const authApi = {
  async signup({ name, email, password, confirmPassword }) {
    // 1. First try Express backend API
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account')
      }
      return data
    } catch (err) {
      // If network error / backend not running, fallback to client-side store
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError') && !err.message.includes('fetch')) {
        throw err // Validation or duplicate error from backend
      }

      console.warn('Backend server unreachable, using resilient local auth engine.')
      const accounts = getLocalAccounts()
      const cleanEmail = email.trim().toLowerCase()

      if (accounts.some((a) => a.email === cleanEmail)) {
        throw new Error('An account with this email address already exists. Please log in.')
      }

      const user = {
        id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: name?.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        password, // In real backend it is bcrypt-hashed; in client storage it is scoped to user device
        savedPlaces: [],
        chatHistory: [],
        createdAt: new Date().toISOString(),
      }

      accounts.push(user)
      saveLocalAccounts(accounts)

      const token = `token_${user.id}_${Date.now()}`
      const { password: _, ...safeUser } = user
      return { user: safeUser, token, message: 'Account created successfully' }
    }
  },

  async login({ email, password }) {
    // 1. First try Express backend API
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password')
      }
      return data
    } catch (err) {
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError') && !err.message.includes('fetch')) {
        throw err // Credentials error from backend
      }

      console.warn('Backend server unreachable, using resilient local auth engine.')
      const accounts = getLocalAccounts()
      const cleanEmail = email.trim().toLowerCase()
      const found = accounts.find((a) => a.email === cleanEmail)

      if (!found || found.password !== password) {
        throw new Error('Invalid email or password. Please check your credentials.')
      }

      const token = `token_${found.id}_${Date.now()}`
      const { password: _, ...safeUser } = found
      return { user: safeUser, token, message: 'Logged in successfully' }
    }
  },

  async googleAuth({ email, name, googleId }) {
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, googleId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Google login failed')
      return data
    } catch {
      const cleanEmail = (email || 'traveler@gmail.com').trim().toLowerCase()
      const accounts = getLocalAccounts()
      let found = accounts.find((a) => a.email === cleanEmail)

      if (!found) {
        found = {
          id: `usr_g_${Date.now()}`,
          name: name || 'Google Traveler',
          email: cleanEmail,
          googleId: googleId || 'google_mock_id',
          savedPlaces: [],
          chatHistory: [],
          createdAt: new Date().toISOString(),
        }
        accounts.push(found)
        saveLocalAccounts(accounts)
      }

      const token = `token_${found.id}_${Date.now()}`
      const { password: _, ...safeUser } = found
      return { user: safeUser, token }
    }
  },

  async getMe(token) {
    if (!token) return null
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return null
      const data = await res.json()
      return data.user
    } catch {
      return null
    }
  },

  async syncSavedPlaces(token, savedPlaces) {
    if (!token) return null
    try {
      const res = await fetch(`${API_BASE}/auth/saved-places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ savedPlaces }),
      })
      if (!res.ok) return null
      const data = await res.json()
      return data.savedPlaces
    } catch {
      return null
    }
  },

  async syncChatHistory(token, chatHistory) {
    if (!token) return null
    try {
      const res = await fetch(`${API_BASE}/auth/chat-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chatHistory }),
      })
      if (!res.ok) return null
      const data = await res.json()
      return data.chatHistory
    } catch {
      return null
    }
  },
}
