import { enrichedHotels as hotels, enrichedPlaces as places, enrichedRestaurants as restaurants } from '../data/tourismData.js'

const configuredApiUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL ? import.meta.env.VITE_API_URL.trim() : ''
const rawBase = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : '/'
const normalizedBase = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase
const API_BASE_URL = (configuredApiUrl || (typeof window !== 'undefined' ? `${normalizedBase}/api` : '')).replace(/\/$/, '')

// Persistent in-memory and localStorage cache for routing & distance results: per place/coordinates + travel mode
const routeCache = new Map()
const geocodeCache = new Map()
const STORAGE_ROUTE_PREFIX = 'explorex_route_cache_v2_'
const STORAGE_GEOCODE_PREFIX = 'explorex_geocode_cache_v2_'

// Circuit breaker to avoid spamming network when backend server is unavailable
let backendUnavailableUntil = 0

function formatCoord(coord) {
  if (!coord) return '0,0'
  if (Array.isArray(coord) && coord.length >= 2) {
    const c0 = Number(coord[0])
    const c1 = Number(coord[1])
    return `${isNaN(c0) ? 0 : c0.toFixed(4)},${isNaN(c1) ? 0 : c1.toFixed(4)}`
  }
  return String(coord)
}

export function getRouteCacheKey(start, end, profile = 'driving-car', placeId = null) {
  if (placeId) {
    return `${placeId}:${profile}`
  }
  return `${formatCoord(start)}->${formatCoord(end)}:${profile}`
}

export function getRouteCache(start, end, profile = 'driving-car', placeId = null) {
  const key = getRouteCacheKey(start, end, profile, placeId)
  if (routeCache.has(key)) {
    return routeCache.get(key)
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_ROUTE_PREFIX}${key}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      routeCache.set(key, parsed)
      return parsed
    }
  } catch {}
  return null
}

export function setRouteCache(start, end, profile = 'driving-car', data = null, placeId = null) {
  if (!data) return
  const key = getRouteCacheKey(start, end, profile, placeId)
  routeCache.set(key, data)
  try {
    localStorage.setItem(`${STORAGE_ROUTE_PREFIX}${key}`, JSON.stringify(data))
  } catch {}
  if (placeId) {
    // Also store by coordinates for spatial lookups
    const coordKey = `${formatCoord(start)}->${formatCoord(end)}:${profile}`
    routeCache.set(coordKey, data)
    try {
      localStorage.setItem(`${STORAGE_ROUTE_PREFIX}${coordKey}`, JSON.stringify(data))
    } catch {}
  }
}

export function getGeocodeCache(text) {
  const key = (text || '').toLowerCase().trim()
  if (!key) return null
  if (geocodeCache.has(key)) return geocodeCache.get(key)
  try {
    const raw = localStorage.getItem(`${STORAGE_GEOCODE_PREFIX}${key}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      geocodeCache.set(key, parsed)
      return parsed
    }
  } catch {}
  return null
}

export function setGeocodeCache(text, data) {
  const key = (text || '').toLowerCase().trim()
  if (!key || !data) return
  geocodeCache.set(key, data)
  try {
    localStorage.setItem(`${STORAGE_GEOCODE_PREFIX}${key}`, JSON.stringify(data))
  } catch {}
}

async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('API server not configured; using offline fallback')
  }
  if (Date.now() < backendUnavailableUntil) {
    throw new Error('Backend temporarily marked unavailable; using offline fallback')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 4000)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      if (response.status === 401 || response.status === 429 || response.status >= 500) {
        // Back off for 60 seconds to avoid repeating 401/429
        backendUnavailableUntil = Date.now() + 60000
      }
      const errorBody = await response.json().catch(() => ({}))
      throw new Error(errorBody.error || `API request failed with status ${response.status}`)
    }
    const payload = await response.json()
    return payload.data ?? payload
  } catch (err) {
    clearTimeout(timeoutId)
    // If CORS or network error, back off
    if (err.name === 'AbortError' || err.message?.includes('fetch') || err.message?.includes('NetworkError')) {
      backendUnavailableUntil = Date.now() + 60000
    }
    throw err
  }
}

function withFallback(requestPromise, fallback) {
  return requestPromise.catch(() => (typeof fallback === 'function' ? fallback() : fallback))
}

export function calculateHaversineKm(start, end) {
  if (!Array.isArray(start) || !Array.isArray(end) || start.length < 2 || end.length < 2) return null
  const lng1 = Number(start[0])
  const lat1 = Number(start[1])
  const lng2 = Number(end[0])
  const lat2 = Number(end[1])
  if (isNaN(lng1) || isNaN(lat1) || isNaN(lng2) || isNaN(lat2)) return null

  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function calculateDynamicFallbackRoute(start, end, profile = 'driving-car') {
  const directKm = calculateHaversineKm(start, end)
  if (directKm == null) {
    return {
      error: true,
      message: 'Distance unavailable',
      duration: null,
      distance: null,
      source: 'client-dynamic-fallback',
    }
  }

  const routedKm = Number((Math.max(0.5, directKm * 1.25)).toFixed(1))
  const distanceMeters = Math.round(routedKm * 1000)

  let speedKmH = 35
  if (profile === 'foot-walking' || profile === 'walking') speedKmH = 4.5
  if (profile === 'cycling-regular' || profile === 'cycling') speedKmH = 15

  const totalMins = Math.max(2, Math.round((routedKm / speedKmH) * 60))
  const hours = Math.floor(totalMins / 60)
  const mins = totalMins % 60
  const formatted = hours === 0 ? `${mins} min` : mins === 0 ? `${hours} hr` : `${hours} hr ${mins} min`

  return {
    distance: { km: routedKm, meters: distanceMeters },
    duration: { formatted, minutes: totalMins, seconds: totalMins * 60 },
    distanceMeters,
    durationSeconds: totalMins * 60,
    formattedDuration: formatted,
    coordinates: [start, end],
    profile,
    source: 'client-dynamic-fallback',
  }
}

export function getPlaces() {
  return withFallback(request('/places'), places)
}

export function getPlaceById(id) {
  const fallback = places.find((place) => place.id === String(id)) || places[0]
  return withFallback(request(`/places/${encodeURIComponent(id)}`), fallback)
}

export function getNearbyHotels(latitude, longitude) {
  const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude) })
  return withFallback(request(`/hotels?${params}`), hotels)
}

export function getNearbyRestaurants(latitude, longitude) {
  const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude) })
  return withFallback(request(`/restaurants?${params}`), restaurants)
}

export function askAI(message, history = [], options = {}) {
  const currentPlaceObj = typeof options === 'object' && options !== null ? (options.currentPlace || options.place) : null
  const placeName = typeof options === 'string' ? options : (currentPlaceObj?.name || options?.place || 'Charminar')
  const travelMode = typeof options === 'object' && options !== null ? options.travelMode : 'driving-car'
  const userLocation = typeof options === 'object' && options !== null ? options.userLocation : null

  const payload = {
    message,
    history,
    place: placeName,
    currentPlace: currentPlaceObj,
    travelMode,
    userLocation,
  }

  return withFallback(
    request('/chat', { method: 'POST', body: JSON.stringify(payload) }),
    {
      answer: `**${placeName}** is one of Hyderabad's most celebrated heritage landmarks.

• **Visiting Guidelines**: Open daily, 9:00 AM - 5:30 PM.
• **Exploration**: Marvel at the historic architecture, then explore nearby markets and authentic eateries.
• **Directions**: Easily accessible via central Hyderabad roads.

💡 Practical Tip: Visit during early morning or golden hour (4:30 PM - 5:30 PM) for the best photography light and cooler weather.`,
      recommendedPlaces: currentPlaceObj ? [currentPlaceObj] : [],
      source: 'offline-fallback',
    },
  )
}

export function generateItinerary(preferences) {
  return withFallback(
    request('/ai/itinerary', { method: 'POST', body: JSON.stringify({ preferences }) }),
    {
      days: [
        { day: 1, title: 'Hyderabad Heritage Core', stops: places.slice(0, 3).map((place) => place.name) },
        { day: 2, title: 'Lakes, Palaces & Culture', stops: places.slice(3, 6).map((place) => place.name) },
      ],
    },
  )
}

export async function streamAIChatClient({
  message,
  history = [],
  currentPlace = null,
  travelMode = 'driving-car',
  userLocation = null,
  userId = null,
  image = null,
  signal,
  onToken,
  onDone,
  onError,
}) {
  const url = `${API_BASE_URL || '/api'}/chat/stream`
  const payload = {
    message,
    history,
    currentPlace,
    travelMode,
    userLocation,
    userId,
    image,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    })

    if (!response.ok) {
      throw new Error(`Streaming failed with status ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop() || ''

      for (const part of parts) {
        const trimmed = part.trim()
        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6))
            if (data.type === 'token' && onToken) {
              onToken(data.token)
            } else if (data.type === 'done' && onDone) {
              onDone(data)
            } else if (data.type === 'error' && onError) {
              onError(new Error(data.error || 'Streaming error'))
            }
          } catch {}
        }
      }
    }

    // Flush any trailing event left in buffer
    if (buffer.trim().startsWith('data: ')) {
      try {
        const data = JSON.parse(buffer.trim().slice(6))
        if (data.type === 'token' && onToken) onToken(data.token)
        else if (data.type === 'done' && onDone) onDone(data)
      } catch {}
    }
  } catch (err) {
    if (signal?.aborted) return
    if (onError) onError(err)
    else throw err
  }
}

export async function sendAIFeedback({ messageId, conversationId, feedback, reason, comment }) {
  try {
    await fetch(`${API_BASE_URL || 'http://localhost:5005/api'}/ai/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId, conversationId, feedback, reason, comment }),
    })
  } catch {}
}

export async function fetchRoute(start, end, profile = 'driving-car', placeId = null) {
  // Check in-memory cache first
  const cached = getRouteCache(start, end, profile, placeId)
  if (cached) {
    return cached
  }

  // Validate start and end coordinates
  const validStart = Array.isArray(start) && start.length >= 2 && !isNaN(Number(start[0])) && !isNaN(Number(start[1]))
  const validEnd = Array.isArray(end) && end.length >= 2 && !isNaN(Number(end[0])) && !isNaN(Number(end[1]))

  if (!validStart || !validEnd) {
    const errorResult = {
      error: true,
      message: 'Distance unavailable',
      duration: null,
      distance: null,
      source: 'invalid-coordinates',
    }
    setRouteCache(start, end, profile, errorResult, placeId)
    return errorResult
  }

  let routeResult = null

  if (API_BASE_URL && Date.now() >= backendUnavailableUntil) {
    try {
      const data = await request('/route', {
        method: 'POST',
        body: JSON.stringify({ start, end, profile }),
      })
      if (data && (data.duration || data.durationMeters || data.distance || data.distanceMeters)) {
        routeResult = data
      }
    } catch {
      // Backend request failed (e.g. 401, 429, CORS, network offline); fall through to dynamic fallback
    }
  }

  if (!routeResult) {
    routeResult = calculateDynamicFallbackRoute(start, end, profile)
  }

  setRouteCache(start, end, profile, routeResult, placeId)
  return routeResult
}

export async function geocodeAddress(text) {
  const cached = getGeocodeCache(text)
  if (cached) return cached

  let result = null
  if (API_BASE_URL && Date.now() >= backendUnavailableUntil) {
    try {
      result = await request(`/route/geocode?text=${encodeURIComponent(text)}`)
    } catch {}
  }

  if (!result) {
    result = {
      query: text,
      results: [{ name: `${text}, Hyderabad`, coordinates: [78.4747, 17.3614] }],
      source: 'client-fallback',
    }
  }

  setGeocodeCache(text, result)
  return result
}

export function fetchMatrixRoute(locations, sources = [0], destinations, profile = 'driving-car') {
  return withFallback(
    request('/route/matrix', {
      method: 'POST',
      body: JSON.stringify({ locations, sources, destinations, profile }),
    }),
    {
      durations: [locations.map(() => 600)],
      distances: [locations.map(() => 5000)],
      profile,
      source: 'client-fallback',
    },
  )
}

export { API_BASE_URL }
