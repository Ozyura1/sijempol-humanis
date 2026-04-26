"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { Search, Plus, Eye, Download, Filter, CheckCircle2, Clock, XCircle, AlertCircle, Heart } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  buildSubmissionsCsv,
  createStatusCounts,
  downloadTextFile,
  fetchUserSubmissions,
  type DashboardSubmission,
} from "@/lib/dashboard-data"
import { formatDate, getStatusBadgeColor, getStatusLabel } from "@/lib/submission-utils"

export default function PerkawinanPage() {
  const router = useRouter()
  const { isAuthenticated, accessToken } = useAuth()
  const [submissions, setSubmissions] = useState<DashboardSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

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
        const data = await fetchUserSubmissions(token)
        setSubmissions(data.filter((item) => item.service === "marriages"))
      } catch (err: any) {
        setError(err.message || "Gagal memuat pengajuan perkawinan")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isAuthenticated, accessToken, router])

  const filteredData = useMemo(() => {
    return submissions.filter((record) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !query ||
        String(record.id).toLowerCase().includes(query) ||
        record.applicant_name?.toLowerCase().includes(query)
      const matchesStatus = statusFilter === "all" || record.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [submissions, searchQuery, statusFilter])

  const counts = useMemo(() => createStatusCounts(submissions), [submissions])

  return (
    <div className="flex flex-col">
      <Header
        title="Akta Perkawinan Saya"
        description="Riwayat pencatatan perkawinan milik akun Anda"
      />

      <div className="flex-1 space-y-6 p-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{submissions.length}</p>
              </div>
              <Heart className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Menunggu</p>
                <p className="text-2xl font-bold text-amber-600">{counts.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Disetujui/Selesai</p>
                <p className="text-2xl font-bold text-emerald-600">{counts.approved + counts.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Ditolak</p>
                <p className="text-2xl font-bold text-red-600">{counts.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Daftar Pengajuan Perkawinan Saya</CardTitle>
              <Button asChild className="gap-2">
                <Link href="/dashboard/perkawinan/pengajuan">
                  <Plus className="h-4 w-4" />
                  Tambah Pengajuan
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nomor pengajuan atau nama pemohon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[190px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Status" />
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
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => downloadTextFile("pengajuan-perkawinan-saya.csv", buildSubmissionsCsv(filteredData))}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner className="h-8 w-8" />
              </div>
            ) : filteredData.length === 0 ? (
              <div className="rounded-lg border border-dashed py-12 text-center">
                <p className="mb-4 text-muted-foreground">Belum ada pengajuan perkawinan yang sesuai.</p>
                <Button asChild>
                  <Link href="/dashboard/perkawinan/pengajuan">Buat Pengajuan Perkawinan</Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Pengajuan</TableHead>
                      <TableHead>Pemohon</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Tanggal Pengajuan</TableHead>
                      <TableHead className="w-[100px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono text-sm">
                          PKW-{String(record.id).padStart(4, "0")}
                        </TableCell>
                        <TableCell>{record.applicant_name || "Pemohon"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(record.status)}>
                            {getStatusLabel(record.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{formatDate(record.created_at)}</TableCell>
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

            <div className="mt-4 text-sm text-muted-foreground">
              Menampilkan {filteredData.length} dari {submissions.length} pengajuan perkawinan milik akun Anda
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
