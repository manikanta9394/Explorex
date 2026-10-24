import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('your_supabase') &&
    !supabaseAnonKey.includes('your_anon_key')
)

export const isSupabaseConfigured = () => isConfigured

/**
 * Local resilient Supabase client wrapper when real keys are not yet provided.
 * Mimics auth and database tables so the Access Gate, anonymous guest creation,
 * user upgrades, and saved_places table operations work reliably in any environment.
 */
class LocalSupabaseEmulator {
  constructor() {
    this.listeners = new Set()
  }

  _getStorage(key, fallback = null) {
    try {
      const val = localStorage.getItem(`sb_emu_${key}`)
      return val ? JSON.parse(val) : fallback
    } catch {
      return fallback
    }
  }

  _setStorage(key, val) {
    try {
      if (val === null) localStorage.removeItem(`sb_emu_${key}`)
      else localStorage.setItem(`sb_emu_${key}`, JSON.stringify(val))
    } catch {}
  }

  _notify(event, session) {
    this.listeners.forEach((cb) => {
      try {
        cb(event, session)
      } catch (err) {
        console.warn('Auth listener error:', err)
      }
    })
  }

  auth = {
    getSession: async () => {
      const session = this._getStorage('session', null)
      return { data: { session }, error: null }
    },

    getUser: async () => {
      const session = this._getStorage('session', null)
      return { data: { user: session?.user || null }, error: null }
    },

    signInWithPassword: async ({ email, password }) => {
      if (!email || !password) {
        return { data: { user: null, session: null }, error: new Error('Email and password required') }
      }
      const users = this._getStorage('registered_users', [])
      const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (!matched || matched.password !== password) {
        return { data: { user: null, session: null }, error: new Error('Invalid email or password') }
      }

      const user = {
        id: matched.id,
        email: matched.email,
        user_metadata: { name: matched.name, full_name: matched.name },
        is_anonymous: false,
        created_at: matched.created_at,
      }
      const session = { access_token: `mock_jwt_${user.id}`, user }
      this._setStorage('session', session)
      this._notify('SIGNED_IN', session)
      return { data: { user, session }, error: null }
    },

    signUp: async ({ email, password, options = {} }) => {
      if (!email || !password) {
        return { data: { user: null, session: null }, error: new Error('Email and password required') }
      }
      const users = this._getStorage('registered_users', [])
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { data: { user: null, session: null }, error: new Error('An account with this email already exists') }
      }

      const id = crypto.randomUUID()
      const newUser = {
        id,
        email,
        password,
        name: options.data?.name || options.data?.full_name || email.split('@')[0],
        created_at: new Date().toISOString(),
      }
      users.push(newUser)
      this._setStorage('registered_users', users)

      const user = {
        id: newUser.id,
        email: newUser.email,
        user_metadata: { name: newUser.name, full_name: newUser.name },
        is_anonymous: false,
        created_at: newUser.created_at,
      }
      const session = { access_token: `mock_jwt_${user.id}`, user }
      this._setStorage('session', session)
      this._notify('SIGNED_IN', session)
      return { data: { user, session }, error: null }
    },

    signInAnonymously: async (opts = {}) => {
      const existingSession = this._getStorage('session', null)
      if (existingSession?.user?.is_anonymous) {
        return { data: { user: existingSession.user, session: existingSession }, error: null }
      }

      const id = crypto.randomUUID()
      const user = {
        id,
        email: `guest_${id.slice(0, 8)}@explorex.guest`,
        user_metadata: {
          name: opts.options?.data?.name || 'Guest Explorer',
          is_anonymous: true,
        },
        is_anonymous: true,
        created_at: new Date().toISOString(),
      }
      const session = { access_token: `mock_guest_jwt_${id}`, user }
      this._setStorage('session', session)
      this._notify('SIGNED_IN', session)
      return { data: { user, session }, error: null }
    },

    signInWithOAuth: async ({ provider, options = {} }) => {
      const id = crypto.randomUUID()
      const user = {
        id,
        email: 'traveler.google@explorex.in',
        user_metadata: { name: 'Google Explorer', full_name: 'Google Explorer' },
        is_anonymous: false,
        created_at: new Date().toISOString(),
      }
      const session = { access_token: `mock_oauth_jwt_${id}`, user }
      this._setStorage('session', session)
      this._notify('SIGNED_IN', session)
      if (options.redirectTo) {
        window.location.href = options.redirectTo
      }
      return { data: { provider, url: null }, error: null }
    },

    updateUser: async ({ email, password, data = {} }) => {
      const session = this._getStorage('session', null)
      if (!session || !session.user) {
        return { data: { user: null }, error: new Error('No active session to update') }
      }

      // Upgrade existing user keeping THE SAME id!
      const currentId = session.user.id
      const updatedUser = {
        ...session.user,
        email: email || session.user.email,
        user_metadata: {
          ...session.user.user_metadata,
          ...data,
          is_anonymous: false,
        },
        is_anonymous: false,
      }

      if (email && password) {
        const users = this._getStorage('registered_users', [])
        const existingIdx = users.findIndex((u) => u.id === currentId)
        const record = {
          id: currentId,
          email,
          password,
          name: data.name || updatedUser.user_metadata?.name || email.split('@')[0],
          created_at: session.user.created_at,
        }
        if (existingIdx >= 0) users[existingIdx] = record
        else users.push(record)
        this._setStorage('registered_users', users)
      }

      const updatedSession = { ...session, user: updatedUser }
      this._setStorage('session', updatedSession)
      this._notify('USER_UPDATED', updatedSession)
      return { data: { user: updatedUser }, error: null }
    },

    resetPasswordForEmail: async (_email, _opts) => {
      return { data: {}, error: null }
    },

    signOut: async () => {
      this._setStorage('session', null)
      this._notify('SIGNED_OUT', null)
      return { error: null }
    },

    onAuthStateChange: (callback) => {
      this.listeners.add(callback)
      const session = this._getStorage('session', null)
      if (session) {
        setTimeout(() => callback('INITIAL_SESSION', session), 0)
      }
      return {
        data: {
          subscription: {
            unsubscribe: () => this.listeners.delete(callback),
          },
        },
      }
    },
  }

  from(table) {
    const self = this
    return {
      select: (_columns = '*') => {
        let filters = []
        let orderField = null
        let orderAsc = true
        let single = false

        const queryObj = {
          eq: (field, value) => {
            filters.push((row) => row[field] === value)
            return queryObj
          },
          order: (field, opts = {}) => {
            orderField = field
            orderAsc = opts.ascending !== false
            return queryObj
          },
          single: () => {
            single = true
            return queryObj
          },
          then: (resolve) => {
            const rows = self._getStorage(`table_${table}`, [])
            let filtered = rows.filter((r) => filters.every((fn) => fn(r)))
            if (orderField) {
              filtered.sort((a, b) => {
                if (a[orderField] < b[orderField]) return orderAsc ? -1 : 1
                if (a[orderField] > b[orderField]) return orderAsc ? 1 : -1
                return 0
              })
            }
            if (single) {
              resolve({ data: filtered[0] || null, error: null })
            } else {
              resolve({ data: filtered, error: null })
            }
          },
        }
        return queryObj
      },

      insert: (recordOrRecords) => {
        return {
          select: () => {
            return {
              then: (resolve) => {
                const rows = self._getStorage(`table_${table}`, [])
                const toAdd = Array.isArray(recordOrRecords) ? recordOrRecords : [recordOrRecords]
                const created = toAdd.map((r) => ({
                  id: r.id || crypto.randomUUID(),
                  created_at: new Date().toISOString(),
                  ...r,
                }))
                rows.push(...created)
                self._setStorage(`table_${table}`, rows)
                resolve({ data: Array.isArray(recordOrRecords) ? created : created[0], error: null })
              },
            }
          },
          then: (resolve) => {
            const rows = self._getStorage(`table_${table}`, [])
            const toAdd = Array.isArray(recordOrRecords) ? recordOrRecords : [recordOrRecords]
            const created = toAdd.map((r) => ({
              id: r.id || crypto.randomUUID(),
              created_at: new Date().toISOString(),
              ...r,
            }))
            rows.push(...created)
            self._setStorage(`table_${table}`, rows)
            resolve({ data: Array.isArray(recordOrRecords) ? created : created[0], error: null })
          },
        }
      },

      delete: () => {
        let filters = []
        const queryObj = {
          eq: (field, value) => {
            filters.push((row) => row[field] === value)
            return queryObj
          },
          then: (resolve) => {
            const rows = self._getStorage(`table_${table}`, [])
            const remaining = rows.filter((r) => !filters.every((fn) => fn(r)))
            self._setStorage(`table_${table}`, remaining)
            resolve({ data: null, error: null })
          },
        }
        return queryObj
      },

      upsert: (record) => {
        return {
          then: (resolve) => {
            const rows = self._getStorage(`table_${table}`, [])
            const idx = rows.findIndex((r) => {
              if (record.id && r.id === record.id) return true
              if (record.user_id && record.place_id && r.user_id === record.user_id && r.place_id === record.place_id) {
                return true
              }
              return false
            })
            if (idx >= 0) {
              rows[idx] = { ...rows[idx], ...record }
            } else {
              rows.push({ id: record.id || crypto.randomUUID(), created_at: new Date().toISOString(), ...record })
            }
            self._setStorage(`table_${table}`, rows)
            resolve({ data: record, error: null })
          },
        }
      },
    }
  }
}

// Export singleton Supabase client
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
    })
  : new LocalSupabaseEmulator()
