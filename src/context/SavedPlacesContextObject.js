import { createContext } from 'react'

export const SavedPlacesContext = createContext({
  savedIds: [],
  isSaved: () => false,
  toggleSave: () => {},
})
