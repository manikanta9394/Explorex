import { useContext } from 'react'
import { UserLocationContext } from './UserLocationContextObject'

const DEFAULT_HYD_ORIGIN = [78.4747, 17.3616]

export function useUserLocation() {
  const context = useContext(UserLocationContext)
  if (!context) {
    return { userCoords: null, activeOrigin: DEFAULT_HYD_ORIGIN, locationStatus: 'denied' }
  }
  return context
}
