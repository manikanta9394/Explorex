/**
 * India Geographic Bounding Box Validation:
 * Latitude:  6.0° N to 37.5° N
 * Longitude: 68.0° E to 97.5° E
 */
export function isInsideIndia(lat, lng) {
  const nLat = Number(lat)
  const nLng = Number(lng)
  if (isNaN(nLat) || isNaN(nLng) || !nLat || !nLng) return false
  return nLat >= 6.0 && nLat <= 37.5 && nLng >= 68.0 && nLng <= 97.5
}

/**
 * Validates an array of places, logging warnings and hiding any place
 * with coordinates falling outside the India national boundary.
 */
export function validateAndFilterIndiaPlaces(places, callerLabel = 'Explorex India Map') {
  if (!Array.isArray(places)) return []
  return places.filter((place) => {
    if (!place) return false
    const lat = place.position ? Number(place.position[0]) : Number(place.location?.coordinates?.[1])
    const lng = place.position ? Number(place.position[1]) : Number(place.location?.coordinates?.[0])
    const valid = isInsideIndia(lat, lng)
    if (!valid) {
      console.warn(
        `[${callerLabel}] Flagging invalid place outside India: "${place.name}" (${place.id}) at coordinates [${lat}, ${lng}]`
      )
      return false
    }
    return true
  })
}

/**
 * Telangana & Hyderabad Geographic Bounding Box Validation:
 * Latitude:  15.80° N to 19.95° N
 * Longitude: 77.20° E to 81.85° E
 * Hyderabad Metropolitan Area: ~17.15° to ~17.65° N, ~78.15° to ~78.75° E
 */
export function isInsideTelangana(lat, lng) {
  const nLat = Number(lat)
  const nLng = Number(lng)
  if (isNaN(nLat) || isNaN(nLng) || !nLat || !nLng) return false
  return nLat >= 15.8 && nLat <= 19.95 && nLng >= 77.2 && nLng <= 81.85
}

/**
 * Validates an array of places, logging warnings and hiding any place
 * with coordinates falling outside the Telangana/Hyderabad boundary.
 */
export function validateAndFilterTelanganaPlaces(places, callerLabel = 'Explorex Map') {
  if (!Array.isArray(places)) return []
  return places.filter((place) => {
    if (!place) return false
    const lat = place.position ? Number(place.position[0]) : Number(place.location?.coordinates?.[1])
    const lng = place.position ? Number(place.position[1]) : Number(place.location?.coordinates?.[0])
    const valid = isInsideTelangana(lat, lng)
    if (!valid) {
      console.warn(
        `[${callerLabel}] Hiding invalid place outside Telangana/Hyderabad: "${place.name}" (${place.id}) at coordinates [${lat}, ${lng}]`
      )
      return false
    }
    return true
  })
}
