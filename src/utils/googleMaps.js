/**
 * Helper to extract latitude and longitude from place object regardless of schema structure
 */
export function getPlaceLatLng(place) {
  if (!place) return null
  if (Array.isArray(place.position) && place.position.length >= 2) {
    return { lat: place.position[0], lng: place.position[1] }
  }
  if (place.location && Array.isArray(place.location.coordinates) && place.location.coordinates.length >= 2) {
    return { lat: place.location.coordinates[1], lng: place.location.coordinates[0] }
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
 * travel mode, and origin (if geolocation permission is granted).
 */
export function openGoogleMapsDirections(place, travelMode, cachedCoords = null) {
  const coords = getPlaceLatLng(place)
  if (!coords) return

  const googleMode = mapTravelModeToGoogle(travelMode)
  const destStr = `${coords.lat},${coords.lng}`

  const buildUrl = (originCoords = null) => {
    let url = `https://www.google.com/maps/dir/?api=1&destination=${destStr}&travelmode=${googleMode}`
    if (originCoords && originCoords.lat != null && originCoords.lng != null) {
      url += `&origin=${originCoords.lat},${originCoords.lng}`
    }
    return url
  }

  // If cached coordinates are passed in
  if (cachedCoords && cachedCoords.lat != null && cachedCoords.lng != null) {
    const directUrl = buildUrl(cachedCoords)
    window.open(directUrl, '_blank', 'noopener,noreferrer')
    return
  }

  // Open blank window immediately inside the click handler to avoid popup blockers
  const newTab = window.open('about:blank', '_blank')

  if (!('geolocation' in navigator)) {
    if (newTab) newTab.location.href = buildUrl(null)
    return
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const origin = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      const url = buildUrl(origin)
      if (newTab) {
        newTab.location.href = url
      }
    },
    (_err) => {
      // Permission denied or error: omit origin parameter so Google Maps prompts user
      const url = buildUrl(null)
      if (newTab) {
        newTab.location.href = url
      }
    },
    { timeout: 3500, enableHighAccuracy: true }
  )
}
