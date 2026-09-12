import { hotels, places, restaurants } from '../data/tourismData.js'

const configuredApiUrl = import.meta.env?.VITE_API_URL?.trim()
const API_BASE_URL = (configuredApiUrl || (import.meta.env?.DEV ? 'http://localhost:5000/api' : '')).replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || `API request failed with status ${response.status}`)
  }
  const payload = await response.json()
  return payload.data ?? payload
}

function withFallback(requestPromise, fallback) {
  return requestPromise.catch(() => (typeof fallback === 'function' ? fallback() : fallback))
}

function calculateHaversineKm(start, end) {
  if (!Array.isArray(start) || !Array.isArray(end)) return 10
  const [lng1, lat1] = start.map(Number)
  const [lng2, lat2] = end.map(Number)
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

function calculateDynamicFallbackRoute(start, end, profile = 'driving-car') {
  const directKm = calculateHaversineKm(start, end)
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

export function askAI(message, history = [], place = 'Charminar') {
  return withFallback(
    request('/ai/ask', { method: 'POST', body: JSON.stringify({ message, history, place }) }),
    { answer: 'I can help you plan Telangana. Start with Charminar at golden hour, then explore Laad Bazaar for local food, crafts, and history.' },
  )
}

export function generateItinerary(preferences) {
  return withFallback(
    request('/ai/itinerary', { method: 'POST', body: JSON.stringify({ preferences }) }),
    {
      days: [
        { day: 1, title: 'Hyderabad heritage', stops: places.slice(0, 3).map((place) => place.name) },
        { day: 2, title: 'Telangana beyond the city', stops: places.slice(3, 6).map((place) => place.name) },
      ],
    },
  )
}

export function fetchRoute(start, end, profile = 'driving-car') {
  return withFallback(
    request('/route', {
      method: 'POST',
      body: JSON.stringify({ start, end, profile }),
    }),
    () => calculateDynamicFallbackRoute(start, end, profile),
  )
}

export function geocodeAddress(text) {
  return withFallback(
    request(`/route/geocode?text=${encodeURIComponent(text)}`),
    {
      query: text,
      results: [{ name: `${text}, Hyderabad`, coordinates: [78.4747, 17.3616] }],
      source: 'client-fallback',
    },
  )
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
