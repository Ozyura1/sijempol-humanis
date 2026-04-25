"use client"

import { useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<any>(null)

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false)
      return
    }

    // Check if user is logged in as admin
    const adminToken = localStorage.getItem("admin_access_token")
    const adminUserData = localStorage.getItem("admin_user")

    if (!adminToken) {
      // Redirect to admin login if not authenticated
      router.push("/admin/login")
      return
    }

    if (adminUserData) {
      try {
        const user = JSON.parse(adminUserData)
        if (user.role === "admin") {
          setAdminUser(user)
          setIsAuthorized(true)
        } else {
          // User is not admin, redirect
          localStorage.removeItem("admin_access_token")
          localStorage.removeItem("admin_refresh_token")
          localStorage.removeItem("admin_user")
          router.push("/admin/login")
        }
      } catch {
        router.push("/admin/login")
      }
    }

    setLoading(false)
  }, [router, pathname, isLoginPage])

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

  const handleLogout = () => {
    localStorage.removeItem("admin_access_token")
    localStorage.removeItem("admin_refresh_token")
    localStorage.removeItem("admin_user")
    router.push("/admin/login")
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
