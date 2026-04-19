"use client"

import { useState } from "react"
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
import {
  Search,
  Eye,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  CreditCard,
  Heart,
  Baby,
} from "lucide-react"

interface ApplicationRecord {
  id: string
  type: "ktp" | "perkawinan" | "kelahiran" | "kematian" | "kk" | "pindah"
  title: string
  status: "pending" | "verified" | "approved" | "rejected" | "completed"
  createdAt: string
  updatedAt: string
  description: string
}

const mockApplications: ApplicationRecord[] = [
  {
    id: "KTP-2026-001",
    type: "ktp",
    title: "Pengajuan KTP Baru - Ahmad Surya Wijaya",
    status: "pending",
    createdAt: "2026-01-15",
    updatedAt: "2026-01-15",
    description: "Pengajuan KTP baru untuk warga baru",
  },
  {
    id: "PERKAWINAN-2026-002",
    type: "perkawinan",
    title: "Akta Perkawinan - Budi & Siti",
    status: "verified",
    createdAt: "2026-01-10",
    updatedAt: "2026-01-12",
    description: "Pencatatan akta perkawinan",
  },
  {
    id: "KELAHIRAN-2026-003",
    type: "kelahiran",
    title: "Akta Kelahiran - Bayi Ahmad",
    status: "approved",
    createdAt: "2026-01-08",
    updatedAt: "2026-01-14",
    description: "Pencatatan kelahiran bayi",
  },
  {
    id: "KK-2026-004",
    type: "kk",
    title: "Kartu Keluarga Baru - Keluarga Santoso",
    status: "completed",
    createdAt: "2026-01-05",
    updatedAt: "2026-01-13",
    description: "Pengajuan kartu keluarga baru",
  },
  {
    id: "KTP-2026-005",
    type: "ktp",
    title: "Penggantian KTP - Dewi Lestari",
    status: "rejected",
    createdAt: "2026-01-03",
    updatedAt: "2026-01-11",
    description: "Penggantian KTP karena hilang",
  },
]

const statusConfig = {
  pending: {
    label: "Menunggu Verifikasi",
    icon: Clock,
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  verified: {
    label: "Terverifikasi",
    icon: AlertCircle,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  approved: {
    label: "Disetujui",
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  rejected: {
    label: "Ditolak",
    icon: XCircle,
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  completed: {
    label: "Selesai",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
}

const typeConfig = {
  ktp: {
    label: "KTP",
    icon: CreditCard,
    color: "text-blue-600",
  },
  perkawinan: {
    label: "Perkawinan",
    icon: Heart,
    color: "text-pink-600",
  },
  kelahiran: {
    label: "Kelahiran",
    icon: Baby,
    color: "text-green-600",
  },
  kematian: {
    label: "Kematian",
    icon: FileText,
    color: "text-gray-600",
  },
  kk: {
    label: "Kartu Keluarga",
    icon: FileText,
    color: "text-purple-600",
  },
  pindah: {
    label: "Pindah",
    icon: FileText,
    color: "text-orange-600",
  },
}

export default function StatusPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredData = mockApplications.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesType = typeFilter === "all" || record.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="flex flex-col">
      <Header
        title="Status Pengajuan"
        description="Pantau status semua pengajuan layanan kependudukan Anda"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{mockApplications.length}</p>
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
                  <p className="text-2xl font-bold text-amber-600">
                    {mockApplications.filter(a => a.status === "pending").length}
                  </p>
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
                  <p className="text-2xl font-bold text-blue-600">
                    {mockApplications.filter(a => a.status === "verified").length}
                  </p>
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
                  <p className="text-2xl font-bold text-emerald-600">
                    {mockApplications.filter(a => ["approved", "completed"].includes(a.status)).length}
                  </p>
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
                  <p className="text-2xl font-bold text-red-600">
                    {mockApplications.filter(a => a.status === "rejected").length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Daftar Pengajuan</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan nomor pengajuan atau nama..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Jenis Layanan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Layanan</SelectItem>
                  <SelectItem value="ktp">KTP</SelectItem>
                  <SelectItem value="perkawinan">Perkawinan</SelectItem>
                  <SelectItem value="kelahiran">Kelahiran</SelectItem>
                  <SelectItem value="kematian">Kematian</SelectItem>
                  <SelectItem value="kk">Kartu Keluarga</SelectItem>
                  <SelectItem value="pindah">Pindah</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="verified">Diproses</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Pengajuan</TableHead>
                    <TableHead>Jenis Layanan</TableHead>
                    <TableHead className="hidden md:table-cell">Deskripsi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Tanggal Pengajuan</TableHead>
                    <TableHead className="hidden sm:table-cell">Terakhir Update</TableHead>
                    <TableHead className="w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((record) => {
                    const status = statusConfig[record.status]
                    const type = typeConfig[record.type]
                    const StatusIcon = status.icon
                    const TypeIcon = type.icon
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono text-sm font-medium">
                          {record.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TypeIcon className={`h-4 w-4 ${type.color}`} />
                            <span className="font-medium">{type.label}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden max-w-[300px] truncate md:table-cell">
                          {record.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={status.className}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {new Date(record.createdAt).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {new Date(record.updatedAt).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Tidak ada pengajuan yang ditemukan
                </p>
              </div>
            )}

            {/* Pagination Info */}
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <p>Menampilkan {filteredData.length} dari {mockApplications.length} pengajuan</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Sebelumnya
                </Button>
                <Button variant="outline" size="sm">
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