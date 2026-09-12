import { createContext } from 'react'

export const TravelModeContext = createContext({
  travelMode: 'driving-car',
  setTravelMode: () => {},
})
