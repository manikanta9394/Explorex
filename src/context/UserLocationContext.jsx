import { useEffect, useState } from 'react'
import { UserLocationContext } from './UserLocationContextObject'

// Default fallback origin: Charminar, Hyderabad [lng, lat]
const DEFAULT_HYD_ORIGIN = [78.4747, 17.3616]

export function UserLocationProvider({ children }) {
  const [userCoords, setUserCoords] = useState(null) // [lng, lat]
  const [locationStatus, setLocationStatus] = useState(() => ('geolocation' in navigator ? 'prompt' : 'denied'))

  useEffect(() => {
    if (!('geolocation' in navigator)) return

    let watchId = null

    // Request immediate high-accuracy position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.longitude, pos.coords.latitude]
        setUserCoords(coords)
        setLocationStatus('granted')
      },
      (err) => {
        console.warn('Geolocation initial prompt/error:', err.message)
        setLocationStatus('denied')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    )

    // Watch position for continuous live updates if available
    try {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = [pos.coords.longitude, pos.coords.latitude]
          setUserCoords(coords)
          setLocationStatus('granted')
        },
        (_err) => {
          // Ignore watch errors if initial position succeeded
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
      )
    } catch {
      // ignore watchPosition failure
    }

    return () => {
      if (watchId !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [])

  // Active origin uses live GPS userCoords if available, otherwise defaults to Charminar
  const activeOrigin = userCoords || DEFAULT_HYD_ORIGIN

  return (
    <UserLocationContext.Provider value={{ userCoords, activeOrigin, locationStatus, setUserCoords }}>
      {children}
    </UserLocationContext.Provider>
  )
}
