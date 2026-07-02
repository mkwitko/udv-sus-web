import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useFindMe } from '@/http/generated/user/user'
import {
  signIn,
  signOut,
} from '@/http/generated/authentication/authentication'
import type { FindMe201 } from '@/http/generated/api.schemas'

interface AuthContextValue {
  user: FindMe201 | undefined
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (perm: string | string[]) => boolean
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient()
  const { data: user, isLoading, isFetched, error } = useFindMe({
    query: { retry: false },
  })

  const login = React.useCallback(
    async (email: string, password: string) => {
      await signIn({ email, password })
      await qc.invalidateQueries()
    },
    [qc],
  )

  const logout = React.useCallback(async () => {
    try {
      await signOut()
    } finally {
      qc.clear()
    }
  }, [qc])

  const hasPermission = React.useCallback(
    (perm: string | string[]) => {
      if (!user) return false
      const perms = Array.isArray(perm) ? perm : [perm]
      return user.permissoes.some(
        (p) => perms.includes(p.name) || p.name === 'ADMINISTRADOR',
      )
    },
    [user],
  )

  const value: AuthContextValue = {
    user,
    isLoading: isLoading && !isFetched,
    isAuthenticated: !!user && !error,
    login,
    logout,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
