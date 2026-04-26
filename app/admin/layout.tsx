"use client"

import { useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useAuth } from "@/contexts/auth-context"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, user, isLoading: authLoading } = useAuth()

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false)
      return
    }

    // Wait until AuthProvider finishes hydrating from localStorage.
    if (authLoading) {
      setLoading(true)
      return
    }

    // Check if user is logged in as admin (single source of truth: AuthContext).
    if (!isAuthenticated || user?.role !== "admin") {
      setIsAuthorized(false)
      setLoading(false)
      router.push("/admin/login")
      return
    }

    setIsAuthorized(true)
    setLoading(false)
  }, [router, isLoginPage, authLoading, isAuthenticated, user?.role])

  // For login page, no layout
  if (isLoginPage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
          <p>Memverifikasi akses admin...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Admin Dashboard"
          description="Kelola pengajuan layanan dari masyarakat"
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
