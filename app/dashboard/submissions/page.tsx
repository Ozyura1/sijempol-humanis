"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Eye, Trash2, Loader2 } from "lucide-react"
import { getStatusBadgeColor, getStatusLabel, getServiceLabel, formatDate } from "@/lib/submission-utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface Submission {
  id: string
  user_id: string
  applicant_name: string
  status: "pending" | "verifying" | "approved" | "rejected" | "completed" | "deleted"
  data: any
  documents: any
  reviewed_by?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export default function SubmissionsPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const services = [
    { value: "id-cards", label: "KTP" },
    { value: "births", label: "Akta Kelahiran" },
    { value: "deaths", label: "Akta Kematian" },
    { value: "marriages", label: "Akta Perkawinan" },
    { value: "moves", label: "Pindah Domisili" },
    { value: "family-cards", label: "Kartu Keluarga" },
  ]

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "user") {
      router.push("/auth/login")
      return
    }

    fetchSubmissions()
  }, [isAuthenticated, user, serviceFilter, statusFilter])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      setError("")
      const token = localStorage.getItem("access_token")

      let allSubmissions: any[] = []

      // Fetch from all services
      for (const service of services) {
        try {
          const url = new URL(`${API_URL}/${service.value}`)
          if (statusFilter !== "all") {
            url.searchParams.append("status", statusFilter)
          }

          const response = await fetch(url.toString(), {
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

      // Sort by created_at descending
      allSubmissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      // Apply service filter
      if (serviceFilter !== "all") {
        allSubmissions = allSubmissions.filter((sub) => sub.service === serviceFilter)
      }

      setSubmissions(allSubmissions)
    } catch (err: any) {
      setError(err.message || "Gagal memuat pengajuan")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, service: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengajuan ini?")) return

    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/${service}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setSubmissions(submissions.filter((sub) => sub.id !== id))
      } else {
        setError("Gagal menghapus pengajuan")
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghapus pengajuan")
    }
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
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pengajuan Saya</h1>
        <p className="text-gray-600">Kelola dan lihat status semua pengajuan layanan Anda</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Pengajuan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">Tidak ada pengajuan yang ditemukan</p>
            <Button onClick={() => router.push("/dashboard")}>Kembali ke Dashboard</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="text-sm text-gray-600">ID Pengajuan</p>
                    <p className="font-mono font-bold text-lg">{submission.id.substring(0, 8).toUpperCase()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Jenis Layanan</p>
                    <p className="font-semibold">{submission.serviceLabel}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Tanggal Pengajuan</p>
                    <p className="text-sm">{formatDate(submission.created_at)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={`mt-1 ${getStatusBadgeColor(submission.status)}`}>
                      {getStatusLabel(submission.status)}
                    </Badge>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/submissions/${submission.service}/${submission.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Lihat
                    </Button>

                    {submission.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(submission.id, submission.service)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
