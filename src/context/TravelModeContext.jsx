import { useState } from 'react'
import { TravelModeContext } from './TravelModeContextObject'

export function TravelModeProvider({ children }) {
  const [travelMode, setTravelModeState] = useState(() => {
    try {
      return localStorage.getItem('explorex_travel_mode') || 'driving-car'
    } catch {
      return 'driving-car'
    }
  })

  const setTravelMode = (mode) => {
    setTravelModeState(mode)
    try {
      localStorage.setItem('explorex_travel_mode', mode)
    } catch {}
  }

  return (
    <TravelModeContext.Provider value={{ travelMode, setTravelMode }}>
      {children}
    </TravelModeContext.Provider>
  )
}
