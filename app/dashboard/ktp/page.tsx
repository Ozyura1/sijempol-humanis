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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

interface KTPRecord {
  id: string
  nik: string
  name: string
  address: string
  birthDate: string
  gender: "L" | "P"
  status: "pending" | "verified" | "approved" | "rejected"
  createdAt: string
}

const mockData: KTPRecord[] = [
  {
    id: "1",
    nik: "3201234567890001",
    name: "Ahmad Surya Wijaya",
    address: "Jl. Merdeka No. 123, Jakarta Pusat",
    birthDate: "1990-05-15",
    gender: "L",
    status: "pending",
    createdAt: "2026-04-10",
  },
  {
    id: "2",
    nik: "3201234567890002",
    name: "Siti Aminah",
    address: "Jl. Sudirman No. 45, Jakarta Selatan",
    birthDate: "1985-08-22",
    gender: "P",
    status: "verified",
    createdAt: "2026-04-09",
  },
  {
    id: "3",
    nik: "3201234567890003",
    name: "Budi Santoso",
    address: "Jl. Gatot Subroto No. 78, Jakarta Barat",
    birthDate: "1992-12-03",
    gender: "L",
    status: "approved",
    createdAt: "2026-04-08",
  },
  {
    id: "4",
    nik: "3201234567890004",
    name: "Dewi Lestari",
    address: "Jl. Thamrin No. 90, Jakarta Pusat",
    birthDate: "1988-03-17",
    gender: "P",
    status: "rejected",
    createdAt: "2026-04-07",
  },
  {
    id: "5",
    nik: "3201234567890005",
    name: "Rudi Hartono",
    address: "Jl. Kuningan No. 12, Jakarta Selatan",
    birthDate: "1995-07-28",
    gender: "L",
    status: "pending",
    createdAt: "2026-04-06",
  },
]

const statusConfig = {
  pending: {
    label: "Menunggu",
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
}

export default function KTPPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredData = mockData.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.nik.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col">
      <Header
        title="Data KTP"
        description="Kelola data Kartu Tanda Penduduk"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">K</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Menunggu</p>
                  <p className="text-2xl font-bold text-amber-600">45</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disetujui</p>
                  <p className="text-2xl font-bold text-emerald-600">1,156</p>
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
                  <p className="text-2xl font-bold text-red-600">33</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Daftar Pengajuan KTP</CardTitle>
              <Link href="/dashboard/ktp/pengajuan">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Pengajuan
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan NIK atau nama..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="verified">Terverifikasi</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NIK</TableHead>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead className="hidden md:table-cell">Alamat</TableHead>
                    <TableHead className="hidden lg:table-cell">Tanggal Lahir</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Tanggal Pengajuan</TableHead>
                    <TableHead className="w-[70px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((record) => {
                    const status = statusConfig[record.status]
                    const StatusIcon = status.icon
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono text-sm">
                          {record.nik}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {record.gender === "L" ? "Laki-laki" : "Perempuan"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden max-w-[200px] truncate md:table-cell">
                          {record.address}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {new Date(record.birthDate).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={status.className}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {new Date(record.createdAt).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Eye className="h-4 w-4" />
                                Lihat Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <Trash2 className="h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Info */}
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <p>Menampilkan {filteredData.length} dari {mockData.length} data</p>
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
