import { createContext } from 'react'

export const AuthContext = createContext({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
})
