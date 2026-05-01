"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { PasswordInput } from "@/components/auth/password-input"
import { Clock } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.179:8000/api"

async function readApiMessage(response: Response) {
  try {
    const data = await response.json()
    return typeof data?.message === "string" ? data.message : null
  } catch {
    return null
  }
}

type RegistrationStage = "request-otp" | "verify-otp"

export default function RegisterPage() {
  const [stage, setStage] = useState<RegistrationStage>("request-otp")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    otp_code: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpExpiration, setOtpExpiration] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const router = useRouter()

  // Timer for OTP expiration
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.username || !formData.email || !formData.name) {
      setError("Nama, email, dan username wajib diisi")
      return
    }

    if (formData.username.length < 3) {
      setError("Username minimal 3 karakter")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/otp/request-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          name: formData.name,
        }),
      })

      const message = await readApiMessage(response)

      if (!response.ok) {
        setError(message || "Gagal mengirim kode OTP")
        return
      }

      // Set OTP expiration timer (10 minutes)
      const expirationTime = Date.now() + 10 * 60 * 1000
      setOtpExpiration(expirationTime)
      setStage("verify-otp")
      setFormData((prev) => ({ ...prev, otp_code: "", password: "", confirmPassword: "" }))
    } catch {
      setError(`Tidak bisa terhubung ke server. Pastikan backend berjalan di ${API_URL}.`)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.otp_code || !formData.password || !formData.confirmPassword) {
      setError("Kode OTP, password, dan konfirmasi password wajib diisi")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok")
      return
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/otp/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp_code: formData.otp_code,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      })

      const message = await readApiMessage(response)

      if (!response.ok) {
        setError(message || "Verifikasi OTP gagal")
        return
      }

      router.push("/auth/login?registered=true")
    } catch {
      setError(`Tidak bisa terhubung ke server. Pastikan backend berjalan di ${API_URL}.`)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/otp/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      })

      const message = await readApiMessage(response)

      if (!response.ok) {
        setError(message || "Gagal mengirim ulang kode OTP")
        return
      }

      // Reset timer
      const expirationTime = Date.now() + 10 * 60 * 1000
      setOtpExpiration(expirationTime)
    } catch {
      setError(`Tidak bisa terhubung ke server. Pastikan backend berjalan di ${API_URL}.`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Calculate remaining time
  useEffect(() => {
    if (!otpExpiration) return

    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((otpExpiration - now) / 1000))
      setTimeLeft(remaining)

      if (remaining === 0) {
        setOtpExpiration(null)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [otpExpiration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Daftar SiJempol</CardTitle>
          <CardDescription>
            {stage === "request-otp" ? "Buat akun pengguna baru" : "Verifikasi email Anda"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stage === "request-otp" ? (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nama Lengkap
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nama Anda"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username (minimal 3 karakter)"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="username"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Spinner className="mr-2" />
                    Mengirim Kode OTP...
                  </>
                ) : (
                  "Kirim Kode OTP"
                )}
              </Button>

              <div className="text-center text-sm">
                Sudah punya akun?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Masuk di sini
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  Kode OTP telah dikirim ke <strong>{formData.email}</strong>
                </p>
              </div>

              <div>
                <label htmlFor="otp_code" className="block text-sm font-medium mb-2">
                  Kode OTP (6 digit)
                </label>
                <Input
                  id="otp_code"
                  name="otp_code"
                  type="text"
                  placeholder="000000"
                  value={formData.otp_code}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  autoComplete="one-time-code"
                />
              </div>

              {otpExpiration && (
                <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded">
                  <Clock className="w-4 h-4" />
                  Kode OTP berlaku selama: <strong>{formatTime(timeLeft)}</strong>
                </div>
              )}

              <PasswordInput
                id="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                placeholder="Minimal 6 karakter"
              />

              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label="Konfirmasi Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />

              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Spinner className="mr-2" />
                    Memverifikasi...
                  </>
                ) : (
                  "Verifikasi & Daftar"
                )}
              </Button>

              <div className="space-y-2 text-sm text-center">
                <p>
                  Tidak menerima kode?{" "}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-primary hover:underline font-medium disabled:opacity-50"
                  >
                    Kirim ulang
                  </button>
                </p>
                <p>
                  <button
                    type="button"
                    onClick={() => {
                      setStage("request-otp")
                      setError("")
                      setFormData({ ...formData, otp_code: "", password: "", confirmPassword: "" })
                    }}
                    disabled={loading}
                    className="text-primary hover:underline font-medium disabled:opacity-50"
                  >
                    Kembali
                  </button>
                </p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
