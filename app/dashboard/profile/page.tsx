"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Save, Lock, LogOut } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function ProfilePage() {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showChangePassword, setShowChangePassword] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
  })

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "user") {
      router.push("/auth/login")
      return
    }

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
      })
    }
  }, [isAuthenticated, user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Nama dan email tidak boleh kosong")
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("access_token")

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Gagal memperbarui profil")
      }

      setSuccess("Profil berhasil diperbarui")
      // Update auth context with new user data
      const updatedUser = await response.json()
      localStorage.setItem("user", JSON.stringify(updatedUser.user))
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui profil")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setError("Password lama dan password baru tidak boleh kosong")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password baru minimal 6 karakter")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Password baru tidak cocok dengan konfirmasi password")
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("access_token")

      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Gagal mengubah password")
      }

      setSuccess("Password berhasil diubah")
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setShowChangePassword(false)
    } catch (err: any) {
      setError(err.message || "Gagal mengubah password")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  if (!isAuthenticated || user?.role !== "user") {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Anda harus login sebagai user untuk mengakses halaman ini.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profil Saya</h1>
        <p className="text-gray-600">Kelola informasi akun dan keamanan Anda</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Basic Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input type="text" value={formData.username} disabled className="bg-gray-100 cursor-not-allowed" />
              <p className="text-xs text-gray-600 mt-1">Username tidak dapat diubah</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nama Lengkap *</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama lengkap Anda"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Masukkan email Anda"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Perubahan
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Keamanan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showChangePassword ? (
            <Button variant="outline" onClick={() => setShowChangePassword(true)}>
              Ubah Password
            </Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Password Lama *</label>
                <Input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  placeholder="Masukkan password lama Anda"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password Baru *</label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Masukkan password baru (minimal 6 karakter)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Konfirmasi Password Baru *</label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Konfirmasi password baru Anda"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Ubah Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowChangePassword(false)
                    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })
                    setError("")
                  }}
                >
                  Batal
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Logout</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-800 mb-4">Keluar dari akun Anda</p>
          <Button variant="destructive" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
