/**
 * Helper to extract latitude and longitude from place object regardless of schema structure
 */
export function getPlaceLatLng(place) {
  if (!place) return null
  if (Array.isArray(place.position) && place.position.length >= 2) {
    const lat = Number(place.position[0])
    const lng = Number(place.position[1])
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng }
    }
  }
  if (place.location && Array.isArray(place.location.coordinates) && place.location.coordinates.length >= 2) {
    const lng = Number(place.location.coordinates[0])
    const lat = Number(place.location.coordinates[1])
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng }
    }
  }
  return null
}

/**
 * Maps app travel mode values to Google Maps expected travelmode query parameters
 * driving-car -> driving
 * foot-walking -> walking
 * cycling-regular -> bicycling
 */
export function mapTravelModeToGoogle(travelMode) {
  switch (travelMode) {
    case 'foot-walking':
      return 'walking'
    case 'cycling-regular':
      return 'bicycling'
    case 'driving-car':
    default:
      return 'driving'
  }
}

/**
 * Opens Google Maps directions in a new browser tab with pre-filled destination,
 * travel mode, and origin (if available).
 */
export function openGoogleMapsDirections(place, travelMode, cachedCoords = null) {
  const coords = getPlaceLatLng(place)
  if (!coords) return

  const googleMode = mapTravelModeToGoogle(travelMode)
  const destStr = `${coords.lat},${coords.lng}`

  let url = `https://www.google.com/maps/dir/?api=1&destination=${destStr}&travelmode=${googleMode}`
  if (cachedCoords && cachedCoords.lat != null && cachedCoords.lng != null) {
    url += `&origin=${cachedCoords.lat},${cachedCoords.lng}`
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Opens Google Maps directions for a multi-stop route with origin, waypoints, and destination.
 */
export function openGoogleMapsMultiStop(stops, travelMode = 'driving-car') {
  if (!Array.isArray(stops) || stops.length === 0) return

  const validCoords = stops
    .map((s) => getPlaceLatLng(s))
    .filter((c) => c && !isNaN(c.lat) && !isNaN(c.lng))

  if (validCoords.length === 0) return

  const googleMode = mapTravelModeToGoogle(travelMode)

  if (validCoords.length === 1) {
    const dest = `${validCoords[0].lat},${validCoords[0].lng}`
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=${googleMode}`,
      '_blank',
      'noopener,noreferrer'
    )
    return
  }

  const origin = `${validCoords[0].lat},${validCoords[0].lng}`
  const dest = `${validCoords[validCoords.length - 1].lat},${validCoords[validCoords.length - 1].lng}`

  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=${googleMode}`

  if (validCoords.length > 2) {
    const waypoints = validCoords
      .slice(1, -1)
      .map((c) => `${c.lat},${c.lng}`)
      .join('|')
    url += `&waypoints=${encodeURIComponent(waypoints)}`
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

