"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { PasswordInput } from "@/components/auth/password-input"
import { getApiUrl } from "@/lib/api-url"

type RegistrationStage = "request-otp" | "verify-otp"

type ApiResponse = {
  message?: string
  otp_expires_in?: number
  dev_otp?: string
  email_sent?: boolean
}

async function readApiResponse(response: Response): Promise<ApiResponse> {
  try {
    return await response.json()
  } catch {
    return {}
  }
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function RegisterForm({
  onSuccess,
  successRedirect = "/?login=true",
}: {
  onSuccess?: () => void
  successRedirect?: string
}) {
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
  const [info, setInfo] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpExpiration, setOtpExpiration] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const router = useRouter()
  const apiUrl = getApiUrl()

  useEffect(() => {
    if (!otpExpiration) return

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((otpExpiration - Date.now()) / 1000))
      setTimeLeft(remaining)

      if (remaining === 0) {
        setOtpExpiration(null)
      }
    }

    updateTimer()
    const interval = window.setInterval(updateTimer, 1000)
    return () => window.clearInterval(interval)
  }, [otpExpiration])

  const startOtpTimer = (minutes = 10) => {
    setOtpExpiration(Date.now() + minutes * 60 * 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "otp_code" ? value.replace(/\D/g, "").slice(0, 6) : value,
    }))
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setInfo("")

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
      const response = await fetch(`${apiUrl}/auth/otp/request-otp`, {
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
      const data = await readApiResponse(response)

      if (!response.ok) {
        setError(data.message || "Gagal mengirim kode OTP")
        return
      }

      startOtpTimer(data.otp_expires_in || 10)
      setStage("verify-otp")
      setFormData((prev) => ({ ...prev, otp_code: "", password: "", confirmPassword: "" }))
      setInfo(data.dev_otp ? `Mode development: gunakan OTP ${data.dev_otp}` : data.message || "Kode OTP telah dikirim ke email Anda.")
    } catch {
      setError(`Tidak bisa terhubung ke server register. Pastikan backend berjalan dan dapat diakses di ${apiUrl}.`)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setInfo("")

    if (!formData.otp_code || !formData.password || !formData.confirmPassword) {
      setError("Kode OTP, password, dan konfirmasi password wajib diisi")
      return
    }

    if (formData.otp_code.length !== 6) {
      setError("Kode OTP harus 6 digit")
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
      const response = await fetch(`${apiUrl}/auth/otp/verify-otp`, {
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
      const data = await readApiResponse(response)

      if (!response.ok) {
        setError(data.message || "Verifikasi OTP gagal")
        return
      }

      onSuccess?.()
      router.push(successRedirect)
    } catch {
      setError(`Tidak bisa terhubung ke server register. Pastikan backend berjalan dan dapat diakses di ${apiUrl}.`)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError("")
    setInfo("")
    setLoading(true)

    try {
      const response = await fetch(`${apiUrl}/auth/otp/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      })
      const data = await readApiResponse(response)

      if (!response.ok) {
        setError(data.message || "Gagal mengirim ulang kode OTP")
        return
      }

      startOtpTimer(data.otp_expires_in || 10)
      setFormData((prev) => ({ ...prev, otp_code: "" }))
      setInfo(data.dev_otp ? `Mode development: gunakan OTP ${data.dev_otp}` : data.message || "Kode OTP baru telah dikirim.")
    } catch {
      setError(`Tidak bisa terhubung ke server register. Pastikan backend berjalan dan dapat diakses di ${apiUrl}.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CardContent className="pt-6">
      {stage === "request-otp" ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}
          {info && <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm">{info}</div>}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nama Lengkap
            </label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Nama Anda"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <Input
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Email Anda"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? (
              <>
                <Spinner className="mr-2" />
                Mengirim OTP...
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
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}
          {info && <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm">{info}</div>}

          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Kode OTP telah dikirim ke <strong>{formData.email}</strong>
            </p>
          </div>

          <div>
            <label htmlFor="otp_code" className="block text-sm font-medium mb-2">
              Kode OTP
            </label>
            <Input
              id="otp_code"
              type="text"
              inputMode="numeric"
              name="otp_code"
              placeholder="000000"
              value={formData.otp_code}
              onChange={handleChange}
              disabled={loading}
              maxLength={6}
              autoComplete="one-time-code"
              className="text-center text-lg tracking-widest"
              required
            />
          </div>

          {otpExpiration && (
            <div className="flex items-center gap-2 rounded bg-amber-50 p-2 text-sm text-amber-700">
              <Clock className="h-4 w-4" />
              Kode berlaku: <strong>{formatTime(timeLeft)}</strong>
            </div>
          )}

          <PasswordInput
            id="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Konfirmasi Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            required
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

          <div className="space-y-2 text-center text-sm">
            <p>
              Tidak menerima kode?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="font-medium text-primary hover:underline disabled:opacity-50"
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
                  setInfo("")
                  setOtpExpiration(null)
                  setFormData((prev) => ({ ...prev, otp_code: "", password: "", confirmPassword: "" }))
                }}
                disabled={loading}
                className="font-medium text-primary hover:underline disabled:opacity-50"
              >
                Kembali
              </button>
            </p>
          </div>
        </form>
      )}
    </CardContent>
  )
}
