// medium-frontend/components/providers/AuthProvider.tsx
"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type AuthUser = {
  id: string
  name: string
  email: string
  bio?: string
}

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  signIn: (payload: { email: string; password: string }) => Promise<void>
  signUp: (payload: { name: string; email: string; password: string }) => Promise<void>
  signOut: () => void
  updateProfile: (payload: { name?: string; bio?: string }) => Promise<void>
}

const STORAGE_KEY = "medium-auth-user"

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function persistUser(user: AuthUser | null) {
  if (typeof window === "undefined") return
  if (!user) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())

  useEffect(() => {
    if (typeof window === "undefined") return
    const handleStorage = () => {
      setUser(readStoredUser())
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const signIn = useCallback(async ({ email }: { email: string; password: string }) => {
    const existing = readStoredUser()
    if (existing && existing.email === email) {
      setUser(existing)
      return
    }
    // For now, signing in without registration just creates a placeholder account.
    const mockUser: AuthUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name: email.split("@")[0] ?? "Author",
      email,
    }
    persistUser(mockUser)
    setUser(mockUser)
  }, [])

  const signUp = useCallback(
    async ({ name, email }: { name: string; email: string; password: string }) => {
      const newUser: AuthUser = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        name: name.trim() || email.split("@")[0] || "Author",
        email,
      }
      persistUser(newUser)
      setUser(newUser)
    },
    [],
  )

  const signOut = useCallback(() => {
    persistUser(null)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async ({ name, bio }: { name?: string; bio?: string }) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated: AuthUser = { ...prev, name: name ?? prev.name, bio: bio ?? prev.bio }
      persistUser(updated)
      return updated
    })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading: false,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }),
    [user, signIn, signUp, signOut, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}

