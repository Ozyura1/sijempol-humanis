"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function UserLoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login, isAuthenticated, user } = useAuth()

  useEffect(() => {
    // If already authenticated and is user, redirect to dashboard
    if (isAuthenticated && user?.role === "user") {
      onSuccess?.()
      router.push("/dashboard")
    }
  }, [isAuthenticated, user, router, onSuccess])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("Username dan password wajib diisi")
      return
    }

    setLoading(true)
    const result = await login(username, password)
    setLoading(false)

    if (!result.success) {
      setError(result.message || "Login gagal")
      return
    }

    // Login will update context, redirect handled by useEffect
    router.push("/dashboard")
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Masuk SiJempol</CardTitle>
        <CardDescription>Masuk untuk mengajukan layanan administrasi</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Username Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

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

          <div className="text-center text-sm">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              Daftar di sini
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
