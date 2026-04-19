"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import type { User, AuthState } from "@/types"

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing tokens on mount
    const accessToken = localStorage.getItem("access_token")
    const refreshToken = localStorage.getItem("refresh_token")
    const userStr = localStorage.getItem("user")

    if (accessToken && userStr) {
      try {
        const user = JSON.parse(userStr) as User
        setState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        })
      } catch {
        // Invalid user data, clear storage
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          device_name: "web-app",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.message || "Login gagal" }
      }

      const accessToken = data.access_token || data.data?.access_token
      const refreshToken = data.refresh_token || data.data?.refresh_token
      const user = data.user || data.data?.user

      localStorage.setItem("access_token", accessToken)
      localStorage.setItem("refresh_token", refreshToken)
      localStorage.setItem("user", JSON.stringify(user))

      setState({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      })

      return { success: true }
    } catch (error) {
      return { success: false, message: "Koneksi gagal. Silakan coba lagi." }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
