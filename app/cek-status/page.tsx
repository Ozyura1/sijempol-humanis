"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Building2,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ArrowLeft,
  Printer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

interface StatusResult {
  found: boolean
  type: string
  referenceNumber: string
  applicantName: string
  status: "pending" | "verified" | "approved" | "rejected"
  statusMessage: string
  submittedDate: string
  lastUpdated: string
  timeline: {
    date: string
    status: string
    description: string
    completed: boolean
  }[]
}

const mockResult: StatusResult = {
  found: true,
  type: "Pengajuan KTP Baru",
  referenceNumber: "KTP/2026/04/00123",
  applicantName: "Ahmad Surya Wijaya",
  status: "verified",
  statusMessage: "Dokumen telah diverifikasi, menunggu persetujuan kepala dinas",
  submittedDate: "2026-04-05",
  lastUpdated: "2026-04-10",
  timeline: [
    {
      date: "2026-04-05",
      status: "Pengajuan Diterima",
      description: "Permohonan berhasil disubmit ke sistem",
      completed: true,
    },
    {
      date: "2026-04-07",
      status: "Verifikasi Dokumen",
      description: "Dokumen sedang diverifikasi oleh petugas",
      completed: true,
    },
    {
      date: "2026-04-10",
      status: "Persetujuan",
      description: "Menunggu persetujuan kepala dinas",
      completed: false,
    },
    {
      date: "-",
      status: "Cetak KTP",
      description: "KTP dalam proses cetak",
      completed: false,
    },
    {
      date: "-",
      status: "Siap Diambil",
      description: "KTP siap untuk diambil di kantor Disdukcapil",
      completed: false,
    },
  ],
}

const statusConfig = {
  pending: {
    label: "Menunggu",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  verified: {
    label: "Terverifikasi",
    icon: AlertCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  approved: {
    label: "Disetujui",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  rejected: {
    label: "Ditolak",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
}

export default function CekStatusPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"nik" | "reference">("reference")
  const [result, setResult] = useState<StatusResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setNotFound(false)
    setResult(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (searchQuery.length > 5) {
      setResult(mockResult)
    } else {
      setNotFound(true)
    }

    setIsSearching(false)
  }

  const status = result ? statusConfig[result.status] : null
  const StatusIcon = status?.icon

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold">JEBOL</span>
              <span className="ml-2 text-sm text-muted-foreground">Disdukcapil</span>
            </div>
          </Link>

          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Cek Status Pengajuan</h1>
            <p className="mt-2 text-muted-foreground">
              Lacak status permohonan layanan kependudukan Anda
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Masukkan Data Pencarian</CardTitle>
              <CardDescription>
                Gunakan nomor referensi atau NIK untuk melacak status pengajuan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={searchType} onValueChange={(v) => setSearchType(v as "nik" | "reference")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="reference">Nomor Referensi</TabsTrigger>
                  <TabsTrigger value="nik">NIK</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSearch} className="mt-6">
                  <TabsContent value="reference" className="mt-0">
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Nomor Referensi</FieldLabel>
                        <Input
                          placeholder="Contoh: KTP/2026/04/00123"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </Field>
                    </FieldGroup>
                  </TabsContent>

                  <TabsContent value="nik" className="mt-0">
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Nomor Induk Kependudukan (NIK)</FieldLabel>
                        <Input
                          placeholder="Masukkan 16 digit NIK"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          maxLength={16}
                        />
                      </Field>
                    </FieldGroup>
                  </TabsContent>

                  <Button type="submit" className="mt-4 w-full gap-2" disabled={isSearching}>
                    {isSearching ? (
                      <>Mencari...</>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        Cek Status
                      </>
                    )}
                  </Button>
                </form>
              </Tabs>
            </CardContent>
          </Card>

          {/* Not Found */}
          {notFound && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Tidak Ditemukan</AlertTitle>
              <AlertDescription>
                Data pengajuan tidak ditemukan. Pastikan nomor referensi atau NIK yang Anda masukkan sudah benar.
              </AlertDescription>
            </Alert>
          )}

          {/* Result */}
          {result && status && StatusIcon && (
            <div className="space-y-6">
              {/* Status Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${status.bgColor}`}>
                      <StatusIcon className={`h-6 w-6 ${status.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={status.bgColor}>
                          {status.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Update terakhir: {new Date(result.lastUpdated).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <h2 className="mt-2 text-xl font-semibold">{result.statusMessage}</h2>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detail Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Detail Pengajuan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Jenis Pengajuan</dt>
                      <dd className="mt-1 font-medium">{result.type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Nomor Referensi</dt>
                      <dd className="mt-1 font-mono font-medium">{result.referenceNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Nama Pemohon</dt>
                      <dd className="mt-1 font-medium">{result.applicantName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Tanggal Pengajuan</dt>
                      <dd className="mt-1 font-medium">
                        {new Date(result.submittedDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Timeline Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {result.timeline.map((item, index) => (
                      <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
                        {/* Line */}
                        {index !== result.timeline.length - 1 && (
                          <div
                            className={`absolute left-[15px] top-8 h-full w-0.5 ${
                              item.completed ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        )}
                        {/* Dot */}
                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                            item.completed
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted bg-background"
                          }`}
                        >
                          {item.completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <p className="font-medium">{item.status}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2">
                  <Printer className="h-4 w-4" />
                  Cetak Bukti
                </Button>
                <Button className="flex-1">Hubungi Petugas</Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} JEBOL - Dinas Kependudukan dan Pencatatan Sipil</p>
      </footer>
    </div>
  )
}
