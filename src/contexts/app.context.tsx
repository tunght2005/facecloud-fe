import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { UserProfile } from '~/types'

type AppContextType = {
  isAuthenticated: boolean
  user: UserProfile | null
  roles: string[]
  setAuth: (user: UserProfile, roles: string[], token: string) => void
  clearAuth: () => void
}

const initialState: AppContextType = {
  isAuthenticated: Boolean(localStorage.getItem('access_token')),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  roles: JSON.parse(localStorage.getItem('roles') || '[]'),
  setAuth: () => {},
  clearAuth: () => {}
}

const AppContext = createContext<AppContextType>(initialState)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated)
  const [user, setUser] = useState<UserProfile | null>(initialState.user)
  const [roles, setRoles] = useState<string[]>(initialState.roles)

  const setAuth = useCallback((user: UserProfile, roles: string[], token: string) => {
    setIsAuthenticated(true)
    setUser(user)
    setRoles(roles)
    localStorage.setItem('access_token', token)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('roles', JSON.stringify(roles))
  }, [])

  const clearAuth = useCallback(() => {
    setIsAuthenticated(false)
    setUser(null)
    setRoles([])
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.removeItem('roles')
  }, [])

  return (
    <AppContext.Provider value={{ isAuthenticated, user, roles, setAuth, clearAuth }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
