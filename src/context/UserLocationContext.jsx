import { useCallback, useState } from 'react'
import { UserLocationContext } from './UserLocationContextObject'

// Default fallback origin: Charminar, Hyderabad [lng, lat]
const DEFAULT_HYD_ORIGIN = [78.4747, 17.3616]

export function UserLocationProvider({ children }) {
  const [userCoords, setUserCoords] = useState(null) // [lng, lat]
  const [locationStatus, setLocationStatus] = useState('idle') // 'idle' | 'prompt' | 'granted' | 'denied' | 'unsupported'

  // Request geolocation ONLY on an explicit user click, never on page load
  const requestLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        setLocationStatus('unsupported')
        reject(new Error('Geolocation is not supported by your browser'))
        return
      }

      setLocationStatus('prompt')
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.longitude, pos.coords.latitude]
          setUserCoords(coords)
          setLocationStatus('granted')
          resolve(coords)
        },
        (err) => {
          console.warn('Geolocation user prompt denied or failed:', err.message)
          setLocationStatus('denied')
          reject(err)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      )
    })
  }, [])

  // Active origin uses live GPS userCoords if granted by user, otherwise defaults to Charminar
  const activeOrigin = userCoords || DEFAULT_HYD_ORIGIN

  return (
    <UserLocationContext.Provider
      value={{
        userCoords,
        activeOrigin,
        locationStatus,
        requestLocation,
        setUserCoords,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  )
}
