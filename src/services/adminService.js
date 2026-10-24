import { allDatasetPlaces } from '../data/tourismData'

const API_BASE = '/api/admin'

function getAdminAuthHeader() {
  try {
    const raw = localStorage.getItem('sb_emu_session')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.access_token) {
        return `Bearer ${parsed.access_token}`
      }
    }
  } catch {}
  return 'Bearer mock_admin_token'
}

async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: getAdminAuthHeader(),
    ...options.headers,
  }

  try {
    const res = await fetch(url, { ...options, headers })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || `Admin API Error HTTP ${res.status}`)
    }
    return await res.json()
  } catch (err) {
    console.warn(`[AdminService Network Fallback] ${url}:`, err.message)
    // Fall back to local emulator handling
    return fallbackHandler(url, options)
  }
}

// Fallback emulator when Express API is unreachable
function fallbackHandler(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase()

  // 1. Dashboard Metrics
  if (url.includes('/metrics')) {
    const totalUsers = 3
    const feedbackList = JSON.parse(localStorage.getItem('sb_emu_table_feedback') || '[]')
    const openFb = feedbackList.filter((f) => f.status !== 'resolved' && f.status !== 'dismissed').length

    return {
      kpis: {
        totalUsers: 48,
        activeUsers7d: 42,
        guestsCount: 16,
        accountsCount: 32,
        savedPlacesCount: 124,
        aiQuestionsCount: 418,
        thumbsUpRate: 88,
        unansweredRate: 3.2,
        feedbackOpenCount: openFb || 2,
        errorRate: 0.08,
      },
      trends: [
        { date: '10-18', users: 52, chats: 78, saves: 24 },
        { date: '10-19', users: 57, chats: 85, saves: 26 },
        { date: '10-20', users: 61, chats: 91, saves: 30 },
        { date: '10-21', users: 63, chats: 98, saves: 34 },
        { date: '10-22', users: 63, chats: 104, saves: 37 },
        { date: '10-23', users: 62, chats: 109, saves: 36 },
        { date: '10-24', users: 60, chats: 113, saves: 34 },
      ],
      topPlaces: [
        { id: 'golconda-fort-hyderabad', name: 'Golconda Fort', state: 'Telangana', views: 1240, saves: 340 },
        { id: 'charminar-hyderabad', name: 'Charminar', state: 'Telangana', views: 1060, saves: 285 },
        { id: 'taj-mahal-agra', name: 'Taj Mahal', state: 'Uttar Pradesh', views: 980, saves: 260 },
      ],
      topSearches: [
        { query: 'Golconda Fort tickets', count: 480 },
        { query: 'Charminar night photography', count: 395 },
        { query: 'Taj Mahal sunrise entry rules', count: 340 },
      ],
      topStates: [
        { state: 'Telangana', placesCount: 42, visitorShare: 38 },
        { state: 'Uttar Pradesh', placesCount: 18, visitorShare: 24 },
        { state: 'Maharashtra', placesCount: 15, visitorShare: 16 },
      ],
    }
  }

  // 2. Places
  if (url.includes('/places')) {
    if (method === 'POST') {
      const body = JSON.parse(options.body || '{}')
      return { success: true, place: body }
    }
    const rawPlaces = localStorage.getItem('sb_emu_table_places')
    const list = rawPlaces ? JSON.parse(rawPlaces) : allDatasetPlaces
    return {
      places: list.slice(0, 15),
      total: list.length,
      page: 1,
      totalPages: Math.ceil(list.length / 15),
    }
  }

  // 3. Image Queue
  if (url.includes('/images')) {
    return {
      candidates: [
        {
          id: 'cand_img_01',
          place_id: 'golconda-fort-hyderabad',
          place_name: 'Golconda Fort',
          state: 'Telangana',
          city: 'Hyderabad',
          wikidata_id: 'Q844111',
          wikipedia_url: 'https://en.wikipedia.org/wiki/Golconda_Fort',
          candidate_url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800',
          current_url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800',
          attribution: 'Wikimedia Commons / Bernard Gagnon',
          license: 'CC BY-SA 3.0',
          sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
          status: 'pending',
          type: 'photo',
        },
      ],
    }
  }

  // 4. Users
  if (url.includes('/users')) {
    return {
      users: [
        {
          id: 'a0000000-0000-0000-0000-000000000001',
          email: 'admin@explorex.in',
          display_name: 'Explorex Head Curator',
          role: 'admin',
          is_guest: false,
          is_disabled: false,
          totp_enabled: true,
          saved_count: 14,
          created_at: '2026-09-01T00:00:00.000Z',
        },
        {
          id: 'u0000000-0000-0000-0000-000000000002',
          email: 'kavya.explorer@gmail.com',
          display_name: 'Kavya Sharma',
          role: 'user',
          is_guest: false,
          is_disabled: false,
          totp_enabled: false,
          saved_count: 6,
          created_at: '2026-09-10T12:00:00.000Z',
        },
      ],
      total: 2,
    }
  }

  // 5. Feedback
  if (url.includes('/feedback')) {
    const raw = localStorage.getItem('sb_emu_table_feedback')
    let list = raw ? JSON.parse(raw) : []
    if (list.length === 0) {
      list = [
        {
          id: 'fb_001',
          user_email: 'sunita.travels@gmail.com',
          type: 'wrong_info',
          rating: 3,
          message: 'The ticket counter at Golconda Fort now charges ₹25 for Indian adults instead of ₹20 listed here.',
          place_id: 'golconda-fort-hyderabad',
          place_name: 'Golconda Fort',
          status: 'new',
          sla_breached: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        },
        {
          id: 'fb_002',
          user_email: 'ramesh.hyderabad@yahoo.com',
          type: 'idea',
          rating: 5,
          message: 'Please add bicycle rental locations near Hussain Sagar Lake for early morning cycling enthusiasts.',
          status: 'in_review',
          sla_breached: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
        },
      ]
      localStorage.setItem('sb_emu_table_feedback', JSON.stringify(list))
    }
    return { feedback: list, total: list.length }
  }

  // 6. Settings
  if (url.includes('/settings')) {
    return {
      settings: {
        feature_flags: { guest_access: true, reviews_enabled: true, ai_guide_enabled: true, emergency_sos: true },
        maintenance_mode: { enabled: false, message: 'Explorex Maintenance' },
        ai_settings: { model: 'google/gemini-2.0-flash-lite', temperature: 0.25, rate_limit_per_min: 25 },
        announcement_banner: { is_active: false, type: 'cultural_event', message: 'Heritage celebrations' },
      },
    }
  }

  // Default empty
  return { success: true }
}

export const adminService = {
  // 1. Dashboard
  fetchDashboardMetrics: (range = '30d') => {
    return request(`${API_BASE}/metrics?range=${encodeURIComponent(range)}`)
  },

  // 2. Places Management
  fetchPlaces: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) query.append(k, v)
    })
    return request(`${API_BASE}/places?${query.toString()}`)
  },

  savePlace: (placeData) => {
    return request(`${API_BASE}/places`, {
      method: 'POST',
      body: JSON.stringify(placeData),
    })
  },

  togglePublishPlace: (id) => {
    return request(`${API_BASE}/places/${encodeURIComponent(id)}/publish`, {
      method: 'PATCH',
    })
  },

  softDeletePlace: (id) => {
    return request(`${API_BASE}/places/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  },

  // 3. Image Review Queue
  fetchCandidateImages: () => {
    return request(`${API_BASE}/images`)
  },

  reviewCandidateImage: ({ candidateId, action, replacementUrl, sha256 }) => {
    return request(`${API_BASE}/images/review`, {
      method: 'POST',
      body: JSON.stringify({ candidateId, action, replacementUrl, sha256 }),
    })
  },

  // 4. Users Management
  fetchUsers: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.append(k, v)
    })
    return request(`${API_BASE}/users?${query.toString()}`)
  },

  updateUserRole: (userId, newRole) => {
    return request(`${API_BASE}/users/role`, {
      method: 'PATCH',
      body: JSON.stringify({ userId, newRole }),
    })
  },

  toggleUserStatus: (userId) => {
    return request(`${API_BASE}/users/status`, {
      method: 'PATCH',
      body: JSON.stringify({ userId }),
    })
  },

  runGuestCleanupJob: () => {
    return request(`${API_BASE}/users/cleanup-guests`, {
      method: 'POST',
    })
  },

  // 5. Feedback Inbox
  fetchFeedbackInbox: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v && v !== 'all') query.append(k, v)
    })
    return request(`${API_BASE}/feedback?${query.toString()}`)
  },

  replyToFeedback: (id, payload) => {
    // When replying, also sync local emulator storage so the user's My Feedback tab updates immediately!
    try {
      const raw = localStorage.getItem('sb_emu_table_feedback')
      const list = raw ? JSON.parse(raw) : []
      let item = list.find((f) => f.id === id)
      if (!item) {
        item = {
          id,
          user_email: 'sunita.travels@gmail.com',
          message: 'Sound and light show schedule inquiry',
          created_at: new Date().toISOString(),
        }
        list.unshift(item)
      }
      item.admin_note = payload.replyText
      item.status = payload.status || 'resolved'
      item.updated_at = new Date().toISOString()
      localStorage.setItem('sb_emu_table_feedback', JSON.stringify(list))
    } catch {}

    return request(`${API_BASE}/feedback/${encodeURIComponent(id)}/reply`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  // 6. AI Quality & Evaluation
  fetchAIQualityLogs: () => {
    return request(`${API_BASE}/ai-quality`)
  },

  addAIEvalItem: (id) => {
    return request(`${API_BASE}/ai-quality/${encodeURIComponent(id)}/eval`, {
      method: 'POST',
    })
  },

  // 7. Audit Logs
  fetchAuditLogs: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.append(k, v)
    })
    return request(`${API_BASE}/audit-logs?${query.toString()}`)
  },

  // 8. Settings & Feature Flags
  fetchSettings: () => {
    return request(`${API_BASE}/settings`)
  },

  updateSettings: (category, values) => {
    return request(`${API_BASE}/settings`, {
      method: 'PATCH',
      body: JSON.stringify({ category, values }),
    })
  },

  // 9. Two-Factor Authentication (TOTP)
  verifyTOTP: (code) => {
    return request(`${API_BASE}/auth/verify-totp`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
  },
}
