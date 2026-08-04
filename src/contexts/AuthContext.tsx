'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type CurrentUser = {
  id: string
  name: string
  email: string
  isSuperAdmin: boolean
  permissions: string[]
} | null

type AuthContextType = {
  user: CurrentUser
  loading: boolean
  hasPermission: (key: string) => boolean
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser>(null)
  const [loading, setLoading] = useState(true)

  async function refreshUser() {
    try {
      const res = await fetch('/api/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
  await fetch('/api/logout', { method: 'POST' })
  setUser(null)
}

  function hasPermission(key: string) {
    if (!user) return false
    if (user.isSuperAdmin) return true
    return user.permissions.includes(key)
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, hasPermission, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}