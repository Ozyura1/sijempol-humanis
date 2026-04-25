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

                      Judul
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Permohonan KTP-el"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Layanan
                    </label>
                    <Input
                      name="layanan"
                      value={formData.layanan}
                      onChange={handleInputChange}
                      placeholder="KTP Elektronik"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tanggal
                    </label>
                    <Input
                      name="tanggal"
                      type="date"
                      value={formData.tanggal}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Jam
                    </label>
                    <Input
                      name="jam"
                      value={formData.jam}
                      onChange={handleInputChange}
                      placeholder="08:00 - 14:00"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Lokasi
                    </label>
                    <Input
                      name="lokasi"
                      value={formData.lokasi}
                      onChange={handleInputChange}
                      placeholder="Kantor Kab. Minahasen"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Kapasitas
                    </label>
                    <Input
                      name="kapasitas"
                      type="number"
                      value={formData.kapasitas}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Terdaftar
                    </label>
                    <Input
                      name="terdaftar"
                      type="number"
                      value={formData.terdaftar}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="tersedia">Tersedia</option>
                      <option value="penuh">Penuh</option>
                      <option value="ditutup">Ditutup</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      placeholder="Deskripsi layanan..."
                      rows={3}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                <div className="flex gap-4 justify-end">
                  <Button variant="outline" onClick={handleResetForm}>
                    Batal
                  </Button>
                  <Button type="submit" className="gap-2">
                    {editingId ? "Simpan Perubahan" : "Tambah Jadwal"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Data Jadwal ({agendas.length})</CardTitle>
            <CardDescription>
              Kelola semua jadwal layanan keliling disini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Judul</th>
                    <th className="text-left py-3 px-4 font-semibold">Layanan</th>
                    <th className="text-left py-3 px-4 font-semibold">Tanggal</th>
                    <th className="text-left py-3 px-4 font-semibold">Jam</th>
                    <th className="text-left py-3 px-4 font-semibold">Lokasi</th>
                    <th className="text-center py-3 px-4 font-semibold">Kapasitas</th>
                    <th className="text-center py-3 px-4 font-semibold">Status</th>
                    <th className="text-center py-3 px-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {agendas.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-muted-foreground">
                        Tidak ada jadwal. Tambahkan jadwal baru untuk memulai.
                      </td>
                    </tr>
                  ) : (
                    agendas.map((agenda) => (
                      <tr key={agenda.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{agenda.title}</td>
                        <td className="py-3 px-4">{agenda.layanan}</td>
                        <td className="py-3 px-4">{agenda.tanggal}</td>
                        <td className="py-3 px-4">{agenda.jam}</td>
                        <td className="py-3 px-4">{agenda.lokasi}</td>
                        <td className="py-3 px-4 text-center">
                          {agenda.terdaftar}/{agenda.kapasitas}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={
                              agenda.status === "tersedia"
                                ? "outline"
                                : agenda.status === "penuh"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {agenda.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center flex gap-2 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(agenda)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAgenda(agenda.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Dialog Aspirasi Warga */}
      <Dialog open={showAspirasi} onOpenChange={setShowAspirasi}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Aspirasi Warga
            </DialogTitle>
            <DialogDescription>
              Kelola pesan dan aspirasi dari masyarakat
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 border-b">
              <Button
                variant={filterStatus === "semua" ? "default" : "ghost"}
                size="sm"
                className="gap-2"
                onClick={() => setFilterStatus("semua")}
              >
                Semua ({aspirasi.length})
              </Button>
              <Button
                variant={filterStatus === "baru" ? "default" : "ghost"}
                size="sm"
                className="gap-2"
                onClick={() => setFilterStatus("baru")}
              >
                Baru ({aspirasi.filter((a) => a.status === "baru").length})
              </Button>
              <Button
                variant={filterStatus === "dibaca" ? "default" : "ghost"}
                size="sm"
                className="gap-2"
                onClick={() => setFilterStatus("dibaca")}
              >
                Dibaca ({aspirasi.filter((a) => a.status === "dibaca").length})
              </Button>
              <Button
                variant={filterStatus === "diproses" ? "default" : "ghost"}
                size="sm"
                className="gap-2"
                onClick={() => setFilterStatus("diproses")}
              >
                Diproses ({aspirasi.filter((a) => a.status === "diproses").length})
              </Button>
            </div>

            {/* Aspirasi List */}
            <ScrollArea className="h-96 w-full rounded-md border p-4 space-y-4">
              {getFilteredAspirasi().length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Tidak ada aspirasi warga</p>
                </div>
              ) : (
                getFilteredAspirasi().map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-l-4 ${item.status === "baru"
                      ? "border-l-red-500 bg-red-50"
                      : item.status === "dibaca"
                        ? "border-l-blue-500 bg-blue-50"
                        : "border-l-green-500 bg-green-50"
                      }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.nama}</p>
                        <p className="text-xs text-muted-foreground">{item.email}</p>
                      </div>
                      <Badge
                        variant={
                          item.status === "baru"
                            ? "destructive"
                            : item.status === "dibaca"
                              ? "secondary"
                              : "default"
                        }
                        className="text-xs"
                      >
                        {item.status === "baru"
                          ? "Baru"
                          : item.status === "dibaca"
                            ? "Dibaca"
                            : "Diproses"}
                      </Badge>
                    </div>

                    <p className="text-sm mb-3 text-gray-700">{item.pesan}</p>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.tanggal).toLocaleDateString("id-ID")}
                      </p>
                      <div className="flex gap-2">
                        {item.status === "baru" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(item.id)}
                            className="text-xs h-7"
                          >
                            Tandai Dibaca
                          </Button>
                        )}
                        {item.status !== "diproses" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleMarkAsProcessed(item.id)}
                            className="text-xs h-7"
                          >
                            Proses
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
