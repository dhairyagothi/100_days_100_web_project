"use client"

import * as React from "react"

interface AuthContextType {
  user: string | null
  login: (username: string) => void
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<string | null>(null)

  React.useEffect(() => {
    const savedUser = localStorage.getItem("app_user")
    if (savedUser) setUser(savedUser)
  }, [])

  const login = (username: string) => {
    localStorage.setItem("app_user", username)
    setUser(username)
  }

  const logout = () => {
    localStorage.removeItem("app_user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
