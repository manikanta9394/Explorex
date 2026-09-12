import { useContext } from 'react'
import { SavedPlacesContext } from './SavedPlacesContextObject'

export function useSavedPlaces() {
  return useContext(SavedPlacesContext)
}
