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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
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
  Heart,
  Calendar,
  MapPin,
} from "lucide-react"

interface PerkawinanRecord {
  id: string
  groomNik: string
  groomName: string
  brideNik: string
  brideName: string
  marriageDate: string
  location: string
  status: "pending" | "verified" | "approved" | "rejected"
  createdAt: string
}

const mockData: PerkawinanRecord[] = [
  {
    id: "1",
    groomNik: "3201234567890001",
    groomName: "Ahmad Surya Wijaya",
    brideNik: "3201234567890010",
    brideName: "Siti Aminah",
    marriageDate: "2026-05-15",
    location: "KUA Kec. Menteng, Jakarta Pusat",
    status: "approved",
    createdAt: "2026-04-10",
  },
  {
    id: "2",
    groomNik: "3201234567890002",
    groomName: "Budi Santoso",
    brideNik: "3201234567890011",
    brideName: "Dewi Lestari",
    marriageDate: "2026-05-20",
    location: "KUA Kec. Kebayoran, Jakarta Selatan",
    status: "verified",
    createdAt: "2026-04-09",
  },
  {
    id: "3",
    groomNik: "3201234567890003",
    groomName: "Eko Prasetyo",
    brideNik: "3201234567890012",
    brideName: "Maya Sari",
    marriageDate: "2026-05-25",
    location: "KUA Kec. Cengkareng, Jakarta Barat",
    status: "pending",
    createdAt: "2026-04-08",
  },
  {
    id: "4",
    groomNik: "3201234567890004",
    groomName: "Rudi Hartono",
    brideNik: "3201234567890013",
    brideName: "Putri Ayu",
    marriageDate: "2026-05-30",
    location: "KUA Kec. Pulo Gadung, Jakarta Timur",
    status: "rejected",
    createdAt: "2026-04-07",
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

export default function PerkawinanPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredData = mockData.filter((record) => {
    const matchesSearch =
      record.groomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.brideName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.groomNik.includes(searchQuery) ||
      record.brideNik.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col">
      <Header
        title="Data Perkawinan"
        description="Kelola pencatatan perkawinan"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Perkawinan</p>
                  <p className="text-2xl font-bold">892</p>
                  <p className="text-xs text-muted-foreground">Tahun 2026</p>
                </div>
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Menunggu</p>
                  <p className="text-2xl font-bold text-amber-600">12</p>
                  <p className="text-xs text-muted-foreground">Perlu verifikasi</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bulan Ini</p>
                  <p className="text-2xl font-bold text-emerald-600">45</p>
                  <p className="text-xs text-muted-foreground">April 2026</p>
                </div>
                <Calendar className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Akta Terbit</p>
                  <p className="text-2xl font-bold text-blue-600">867</p>
                  <p className="text-xs text-muted-foreground">96.8% selesai</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Daftar Pencatatan Perkawinan</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Pencatatan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Tambah Pencatatan Perkawinan</DialogTitle>
                    <DialogDescription>
                      Masukkan data perkawinan yang akan dicatatkan
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm">Data Mempelai Pria</h4>
                        <FieldGroup>
                          <Field>
                            <FieldLabel>NIK</FieldLabel>
                            <Input placeholder="Masukkan NIK" />
                          </Field>
                          <Field>
                            <FieldLabel>Nama Lengkap</FieldLabel>
                            <Input placeholder="Masukkan nama lengkap" />
                          </Field>
                        </FieldGroup>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm">Data Mempelai Wanita</h4>
                        <FieldGroup>
                          <Field>
                            <FieldLabel>NIK</FieldLabel>
                            <Input placeholder="Masukkan NIK" />
                          </Field>
                          <Field>
                            <FieldLabel>Nama Lengkap</FieldLabel>
                            <Input placeholder="Masukkan nama lengkap" />
                          </Field>
                        </FieldGroup>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel>Tanggal Perkawinan</FieldLabel>
                        <Input type="date" />
                      </Field>
                      <Field>
                        <FieldLabel>Lokasi</FieldLabel>
                        <Input placeholder="Masukkan lokasi perkawinan" />
                      </Field>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Simpan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                    <TableHead>Mempelai Pria</TableHead>
                    <TableHead>Mempelai Wanita</TableHead>
                    <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                    <TableHead className="hidden lg:table-cell">Lokasi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[70px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((record) => {
                    const status = statusConfig[record.status]
                    const StatusIcon = status.icon
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.groomName}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {record.groomNik}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.brideName}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {record.brideNik}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(record.marriageDate).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="hidden max-w-[200px] truncate lg:table-cell">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="truncate">{record.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={status.className}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status.label}
                          </Badge>
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
