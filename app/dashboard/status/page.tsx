"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Search, Eye, Clock, CheckCircle2, XCircle, AlertCircle, FileText } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  createStatusCounts,
  dashboardServices,
  fetchUserSubmissions,
  type DashboardSubmission,
} from "@/lib/dashboard-data"
import { formatDate, getStatusBadgeColor, getStatusLabel } from "@/lib/submission-utils"

const pageSize = 8

export default function StatusPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, accessToken } = useAuth()
  const [submissions, setSubmissions] = useState<DashboardSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    const load = async () => {
      try {
        setLoading(true)
        setError("")
        const token = accessToken || localStorage.getItem("access_token")
        if (!token) return
        setSubmissions(await fetchUserSubmissions(token))
      } catch (err: any) {
        setError(err.message || "Gagal memuat status pengajuan")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isAuthenticated, accessToken, router])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, typeFilter])

  const filteredData = useMemo(() => {
    return submissions.filter((record) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !query ||
        String(record.id).toLowerCase().includes(query) ||
        record.serviceLabel.toLowerCase().includes(query)
      const matchesStatus = statusFilter === "all" || record.status === statusFilter
      const matchesType = typeFilter === "all" || record.service === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [submissions, searchQuery, statusFilter, typeFilter])

  const counts = useMemo(() => createStatusCounts(submissions), [submissions])
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize))
  const currentData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Status Pengajuan"
        description="Pantau status pengajuan layanan milik akun Anda"
      />

      <div className="flex-1 space-y-6 p-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{submissions.length}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Menunggu</p>
                  <p className="text-2xl font-bold text-amber-600">{counts.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Diproses</p>
                  <p className="text-2xl font-bold text-blue-600">{counts.verifying}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Selesai</p>
                  <p className="text-2xl font-bold text-emerald-600">{counts.approved + counts.completed}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ditolak</p>
                  <p className="text-2xl font-bold text-red-600">{counts.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Daftar Pengajuan Saya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nomor pengajuan atau layanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[190px]">
                  <SelectValue placeholder="Jenis Layanan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Layanan</SelectItem>
                  {dashboardServices.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[190px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="verifying">Diproses</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner className="h-8 w-8" />
              </div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Pengajuan</TableHead>
                      <TableHead>Jenis Layanan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Tanggal Pengajuan</TableHead>
                      <TableHead className="hidden sm:table-cell">Terakhir Update</TableHead>
                      <TableHead className="w-[110px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((record) => (
                      <TableRow key={`${record.service}-${record.id}`}>
                        <TableCell className="font-mono text-sm font-medium">
                          {record.serviceShortLabel}-{String(record.id).padStart(4, "0")}
                        </TableCell>
                        <TableCell className="font-medium">{record.serviceLabel}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(record.status)}>
                            {getStatusLabel(record.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {formatDate(record.created_at)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {formatDate(record.updated_at)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            onClick={() => router.push(`/dashboard/submissions/${record.service}/${record.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!loading && filteredData.length === 0 && (
              <div className="py-8 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Tidak ada pengajuan yang ditemukan
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <p>Menampilkan {currentData.length} dari {filteredData.length} pengajuan</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
