"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, LogOut, Eye, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react"
import { getStatusBadgeColor, getStatusLabel, getServiceLabel, formatDate, getServiceApiEndpoint } from "@/lib/submission-utils"
import { calculateAdminStats } from "@/lib/admin-utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState("")

  const services = [
    { value: "id-cards", label: "KTP" },
    { value: "births", label: "Akta Kelahiran" },
    { value: "deaths", label: "Akta Kematian" },
    { value: "marriages", label: "Akta Perkawinan" },
    { value: "moves", label: "Pindah Domisili" },
    { value: "family-cards", label: "Kartu Keluarga" },
  ]

  // Check auth
  useEffect(() => {
    const adminToken = localStorage.getItem("admin_access_token")
    if (!adminToken) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      fetchSubmissions()
    }
    setIsLoading(false)
  }, [router])

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("admin_access_token")
      let allSubmissions: any[] = []

      for (const service of services) {
        try {
          const response = await fetch(`${API_URL}/${service.value}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            const serviceSubmissions = (Array.isArray(data) ? data : data.data || []).map((sub: any) => ({
              ...sub,
              service: service.value,
              serviceLabel: service.label,
            }))
            allSubmissions.push(...serviceSubmissions)
          }
        } catch (err) {
          console.error(`Error fetching ${service.value}:`, err)
        }
      }

      // Sort by date descending and get recent 10
      allSubmissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setSubmissions(allSubmissions)
      setStats(calculateAdminStats(allSubmissions))
    } catch (err: any) {
      setError(err.message || "Gagal memuat data")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_access_token")
    localStorage.removeItem("admin_refresh_token")
    localStorage.removeItem("admin_user")
    router.push("/admin/login")
  }

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-white/80 text-sm">Kelola pengajuan layanan dari masyarakat</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="py-6">
                <p className="text-sm text-gray-600 mb-1">Total Bulan Ini</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalMonth}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Menunggu Review</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.byStatus.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Sedang Diverifikasi</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.byStatus.verifying}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Disetujui</p>
                    <p className="text-3xl font-bold text-green-600">{stats.byStatus.approved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ditolak</p>
                    <p className="text-3xl font-bold text-red-600">{stats.byStatus.rejected}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-8">
          <Link href="/admin/submissions">
            <Button size="lg" className="gap-2">
              <Eye className="h-4 w-4" />
              Lihat Semua Pengajuan
            </Button>
          </Link>
        </div>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Pengajuan Terbaru</CardTitle>
            <CardDescription>10 pengajuan terbaru dari semua layanan</CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Belum ada pengajuan</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Layanan</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Pemohon</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {submissions.slice(0, 10).map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-mono">{submission.id.substring(0, 8).toUpperCase()}</td>
                        <td className="px-6 py-4 text-sm font-medium">{submission.serviceLabel}</td>
                        <td className="px-6 py-4 text-sm">{submission.applicant_name}</td>
                        <td className="px-6 py-4 text-sm">
                          <Badge className={getStatusBadgeColor(submission.status)}>
                            {getStatusLabel(submission.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(submission.created_at).split(" ")[0]}</td>
                        <td className="px-6 py-4 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/submissions/${submission.service}/${submission.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Lihat
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
