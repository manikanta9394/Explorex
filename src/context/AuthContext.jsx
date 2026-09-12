import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContextObject'

const STORAGE_KEY = 'tourmate_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      console.warn('Failed to persist auth user:', e)
    }
  }, [user])

  const login = (email, _password) => {
    const nameFromEmail = email.split('@')[0] || 'User'
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
    const userData = { name: formattedName, email }
    setUser(userData)
    return userData
  }

  const signup = (name, email, _password) => {
    const userData = { name: name.trim() || 'Explorer', email }
    setUser(userData)
    return userData
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
