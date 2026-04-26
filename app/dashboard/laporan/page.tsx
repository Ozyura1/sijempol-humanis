"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, AlertCircle, FileText, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function LaporanPage() {
  const { isAuthenticated, accessToken } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const services = [
    { value: "id-cards", label: "KTP" },
    { value: "births", label: "Akta Kelahiran" },
    { value: "deaths", label: "Akta Kematian" },
    { value: "marriages", label: "Akta Perkawinan" },
    { value: "moves", label: "Pindah Domisili" },
    { value: "family-cards", label: "Kartu Keluarga" },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }
    fetchStats()
  }, [isAuthenticated, accessToken])

  const fetchStats = async () => {
    try {
      setLoading(true)
      let allSubmissions: any[] = []

      for (const service of services) {
        try {
          const response = await fetch(`${API_URL}/${service.value}?limit=100`, {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            const submissions = Array.isArray(data) ? data : data.data || []
            allSubmissions.push(...submissions.map((sub: any) => ({ ...sub, service: service.label })))
          }
        } catch (err) {
          console.error(`Error fetching ${service.value}:`, err)
        }
      }

      // Calculate statistics
      const byStatus = {
        pending: 0,
        verifying: 0,
        approved: 0,
        rejected: 0,
        completed: 0,
      }

      const byService: Record<string, number> = {}
      let thisMonth = 0

      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      services.forEach(s => byService[s.label] = 0)

      allSubmissions.forEach((sub) => {
        if (sub.status in byStatus) {
          byStatus[sub.status as keyof typeof byStatus]++
        }
        if (sub.service in byService) {
          byService[sub.service]++
        }

        const subDate = new Date(sub.created_at)
        if (subDate.getMonth() === currentMonth && subDate.getFullYear() === currentYear) {
          thisMonth++
        }
      })

      const statusData = [
        { name: "Menunggu Review", value: byStatus.pending },
        { name: "Sedang Diverifikasi", value: byStatus.verifying },
        { name: "Disetujui", value: byStatus.approved },
        { name: "Ditolak", value: byStatus.rejected },
        { name: "Selesai", value: byStatus.completed },
      ]

      const serviceData = services.map(s => ({
        name: s.label,
        total: byService[s.label] || 0,
      }))

      setStats({
        total: allSubmissions.length,
        thisMonth,
        byStatus,
        statusData,
        serviceData,
      })
    } catch (err: any) {
      setError(err.message || "Gagal memuat laporan")
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = () => {
    alert("Fitur export PDF sedang dikembangkan")
  }

  const handleExportExcel = () => {
    alert("Fitur export Excel sedang dikembangkan")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Laporan"
        description="Lihat laporan dan statistik pengajuan"
      />

      <div className="flex-1 space-y-6 p-6 overflow-y-auto">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner className="h-8 w-8" />
          </div>
        ) : stats ? (
          <>
            {/* Action Bar */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleExportPDF}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleExportExcel}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Pengajuan</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Bulan Ini</p>
                      <p className="text-3xl font-bold text-green-600">{stats.thisMonth}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Disetujui</p>
                      <p className="text-3xl font-bold text-green-600">{stats.byStatus.approved}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Menunggu Review</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats.byStatus.pending}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribusi Status Pengajuan</CardTitle>
                  <CardDescription>Proporsi pengajuan berdasarkan status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.statusData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Service Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Pengajuan Per Layanan</CardTitle>
                  <CardDescription>Jumlah pengajuan untuk setiap jenis layanan</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.serviceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Status Summary Table */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Status</CardTitle>
                <CardDescription>Detail jumlah pengajuan per status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{stats.byStatus.pending}</p>
                    <p className="text-sm text-gray-600">Menunggu Review</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{stats.byStatus.verifying}</p>
                    <p className="text-sm text-gray-600">Sedang Diverifikasi</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{stats.byStatus.approved}</p>
                    <p className="text-sm text-gray-600">Disetujui</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{stats.byStatus.rejected}</p>
                    <p className="text-sm text-gray-600">Ditolak</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-600">{stats.byStatus.completed}</p>
                    <p className="text-sm text-gray-600">Selesai</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  )
}
