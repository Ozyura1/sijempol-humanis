"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AlertCircle, Eye, Loader2, ChevronRight } from "lucide-react"
import { getStatusBadgeColor, getStatusLabel, getServiceLabel, formatDate, getServiceApiEndpoint } from "@/lib/submission-utils"
import { calculateAdminStats, filterSubmissions, sortSubmissions, paginateSubmissions } from "@/lib/admin-utils"
import { useAuth } from "@/contexts/auth-context"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function AdminSubmissionsPage() {
  const router = useRouter()
  const { isAuthenticated, user, accessToken } = useAuth()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState<any>(null)

  const [serviceFilter, setServiceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const services = [
    { value: "id-cards", label: "KTP" },
    { value: "births", label: "Akta Kelahiran" },
    { value: "deaths", label: "Akta Kematian" },
    { value: "marriages", label: "Akta Perkawinan" },
    { value: "moves", label: "Pindah Domisili" },
    { value: "family-cards", label: "Kartu Keluarga" },
  ]

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login")
      return
    }

    fetchAllSubmissions()
  }, [isAuthenticated, user, router])

  const fetchAllSubmissions = async () => {
    try {
      setLoading(true)
      setError("")

      let allSubmissions: any[] = []

      for (const service of services) {
        try {
          const response = await fetch(`${API_URL}/${service.value}?limit=100`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
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

      setSubmissions(allSubmissions)
      setStats(calculateAdminStats(allSubmissions))
    } catch (err: any) {
      setError(err.message || "Gagal memuat pengajuan")
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  const filtered = filterSubmissions(submissions, {
    service: serviceFilter,
    status: statusFilter,
    searchTerm: searchTerm,
  })

  // Apply sorting
  const sorted = sortSubmissions(filtered, sortBy)

  // Apply pagination
  const paginated = paginateSubmissions(sorted, currentPage, 20)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Kelola Pengajuan</h1>
        <p className="text-gray-600">Lihat dan kelola semua pengajuan dari semua layanan</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-gray-600 mb-1">Total Bulan Ini</p>
              <p className="text-3xl font-bold">{stats.totalMonth}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-gray-600 mb-1">Menunggu Review</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.byStatus.pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-gray-600 mb-1">Sedang Diverifikasi</p>
              <p className="text-3xl font-bold text-blue-600">{stats.byStatus.verifying}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-gray-600 mb-1">Disetujui</p>
              <p className="text-3xl font-bold text-green-600">{stats.byStatus.approved}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-gray-600 mb-1">Ditolak</p>
              <p className="text-3xl font-bold text-red-600">{stats.byStatus.rejected}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter & Cari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Jenis Layanan</label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Layanan</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu Review</SelectItem>
                  <SelectItem value="verifying">Sedang Diverifikasi</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Urutkan Berdasarkan</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Tanggal Terbaru</SelectItem>
                  <SelectItem value="date-asc">Tanggal Tertua</SelectItem>
                  <SelectItem value="name-asc">Nama A-Z</SelectItem>
                  <SelectItem value="name-desc">Nama Z-A</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cari ID/Nama</label>
              <Input
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : paginated.total === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Tidak ada pengajuan yang ditemukan</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="overflow-x-auto py-0">
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
                  {paginated.data.map((submission) => (
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
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="mt-6 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: paginated.pages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(paginated.pages, currentPage + 1))}
              disabled={currentPage === paginated.pages}
            >
              Selanjutnya
            </Button>

            <span className="ml-4 text-sm text-gray-600">
              Halaman {currentPage} dari {paginated.pages} (Total: {paginated.total})
            </span>
          </div>
        </>
      )}
    </div>
  )
}
