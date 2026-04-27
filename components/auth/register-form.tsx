"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { PasswordInput } from "@/components/auth/password-input"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

async function readApiMessage(response: Response) {
  try {
    const data = await response.json()
    return typeof data?.message === "string" ? data.message : null
  } catch {
    return null
  }
}

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.username || !formData.email || !formData.name || !formData.password) {
      setError("Semua field wajib diisi")
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
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          name: formData.name,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const message = await readApiMessage(response)
        setError(message || "Pendaftaran gagal")
        return
      }

      onSuccess?.()
      router.push("/?login=true")
    } catch {
      setError(
        `Tidak bisa terhubung ke server register. Pastikan backend berjalan dan dapat diakses di ${API_URL}.`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <CardContent className="pt-6">
      <form onSubmit={handleRegister} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

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
            required
          />
        </div>

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
              Mendaftar...
            </>
          ) : (
            "Daftar"
          )}
        </Button>

        <div className="text-center text-sm">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Masuk di sini
          </Link>
        </div>
      </form>
    </CardContent>
  )
}
