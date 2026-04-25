"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Menu, Shield } from "lucide-react"

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user?.role === "admin") {
        // Admins should not access user dashboard
        router.push("/admin/dashboard")
      }
    }
  }, [mounted, isLoading, isAuthenticated, user?.role, router])

  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "user") {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="lg:hidden border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex items-center justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input text-foreground transition hover:bg-muted"
                  aria-label="Buka menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </DialogTrigger>
              <DialogContent className="fixed inset-y-0 left-0 z-50 w-full max-w-xs rounded-none border-r border-border bg-background p-0 shadow-2xl translate-x-0 translate-y-0 sm:rounded-r-3xl">
                <Sidebar />
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Shield className="h-5 w-5 text-primary" />
              Dashboard
            </div>
            <div className="h-10 w-10" />
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  )
}
