"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { PasswordInput } from "@/components/auth/password-input"
import { useAuth } from "@/contexts/auth-context"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { isAuthenticated, user, login } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("Username dan password wajib diisi")
      return
    }

    setLoading(true)

    try {
      const result = await login(username, password)

      if (!result.success) {
        setError(result.message || "Login gagal")
        return
      }

      const userStr = localStorage.getItem("user")
      if (userStr) {
        const userData = JSON.parse(userStr)
        if (userData.role !== "admin") {
          setError("Akun ini tidak memiliki akses admin")
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          localStorage.removeItem("user")
          return
        }
      }

      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 100)
    } catch {
      setError("Koneksi gagal. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin SiJempol</CardTitle>
          <CardDescription>Masuk ke dashboard administrasi</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Username admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <PasswordInput
              id="password"
              name="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button type="submit" className="w-full" disabled={loading} size="lg">
              {loading ? (
                <>
                  <Spinner className="mr-2" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </Button>

            <div className="pt-4 border-t text-center">
              <div className="text-sm text-muted-foreground mb-3">
                <p>
                  Bukan admin?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline font-medium">
                    Login sebagai user
                  </Link>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t text-center text-xs text-muted-foreground bg-blue-50 p-3 rounded">
              <p className="font-semibold mb-2">Default Admin Credentials:</p>
              <p>Username: admin</p>
              <p>Password: admin123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
