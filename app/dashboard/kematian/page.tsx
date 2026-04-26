"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
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
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  Eye,
  AlertCircle,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import { getStatusBadgeColor, getStatusLabel, formatDate } from "@/lib/submission-utils"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function KematianPage() {
  const { isAuthenticated, accessToken } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }
    fetchSubmissions()
  }, [isAuthenticated, accessToken])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/deaths?limit=100`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      })

      if (response.status === 401) {
        router.push("/auth/login")
        return
      }

      if (!response.ok) {
        throw new Error("Gagal memuat data")
      }

      const data = await response.json()
      const submissions = Array.isArray(data) ? data : data.data || []
      setSubmissions(submissions)
    } catch (err: any) {
      setError(err.message || "Gagal memuat pengajuan")
    } finally {
      setLoading(false)
    }
  }

  const filteredData = submissions.filter((record) => {
    const matchesSearch =
      record.applicant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id?.toString().includes(searchQuery)
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Akta Kematian"
        description="Kelola pengajuan akta kematian"
      />

      <div className="flex-1 space-y-6 p-6 overflow-y-auto">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <div className="flex-1 md:flex-initial">
              <Input
                placeholder="Cari nama atau nomor referensi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                prefix={<Search className="h-4 w-4 text-gray-400" />}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter Status" />
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
          <Button asChild>
            <Link href="/dashboard/kematian/pengajuan">
              <Plus className="h-4 w-4 mr-2" />
              Pengajuan Baru
            </Link>
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner className="h-8 w-8" />
          </div>
        ) : filteredData.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-600 text-lg mb-4">
                {searchQuery || statusFilter !== "all" ? "Tidak ada data yang sesuai" : "Belum ada pengajuan"}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button asChild>
                  <Link href="/dashboard/kematian/pengajuan">
                    Buat Pengajuan Baru
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pengajuan Akta Kematian</CardTitle>
              <CardDescription>
                Total {filteredData.length} dari {submissions.length} pengajuan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Referensi</TableHead>
                      <TableHead>Nama Almarhum/Almarhumah</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal Pengajuan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          KEMATIAN-{record.id}
                        </TableCell>
                        <TableCell>{record.applicant_name}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(record.status)}>
                            {getStatusLabel(record.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(record.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                          >
                            <Link href={`/dashboard/submissions/deaths/${record.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
