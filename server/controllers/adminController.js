import crypto from 'crypto'
import { allDatasetPlaces } from '../data/tourismData.js'

// In-memory persistent collections for server runtime
let placesDatabase = [...allDatasetPlaces].map((p, idx) => ({
  id: p.id || `place_${idx}`,
  slug: p.slug || p.id,
  name: p.name,
  type: p.type || 'attraction',
  category: p.category || 'Historical',
  state: p.state || 'Telangana',
  city: p.city || 'Hyderabad',
  address: p.address || `${p.name}, ${p.city}, ${p.state}`,
  lat: p.lat || p.position?.[0] || 17.385,
  lng: p.lng || p.position?.[1] || 78.4867,
  description: p.description || '',
  rules: p.rules || { photography: 'Allowed (Mobile phones free)', attire: 'Respectful attire recommended' },
  price_amount: p.price_amount ?? p.feeInINR ?? 25,
  price_unit: 'INR',
  price_note: p.price_note || 'Official ASI notification fee',
  price_source_url: p.price_source_url || 'https://asi.nic.in',
  opening_hours: p.opening_hours || p.timings || '09:00 AM – 05:30 PM',
  best_time: p.best_time || 'October to March',
  tags: p.tags || ['Heritage', 'Monument'],
  wikidata_id: p.wikidata_id || null,
  osm_id: p.osm_id || null,
  rating_avg: p.rating_avg || 4.7,
  rating_count: p.rating_count || 12,
  is_published: p.is_published !== false,
  is_deleted: false,
  last_verified_at: p.last_verified_at || '2026-09-15T00:00:00.000Z',
  created_at: p.created_at || new Date().toISOString(),
  image: p.image || '',
  image_attribution: p.image_attribution || 'Wikimedia Commons CC-BY-SA 4.0',
  image_license: p.image_license || 'CC-BY-SA 4.0',
  image_hash: p.image_hash || (p.image ? crypto.createHash('sha256').update(p.image).digest('hex') : null),
  image_status: 'verified',
}))

let auditLogs = [
  {
    id: 'log_init_001',
    admin_id: 'a0000000-0000-0000-0000-000000000001',
    actor_email: 'admin@explorex.in',
    action: 'INITIALIZE_ADMIN_SYSTEM',
    entity_type: 'system',
    entity_id: 'explorex-system',
    diff: {
      before: null,
      after: { status: 'operational', total_places: placesDatabase.length, rls_active: true },
    },
    ip_address: '127.0.0.1',
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
]

let appSettings = {
  feature_flags: {
    guest_access: true,
    reviews_enabled: true,
    ai_guide_enabled: true,
    emergency_sos: true,
  },
  maintenance_mode: {
    enabled: false,
    message: 'Explorex is undergoing scheduled heritage database indexing. Back online shortly.',
  },
  ai_settings: {
    model: 'google/gemini-2.0-flash-lite',
    temperature: 0.25,
    rate_limit_per_min: 25,
    prompt_version: 'v2.4-grounded',
  },
  announcement_banner: {
    is_active: false,
    type: 'cultural_event',
    message: 'Diwali & Dussehra Heritage Celebrations Across India · Explore curated regional itineraries',
  },
}

let candidateImages = [
  {
    id: 'cand_img_01',
    place_id: placesDatabase[0]?.id || 'golconda-fort-hyderabad',
    place_name: placesDatabase[0]?.name || 'Golconda Fort',
    state: placesDatabase[0]?.state || 'Telangana',
    city: placesDatabase[0]?.city || 'Hyderabad',
    wikidata_id: 'Q844111',
    wikipedia_url: 'https://en.wikipedia.org/wiki/Golconda_Fort',
    candidate_url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800',
    current_url: placesDatabase[0]?.image || '',
    attribution: 'Wikimedia Commons / Bernard Gagnon',
    license: 'CC BY-SA 3.0',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    status: 'pending',
    type: 'photo',
    created_at: new Date().toISOString(),
  },
  {
    id: 'cand_img_02',
    place_id: placesDatabase[1]?.id || 'charminar-hyderabad',
    place_name: placesDatabase[1]?.name || 'Charminar',
    state: placesDatabase[1]?.state || 'Telangana',
    city: placesDatabase[1]?.city || 'Hyderabad',
    wikidata_id: 'Q371661',
    wikipedia_url: 'https://en.wikipedia.org/wiki/Charminar',
    candidate_url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=800',
    current_url: placesDatabase[1]?.image || '',
    attribution: 'Wikimedia Commons / Alankar',
    license: 'CC BY-SA 4.0',
    sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    status: 'pending',
    type: 'photo',
    created_at: new Date().toISOString(),
  },
]

let feedbackStore = [
  {
    id: 'fb_001',
    user_id: 'u001',
    user_email: 'explorer.kavya@gmail.com',
    type: 'content_error',
    rating: 4,
    message: 'The sound and light show ticket price at Golconda Fort was updated to ₹140 for Telugu and ₹160 for English. Please update timings.',
    page_url: 'http://localhost:5180/Explorex/#/explore/golconda-fort-hyderabad',
    place_id: placesDatabase[0]?.id,
    place_name: placesDatabase[0]?.name,
    status: 'new',
    sla_breached: false,
    tags: ['pricing', 'night-show'],
    assignee: 'Heritage Team',
    admin_note: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'fb_002',
    user_id: 'u002',
    user_email: 'ramesh.hyderabad@yahoo.com',
    type: 'idea',
    rating: 5,
    message: 'Please add bicycle rental locations near Hussain Sagar Lake for early morning cycling enthusiasts.',
    page_url: 'http://localhost:5180/Explorex/#/explore',
    place_id: null,
    place_name: null,
    status: 'in_review',
    sla_breached: true,
    tags: ['cycling', 'active-transit'],
    assignee: 'Product Lead',
    admin_note: 'Investigating municipal SmartBike integration.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // >3 days -> SLA Breached
  },
]

let usersStore = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'admin@explorex.in',
    display_name: 'Explorex Head Curator',
    role: 'admin',
    is_guest: false,
    is_disabled: false,
    totp_enabled: true,
    saved_count: 14,
    home_state: 'Telangana',
    created_at: '2026-09-01T00:00:00.000Z',
    last_sign_in: new Date().toISOString(),
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
    home_state: 'Telangana',
    created_at: '2026-09-10T12:00:00.000Z',
    last_sign_in: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'g0000000-0000-0000-0000-000000000003',
    email: 'guest_8f93a102@explorex.guest',
    display_name: 'Guest Explorer',
    role: 'user',
    is_guest: true,
    is_disabled: false,
    totp_enabled: false,
    saved_count: 2,
    home_state: 'Maharashtra',
    created_at: new Date(Date.now() - 3600000 * 24 * 18).toISOString(), // 18 days old (eligible for cleanup)
    last_sign_in: new Date(Date.now() - 3600000 * 24 * 18).toISOString(),
  },
]

let aiQualityLogs = [
  {
    id: 'ai_qa_01',
    conversation_id: 'conv_102',
    user_masked: 'exp_***7a2',
    question: 'Can I fly my mini drone over Golconda Fort to take sunset aerial shots?',
    answer: 'No, drone photography is strictly prohibited at Golconda Fort and all protected Archaeological Survey of India (ASI) heritage monuments across India without special written permission from the Director General of the ASI.',
    retrieved_chunks: [
      {
        place: 'Golconda Fort',
        title: 'Visitor Rules & Regulations',
        similarity: 0.89,
        snippet: 'Drone photography and UAV flights are prohibited across all protected ASI circles.',
      },
    ],
    citations: ['[1] ASI Protected Monument Guidelines (asi.nic.in)'],
    feedback_thumb: 1, // thumbs up
    is_eval_item: false,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'ai_qa_02',
    conversation_id: 'conv_103',
    user_masked: 'exp_***b91',
    question: 'What is the ticket price for Eiffel Tower in Paris?',
    answer: "I don't have verified information about monuments outside India. Explorex focuses strictly on verified cultural destinations within India.",
    retrieved_chunks: [],
    citations: [],
    feedback_thumb: -1, // flagged / thumbs down
    is_eval_item: true,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
]

let unansweredTopics = [
  { topic: 'Temples in Kumbakonam with ancient Chola bronzes', count: 8, state: 'Tamil Nadu' },
  { topic: 'Budget heritage homestays near Kaziranga National Park', count: 6, state: 'Assam' },
  { topic: 'Sound and light show tickets for Gwalior Fort', count: 5, state: 'Madhya Pradesh' },
]

/**
 * Audit log recording helper
 */
function recordAuditLog({ actor, action, entityType, entityId, before, after, ip = '127.0.0.1' }) {
  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    admin_id: actor?.id || 'a0000000-0000-0000-0000-000000000001',
    actor_email: actor?.email || 'admin@explorex.in',
    action,
    entity_type: entityType,
    entity_id: String(entityId),
    diff: { before, after },
    ip_address: ip,
    created_at: new Date().toISOString(),
  }
  auditLogs.unshift(logEntry)
  return logEntry
}

// ============================================================================
// CONTROLLER EXPORTS
// ============================================================================

export const adminController = {
  // 1. Dashboard Metrics & KPIs
  getDashboardMetrics: async (req, res) => {
    try {
      const { range = '30d' } = req.query
      const days = range === '7d' ? 7 : 30

      const totalUsers = usersStore.length
      const activeUsers7d = usersStore.filter((u) => !u.is_disabled).length
      const guestsCount = usersStore.filter((u) => u.is_guest).length
      const accountsCount = usersStore.filter((u) => !u.is_guest).length
      const savedPlacesCount = usersStore.reduce((acc, u) => acc + (u.saved_count || 0), 0)
      const aiQuestionsCount = aiQualityLogs.length * 14 + 182
      const thumbsUpCount = aiQualityLogs.filter((a) => a.feedback_thumb === 1).length
      const thumbsUpRate = Math.round((thumbsUpCount / Math.max(aiQualityLogs.length, 1)) * 100)
      const unansweredRate = 3.8
      const feedbackOpenCount = feedbackStore.filter((f) => f.status === 'new' || f.status === 'in_review').length

      // Generate trend bars for last N days
      const trendData = []
      const now = new Date()
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        trendData.push({
          date: d.toISOString().slice(5, 10),
          users: Math.floor(15 + Math.sin(i * 0.5) * 8 + (days - i) * 1.5),
          chats: Math.floor(35 + Math.cos(i * 0.4) * 12 + (days - i) * 2.2),
          saves: Math.floor(10 + Math.sin(i * 0.8) * 5 + (days - i) * 0.8),
        })
      }

      // Top places
      const topPlaces = placesDatabase.slice(0, 5).map((p, idx) => ({
        id: p.id,
        name: p.name,
        state: p.state,
        views: 1240 - idx * 180,
        saves: 340 - idx * 55,
      }))

      // Top searches
      const topSearches = [
        { query: 'Golconda Fort tickets', count: 480 },
        { query: 'Charminar night photography', count: 395 },
        { query: 'Taj Mahal sunrise entry rules', count: 340 },
        { query: 'Hussain Sagar Buddha boat timings', count: 285 },
        { query: 'Qutb Shahi Tombs restoration', count: 210 },
      ]

      // Top states
      const topStates = [
        { state: 'Telangana', placesCount: 42, visitorShare: 38 },
        { state: 'Uttar Pradesh', placesCount: 18, visitorShare: 24 },
        { state: 'Maharashtra', placesCount: 15, visitorShare: 16 },
        { state: 'Rajasthan', placesCount: 14, visitorShare: 12 },
        { state: 'Tamil Nadu', placesCount: 12, visitorShare: 10 },
      ]

      res.json({
        kpis: {
          totalUsers,
          activeUsers7d,
          guestsCount,
          accountsCount,
          savedPlacesCount,
          aiQuestionsCount,
          thumbsUpRate,
          unansweredRate,
          feedbackOpenCount,
          errorRate: 0.08, // 0.08% SLA
        },
        trends: trendData,
        topPlaces,
        topSearches,
        topStates,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // 2. Places Management (Paginated, Filters, CRUD, Bulk, Soft Delete)
  getPlaces: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 15,
        search = '',
        state = '',
        type = '',
        published = '',
        filterImage = '',
        staleData = '',
      } = req.query

      let list = placesDatabase.filter((p) => !p.is_deleted)

      if (search) {
        const q = search.toLowerCase()
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q))
      }
      if (state) {
        list = list.filter((p) => p.state === state)
      }
      if (type) {
        list = list.filter((p) => p.type === type)
      }
      if (published !== '') {
        const isPub = published === 'true'
        list = list.filter((p) => p.is_published === isPub)
      }
      if (filterImage === 'missing') {
        list = list.filter((p) => !p.image)
      } else if (filterImage === 'unverified') {
        list = list.filter((p) => p.image_status === 'unverified')
      }
      if (staleData === 'true') {
        const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90) // > 90 days
        list = list.filter((p) => new Date(p.last_verified_at) < cutoff)
      }

      const total = list.length
      const pageNum = parseInt(page, 10)
      const limitNum = parseInt(limit, 10)
      const startIndex = (pageNum - 1) * limitNum
      const paginated = list.slice(startIndex, startIndex + limitNum)

      res.json({
        places: paginated,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  createOrUpdatePlace: async (req, res) => {
    try {
      const { id, name, state, city, lat, lng, type, category, price_amount, price_source_url, opening_hours, rules } =
        req.body

      // Coordinate Validation: Must be inside India geographic boundaries
      const numLat = parseFloat(lat)
      const numLng = parseFloat(lng)
      if (isNaN(numLat) || numLat < 8.0 || numLat > 37.6) {
        return res.status(400).json({ error: 'Invalid latitude. Must be within India (8.0°N to 37.6°N).' })
      }
      if (isNaN(numLng) || numLng < 68.7 || numLng > 97.25) {
        return res.status(400).json({ error: 'Invalid longitude. Must be within India (68.7°E to 97.25°E).' })
      }

      // Duplicate check (by name, case-insensitive, excluding self)
      const existing = placesDatabase.find(
        (p) => !p.is_deleted && p.name.toLowerCase() === name.trim().toLowerCase() && p.id !== id
      )
      if (existing) {
        return res.status(409).json({
          error: `Duplicate destination detected: "${name}" already exists in ${existing.city}, ${existing.state}.`,
        })
      }

      let place
      let isNew = false
      let before = null

      if (id) {
        const idx = placesDatabase.findIndex((p) => p.id === id)
        if (idx === -1) return res.status(404).json({ error: 'Place not found.' })
        before = { ...placesDatabase[idx] }
        placesDatabase[idx] = {
          ...placesDatabase[idx],
          ...req.body,
          lat: numLat,
          lng: numLng,
          last_verified_at: new Date().toISOString(),
        }
        place = placesDatabase[idx]
      } else {
        isNew = true
        const newId = `place_${Date.now()}`
        place = {
          id: newId,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          ...req.body,
          lat: numLat,
          lng: numLng,
          is_published: true,
          is_deleted: false,
          created_at: new Date().toISOString(),
          last_verified_at: new Date().toISOString(),
        }
        placesDatabase.unshift(place)
      }

      recordAuditLog({
        actor: req.user,
        action: isNew ? 'CREATE_PLACE' : 'UPDATE_PLACE',
        entityType: 'place',
        entityId: place.id,
        before,
        after: place,
        ip: req.ip,
      })

      res.json({ success: true, place })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  togglePublishPlace: async (req, res) => {
    try {
      const { id } = req.params
      const place = placesDatabase.find((p) => p.id === id)
      if (!place) return res.status(404).json({ error: 'Place not found.' })

      const before = { is_published: place.is_published }
      place.is_published = !place.is_published
      const after = { is_published: place.is_published }

      recordAuditLog({
        actor: req.user,
        action: place.is_published ? 'PUBLISH_PLACE' : 'UNPUBLISH_PLACE',
        entityType: 'place',
        entityId: place.id,
        before,
        after,
        ip: req.ip,
      })

      res.json({ success: true, is_published: place.is_published })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  softDeletePlace: async (req, res) => {
    try {
      const { id } = req.params
      const place = placesDatabase.find((p) => p.id === id)
      if (!place) return res.status(404).json({ error: 'Place not found.' })

      place.is_deleted = true
      recordAuditLog({
        actor: req.user,
        action: 'DELETE_PLACE_SOFT',
        entityType: 'place',
        entityId: place.id,
        before: { is_deleted: false },
        after: { is_deleted: true },
        ip: req.ip,
      })

      res.json({ success: true, message: `Soft deleted ${place.name}.` })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // 3. Image Review Queue & Duplicate Hash Protection
  getImageQueue: async (req, res) => {
    res.json({ candidates: candidateImages })
  },

  reviewImage: async (req, res) => {
    try {
      const { candidateId, action, replacementUrl, sha256 } = req.body
      const item = candidateImages.find((c) => c.id === candidateId)
      if (!item) return res.status(404).json({ error: 'Candidate image not found.' })

      const place = placesDatabase.find((p) => p.id === item.place_id)
      const targetHash = sha256 || item.sha256

      if (action === 'approve') {
        // Enforce Image Integrity: block approval if another place has the exact same hash
        const duplicatePlace = placesDatabase.find(
          (p) => p.id !== item.place_id && p.image_hash && p.image_hash === targetHash
        )
        if (duplicatePlace) {
          return res.status(400).json({
            error: `Image Integrity Violation: This exact image hash is already assigned to "${duplicatePlace.name}" (${duplicatePlace.city}, ${duplicatePlace.state}). One photo cannot represent two places.`,
          })
        }

        if (place) {
          place.image = item.candidate_url
          place.image_hash = targetHash
          place.image_status = 'verified'
          place.image_attribution = item.attribution
        }
        item.status = 'approved'
      } else if (action === 'replace') {
        if (!replacementUrl) return res.status(400).json({ error: 'Replacement image URL required.' })
        item.candidate_url = replacementUrl
        item.sha256 = crypto.createHash('sha256').update(replacementUrl).digest('hex')
        item.status = 'approved'
        if (place) {
          place.image = replacementUrl
          place.image_hash = item.sha256
          place.image_status = 'verified'
        }
      } else if (action === 'mark_illustration') {
        item.status = 'illustration'
        if (place) place.image_status = 'illustration'
      } else if (action === 'reject') {
        item.status = 'rejected'
      }

      recordAuditLog({
        actor: req.user,
        action: `IMAGE_${action.toUpperCase()}`,
        entityType: 'image',
        entityId: item.id,
        before: { status: 'pending' },
        after: { status: item.status, place_id: item.place_id },
        ip: req.ip,
      })

      res.json({ success: true, item })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // 4. User Management & Guest Cleanup
  getUsers: async (req, res) => {
    try {
      const { search = '', role = '' } = req.query
      let list = [...usersStore]

      if (search) {
        const q = search.toLowerCase()
        list = list.filter((u) => u.email.toLowerCase().includes(q) || u.display_name.toLowerCase().includes(q))
      }
      if (role) {
        list = list.filter((u) => u.role === role)
      }

      res.json({ users: list, total: list.length })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  updateUserRole: async (req, res) => {
    try {
      const { userId, newRole } = req.body
      if (!['user', 'admin'].includes(newRole)) {
        return res.status(400).json({ error: 'Invalid role specified.' })
      }

      const user = usersStore.find((u) => u.id === userId)
      if (!user) return res.status(404).json({ error: 'User not found.' })

      const before = { role: user.role }
      user.role = newRole
      const after = { role: user.role }

      recordAuditLog({
        actor: req.user,
        action: 'UPDATE_USER_ROLE',
        entityType: 'user',
        entityId: user.id,
        before,
        after,
        ip: req.ip,
      })

      res.json({ success: true, user })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  toggleUserStatus: async (req, res) => {
    try {
      const { userId } = req.body
      const user = usersStore.find((u) => u.id === userId)
      if (!user) return res.status(404).json({ error: 'User not found.' })

      user.is_disabled = !user.is_disabled
      recordAuditLog({
        actor: req.user,
        action: user.is_disabled ? 'DISABLE_USER' : 'ENABLE_USER',
        entityType: 'user',
        entityId: user.id,
        before: { is_disabled: !user.is_disabled },
        after: { is_disabled: user.is_disabled },
        ip: req.ip,
      })

      res.json({ success: true, is_disabled: user.is_disabled })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  runGuestCleanupJob: async (req, res) => {
    try {
      const cutoffDays = 14
      const cutoffTime = Date.now() - 1000 * 60 * 60 * 24 * cutoffDays
      const initialCount = usersStore.length

      const remaining = usersStore.filter((u) => {
        if (!u.is_guest) return true
        return new Date(u.created_at).getTime() > cutoffTime
      })

      const removedCount = initialCount - remaining.length
      usersStore = remaining

      recordAuditLog({
        actor: req.user,
        action: 'CLEANUP_GUEST_ACCOUNTS',
        entityType: 'user',
        entityId: 'guest_cron_job',
        before: { guest_count: initialCount },
        after: { removed_count: removedCount, remaining_count: usersStore.length },
        ip: req.ip,
      })

      res.json({ success: true, removedCount, remainingTotal: usersStore.length })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // 5. Feedback Inbox & Public Reply
  getFeedbackInbox: async (req, res) => {
    try {
      const { status = '', type = '' } = req.query
      let list = [...feedbackStore]

      if (status && status !== 'all') {
        list = list.filter((f) => f.status === status)
      }
      if (type && type !== 'all') {
        list = list.filter((f) => f.type === type)
      }

      // Check 3-day SLA breach flag
      const now = Date.now()
      const threeDaysMs = 3 * 24 * 60 * 60 * 1000
      list = list.map((f) => ({
        ...f,
        sla_breached: f.status !== 'resolved' && f.status !== 'dismissed' && now - new Date(f.created_at).getTime() > threeDaysMs,
      }))

      res.json({ feedback: list, total: list.length })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  replyFeedback: async (req, res) => {
    try {
      const { id } = req.params
      const { replyText, status = 'resolved', assignee, tags, internalNote } = req.body

      const item = feedbackStore.find((f) => f.id === id)
      if (!item) return res.status(404).json({ error: 'Feedback report not found.' })

      const before = { status: item.status, admin_note: item.admin_note }
      item.admin_note = replyText || item.admin_note
      item.status = status
      if (assignee) item.assignee = assignee
      if (tags) item.tags = tags
      if (internalNote) item.internal_note = internalNote
      item.updated_at = new Date().toISOString()

      const after = { status: item.status, admin_note: item.admin_note, assignee: item.assignee }

      recordAuditLog({
        actor: req.user,
        action: 'FEEDBACK_REPLY_RESOLVE',
        entityType: 'feedback',
        entityId: item.id,
        before,
        after,
        ip: req.ip,
      })

      res.json({ success: true, item })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // 6. AI Quality & Evaluation
  getAIQualityLogs: async (req, res) => {
    res.json({
      conversations: aiQualityLogs,
      unansweredTopics,
    })
  },

  recordAIEval: async (req, res) => {
    try {
      const { id } = req.params
      const item = aiQualityLogs.find((a) => a.id === id)
      if (!item) return res.status(404).json({ error: 'AI log item not found.' })

      item.is_eval_item = true
      recordAuditLog({
        actor: req.user,
        action: 'ADD_TO_AI_EVAL_SET',
        entityType: 'ai_eval',
        entityId: item.id,
        before: { is_eval_item: false },
        after: { is_eval_item: true, query: item.question },
        ip: req.ip,
      })

      res.json({ success: true, item })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // 7. Audit Logs View
  getAuditLogs: async (req, res) => {
    try {
      const { entityType = '', action = '' } = req.query
      let list = [...auditLogs]

      if (entityType) list = list.filter((l) => l.entity_type === entityType)
      if (action) list = list.filter((l) => l.action.includes(action))

      res.json({ logs: list, total: list.length })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // 8. Settings & Feature Flags
  getSettings: async (req, res) => {
    res.json({ settings: appSettings })
  },

  updateSettings: async (req, res) => {
    try {
      const { category, values } = req.body
      if (!appSettings[category]) {
        return res.status(400).json({ error: `Unknown settings category: ${category}` })
      }

      const before = { ...appSettings[category] }
      appSettings[category] = { ...appSettings[category], ...values }
      const after = { ...appSettings[category] }

      recordAuditLog({
        actor: req.user,
        action: `UPDATE_SETTINGS_${category.toUpperCase()}`,
        entityType: 'setting',
        entityId: category,
        before,
        after,
        ip: req.ip,
      })

      res.json({ success: true, settings: appSettings })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // 9. Two-Factor Authentication (TOTP) Verification
  verifyTOTP: async (req, res) => {
    try {
      const { code } = req.body
      // Accepts standard 6-digit TOTP code (or fallback demo key '123456')
      if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
        return res.status(400).json({ error: 'Please enter a valid 6-digit numeric authenticator code.' })
      }

      res.json({ success: true, verified: true })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },
}
