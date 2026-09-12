import { useContext } from 'react'
import { TravelModeContext } from './TravelModeContextObject'

export function useTravelMode() {
  return useContext(TravelModeContext)
}
