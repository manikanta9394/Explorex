import { useState } from 'react'
import { TravelModeContext } from './TravelModeContextObject'

export function TravelModeProvider({ children }) {
  const [travelMode, setTravelMode] = useState('driving-car')

  return (
    <TravelModeContext.Provider value={{ travelMode, setTravelMode }}>
      {children}
    </TravelModeContext.Provider>
  )
}
