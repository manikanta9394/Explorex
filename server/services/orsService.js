import { env } from '../config/env.js'

// Simple in-memory cache for routing requests (15-minute TTL)
const routeCache = new Map()
const CACHE_TTL_MS = 15 * 60 * 1000

export function formatDuration(seconds) {
  const totalSecs = Math.round(Number(seconds) || 0)
  if (totalSecs <= 0) return '0 min'

  const totalMins = Math.round(totalSecs / 60)
  if (totalMins < 1) return 'Less than 1 min'

  const hours = Math.floor(totalMins / 60)
  const mins = totalMins % 60

  if (hours === 0) return `${mins} min`
  if (mins === 0) return `${hours} hr`
  return `${hours} hr ${mins} min`
}

export function normalizeProfile(profile) {
  if (!profile || typeof profile !== 'string') return 'driving-car'
  const p = profile.toLowerCase().trim()
  if (p === 'driving' || p === 'car' || p === 'driving-car') return 'driving-car'
  if (p === 'walking' || p === 'foot' || p === 'foot-walking' || p === 'pedestrian') return 'foot-walking'
  if (p === 'cycling' || p === 'bike' || p === 'bicycle' || p === 'cycling-regular') return 'cycling-regular'
  return 'driving-car'
}

export function parseAndValidateCoords(coords, label = 'Coordinate') {
  if (coords === undefined || coords === null || coords === '') {
    throw {
      statusCode: 400,
      message: `Missing ${label} parameter. Expected format: { lat, lng }, [lng, lat], or "lat,lng"`,
    }
  }

  let lat, lng

  if (typeof coords === 'object' && !Array.isArray(coords)) {
    const rawLat = coords.lat ?? coords.latitude ?? coords.y
    const rawLng = coords.lng ?? coords.longitude ?? coords.x
    if (rawLat !== undefined && rawLng !== undefined) {
      lat = Number(rawLat)
      lng = Number(rawLng)
    }
  } else if (Array.isArray(coords) && coords.length >= 2) {
    const n1 = Number(coords[0])
    const n2 = Number(coords[1])
    if (!isNaN(n1) && !isNaN(n2)) {
      if (Math.abs(n1) > 90) {
        lng = n1
        lat = n2
      } else if (Math.abs(n2) > 90) {
        lat = n1
        lng = n2
      } else {
        if (n1 > 35 && n2 < 35) {
          lng = n1
          lat = n2
        } else {
          lng = n1
          lat = n2
        }
      }
    }
  } else if (typeof coords === 'string') {
    const parts = coords.split(',').map((p) => Number(p.trim()))
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const p1 = parts[0]
      const p2 = parts[1]
      if (Math.abs(p1) > 90) {
        lng = p1
        lat = p2
      } else if (Math.abs(p2) > 90) {
        lat = p1
        lng = p2
      } else {
        lat = p1
        lng = p2
      }
    }
  }

  if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
    throw {
      statusCode: 400,
      message: `Invalid ${label} format. Could not parse latitude and longitude values.`,
    }
  }

  if (lat < -90 || lat > 90) {
    throw {
      statusCode: 400,
      message: `Invalid ${label} latitude (${lat}). Must be between -90 and 90 degrees.`,
    }
  }
  if (lng < -180 || lng > 180) {
    throw {
      statusCode: 400,
      message: `Invalid ${label} longitude (${lng}). Must be between -180 and 180 degrees.`,
    }
  }

  return [lng, lat]
}

function parseCoords(coords) {
  try {
    return parseAndValidateCoords(coords, 'Location')
  } catch {
    return null
  }
}

function calculateHaversineDistanceKm(startLng, startLat, endLng, endLat) {
  const R = 6371 // Earth radius in km
  const dLat = ((endLat - startLat) * Math.PI) / 180
  const dLng = ((endLng - startLng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((startLat * Math.PI) / 180) *
      Math.cos((endLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function generateFallbackRoute(startCoords, endCoords, profile) {
  const directDistanceKm = calculateHaversineDistanceKm(
    startCoords[0],
    startCoords[1],
    endCoords[0],
    endCoords[1]
  )
  const routedDistanceKm = Number((directDistanceKm * 1.25).toFixed(2))
  const distanceMeters = Math.round(routedDistanceKm * 1000)
  const distanceMi = Number((routedDistanceKm * 0.621371).toFixed(2))

  let speedKmH = 35 // driving-car
  if (profile === 'foot-walking') speedKmH = 4.5
  if (profile === 'cycling-regular') speedKmH = 15

  const durationHours = routedDistanceKm / speedKmH
  const durationSeconds = Math.round(durationHours * 3600)
  const durationMinutes = Math.round(durationHours * 60)

  const modeName =
    profile === 'foot-walking'
      ? 'walking path'
      : profile === 'cycling-regular'
        ? 'cycle path'
        : 'road'

  return {
    geometry: {
      type: 'LineString',
      coordinates: [startCoords, endCoords],
    },
    distance: {
      km: routedDistanceKm,
      mi: distanceMi,
      meters: distanceMeters,
    },
    duration: {
      seconds: durationSeconds,
      minutes: durationMinutes,
      formatted: formatDuration(durationSeconds),
    },
    instructions: [
      {
        instruction: `Head towards destination via ${modeName}`,
        distance: distanceMeters,
        duration: durationSeconds,
        name: 'Estimated Route',
        type: 0,
      },
    ],
    coordinates: [startCoords, endCoords],
    profile,
    cached: false,
    source: 'fallback-calculator',
  }
}

export async function fetchRouteDirections({ start, end, profile = 'driving-car' }) {
  const startCoords = parseAndValidateCoords(start, 'Start coordinate')
  const endCoords = parseAndValidateCoords(end, 'End coordinate')
  const validProfile = normalizeProfile(profile)

  const cacheKey = `${validProfile}:${startCoords[0].toFixed(5)},${startCoords[1].toFixed(5)}:${endCoords[0].toFixed(5)},${endCoords[1].toFixed(5)}`
  const cachedEntry = routeCache.get(cacheKey)

  if (cachedEntry && Date.now() < cachedEntry.expiresAt) {
    return { ...cachedEntry.data, cached: true }
  }

  if (!env.orsApiKey || env.orsApiKey === 'your_openrouteservice_api_key_here') {
    const fallback = generateFallbackRoute(startCoords, endCoords, validProfile)
    routeCache.set(cacheKey, { data: fallback, expiresAt: Date.now() + CACHE_TTL_MS })
    return fallback
  }

  try {
    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/${validProfile}/geojson`,
      {
        method: 'POST',
        headers: {
          Authorization: env.orsApiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json, application/geo+json',
        },
        body: JSON.stringify({
          coordinates: [startCoords, endCoords],
          elevation: false,
          instructions: true,
        }),
      }
    )

    if (!response.ok) {
      let orsErrorMsg = ''
      try {
        const errJson = await response.json()
        orsErrorMsg = errJson?.error?.message || errJson?.error || ''
      } catch {
        // ignore json parse error
      }

      console.warn(`ORS API HTTP ${response.status}: ${orsErrorMsg || 'Falling back to local route calculator'}`)
      const fallback = generateFallbackRoute(startCoords, endCoords, validProfile)
      routeCache.set(cacheKey, { data: fallback, expiresAt: Date.now() + CACHE_TTL_MS })
      return fallback
    }

    const data = await response.json()
    const feature = data.features?.[0]

    if (!feature) {
      const fallback = generateFallbackRoute(startCoords, endCoords, validProfile)
      routeCache.set(cacheKey, { data: fallback, expiresAt: Date.now() + CACHE_TTL_MS })
      return fallback
    }

    const summary = feature.properties?.summary || {}
    const geometry = feature.geometry || {
      type: 'LineString',
      coordinates: [startCoords, endCoords],
    }

    const distanceMeters = Math.round(summary.distance || 0)
    const distanceKm = Number((distanceMeters / 1000).toFixed(2))
    const distanceMi = Number((distanceKm * 0.621371).toFixed(2))

    const durationSeconds = Math.round(summary.duration || 0)
    const durationMinutes = Math.round(durationSeconds / 60)
    const durationFormatted = formatDuration(durationSeconds)

    const rawSteps = feature.properties?.segments?.[0]?.steps || []
    const instructions = rawSteps.map((step) => ({
      instruction: step.instruction || `Proceed on ${step.name || 'route'}`,
      distance: Math.round(step.distance || 0),
      duration: Math.round(step.duration || 0),
      name: step.name || '',
      type: step.type ?? 0,
    }))

    if (instructions.length === 0) {
      instructions.push({
        instruction: 'Follow route to destination',
        distance: distanceMeters,
        duration: durationSeconds,
        name: 'Direct Route',
        type: 0,
      })
    }

    const result = {
      geometry,
      distance: {
        km: distanceKm,
        mi: distanceMi,
        meters: distanceMeters,
      },
      duration: {
        seconds: durationSeconds,
        minutes: durationMinutes,
        formatted: durationFormatted,
      },
      instructions,
      coordinates: geometry.coordinates,
      profile: validProfile,
      cached: false,
      source: 'openrouteservice',
    }

    routeCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS })
  } catch (error) {
    console.warn(`[Route Warning] ORS fetch failed (${error.message || error}). Using fallback route calculator.`)
    const fallback = generateFallbackRoute(startCoords, endCoords, validProfile)
    routeCache.set(cacheKey, { data: fallback, expiresAt: Date.now() + CACHE_TTL_MS })
    return fallback
  }
}

export async function geocodeSearch({ text, limit = 5 }) {
  if (!text || typeof text !== 'string') {
    throw new Error('Query text is required for geocoding')
  }

  const query = text.trim()
  const cacheKey = `geocode:${query.toLowerCase()}:${limit}`
  const cachedEntry = routeCache.get(cacheKey)

  if (cachedEntry && Date.now() < cachedEntry.expiresAt) {
    return { ...cachedEntry.data, cached: true }
  }

  if (env.orsApiKey && env.orsApiKey !== 'your_openrouteservice_api_key_here') {
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${encodeURIComponent(env.orsApiKey)}&text=${encodeURIComponent(query)}&size=${limit}`,
        { headers: { Accept: 'application/json' } }
      )
      if (response.ok) {
        const json = await response.json()
        const features = (json.features || []).map((feat) => ({
          name: feat.properties?.label || feat.properties?.name || query,
          coordinates: feat.geometry?.coordinates || [78.4747, 17.3616],
          confidence: feat.properties?.confidence || 1,
          category: feat.properties?.category || 'place',
        }))
        const result = { query, results: features, source: 'openrouteservice' }
        routeCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS })
        return result
      }
    } catch (err) {
      console.warn('ORS Geocode failed, falling back:', err.message)
    }
  }

  const fallbackResults = [
    {
      name: `${query}, Hyderabad, Telangana`,
      coordinates: [78.4747 + (Math.random() - 0.5) * 0.05, 17.3616 + (Math.random() - 0.5) * 0.05],
      confidence: 0.9,
      category: 'landmark',
    },
  ]
  const result = { query, results: fallbackResults, source: 'fallback-geocoder' }
  routeCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS })
  return result
}

export async function fetchMatrix({ locations, sources, destinations, profile = 'driving-car' }) {
  if (!Array.isArray(locations) || locations.length < 2) {
    throw new Error('Matrix calculation requires at least 2 location coordinates')
  }

  const validProfile = normalizeProfile(profile)

  const parsedLocations = locations.map(parseCoords).filter(Boolean)
  const cacheKey = `matrix:${validProfile}:${JSON.stringify(parsedLocations)}:${JSON.stringify(sources)}:${JSON.stringify(destinations)}`
  const cachedEntry = routeCache.get(cacheKey)

  if (cachedEntry && Date.now() < cachedEntry.expiresAt) {
    return { ...cachedEntry.data, cached: true }
  }

  if (env.orsApiKey && env.orsApiKey !== 'your_openrouteservice_api_key_here') {
    try {
      const payload = {
        locations: parsedLocations,
        metrics: ['distance', 'duration'],
      }
      if (sources) payload.sources = sources
      if (destinations) payload.destinations = destinations

      const response = await fetch(`https://api.openrouteservice.org/v2/matrix/${validProfile}`, {
        method: 'POST',
        headers: {
          Authorization: env.orsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const json = await response.json()
        const result = {
          durations: json.durations || [],
          distances: json.distances || [],
          profile: validProfile,
          source: 'openrouteservice',
        }
        routeCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS })
        return result
      }
    } catch (err) {
      console.warn('ORS Matrix failed, using fallback matrix:', err.message)
    }
  }

  const sourceIndices = sources || [0]
  const destIndices = destinations || Array.from({ length: parsedLocations.length }, (_, i) => i)

  let speedKmH = 35
  if (validProfile === 'foot-walking') speedKmH = 4.5
  if (validProfile === 'cycling-regular') speedKmH = 15

  const durations = sourceIndices.map((sIdx) =>
    destIndices.map((dIdx) => {
      const p1 = parsedLocations[sIdx]
      const p2 = parsedLocations[dIdx]
      if (!p1 || !p2 || sIdx === dIdx) return 0
      const distKm = calculateHaversineDistanceKm(p1[0], p1[1], p2[0], p2[1]) * 1.25
      return Math.round((distKm / speedKmH) * 3600)
    })
  )

  const distances = sourceIndices.map((sIdx) =>
    destIndices.map((dIdx) => {
      const p1 = parsedLocations[sIdx]
      const p2 = parsedLocations[dIdx]
      if (!p1 || !p2 || sIdx === dIdx) return 0
      const distKm = calculateHaversineDistanceKm(p1[0], p1[1], p2[0], p2[1]) * 1.25
      return Math.round(distKm * 1000)
    })
  )

  const result = {
    durations,
    distances,
    profile: validProfile,
    source: 'fallback-matrix',
  }
  routeCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS })
  return result
}
