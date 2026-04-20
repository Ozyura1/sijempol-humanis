"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AktaPerkawinanPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
          <h1 className="text-lg font-bold">SiJempol Humanis</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Beranda</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Akta Perkawinan</span>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Akta Perkawinan</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Layanan pencatatan akta perkawinan untuk pembuatan bagi yang ingin menikah. Dapatkan bukti resmi pernikahan Anda.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Deskripsi */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang Akta Perkawinan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Akta perkawinan adalah dokumen resmi yang dikeluarkan oleh Dinas Kependudukan dan Pencatatan Sipil sebagai bukti sahnya pernikahan Anda di hadapan hukum. Dokumen ini penting untuk berbagai keperluan administratif dan hukum.
                </p>
                <p>
                  Melalui sistem SiJempol Humanis, Anda dapat mencatatkan pernikahan Anda dengan prosedur yang mudah dan cepat. Tim kami siap membantu memberikan pelayanan terbaik untuk hari istimewa Anda.
                </p>
              </CardContent>
            </Card>

            {/* Persyaratan */}
            <Card>
              <CardHeader>
                <CardTitle>Persyaratan</CardTitle>
                <CardDescription>Dokumen yang diperlukan untuk pencatatan akta perkawinan</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Fotokopi KTP kedua mempelai",
                    "Fotokopi Kartu Keluarga kedua mempelai",
                    "Fotokopi akta kelahiran kedua mempelai",
                    "Surat undangan nikah atau surat keterangan dari RT/RW",
                    "Pas foto kedua mempelai (ukuran 2x3 atau 3x4)",
                    "Surat izin orang tua (jika masih berusia di bawah 21 tahun)",
                    "Surat cerai atau akta kematian pasangan sebelumnya (jika ada)",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Proses Pengajuan */}
            <Card>
              <CardHeader>
                <CardTitle>Proses Pengajuan</CardTitle>
                <CardDescription>Langkah-langkah pencatatan akta perkawinan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { step: 1, title: "Registrasi Akun", desc: "Buat akun di sistem SiJempol Humanis" },
                  { step: 2, title: "Isi Data Mempelai", desc: "Lengkapi data lengkap kedua calon pengantin" },
                  { step: 3, title: "Upload Dokumen", desc: "Unggah semua dokumen persyaratan yang diperlukan" },
                  { step: 4, title: "Verifikasi Admin", desc: "Tim kami memverifikasi kelengkapan dokumen" },
                  { step: 5, title: "Jadwalkan Pernikahan", desc: "Tentukan tanggal dan waktu upacara pernikahan" },
                  { step: 6, title: "Cetak Akta", desc: "Akta perkawinan dicetak dan siap diambil" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                      <span className="font-bold text-primary">{item.step}</span>
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Estimasi Waktu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Estimasi Waktu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Verifikasi</p>
                    <p className="font-semibold">3-5 Hari Kerja</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pencatatan</p>
                    <p className="font-semibold">1 Hari Kerja</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-semibold text-primary">7-10 Hari Kerja</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Biaya */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Biaya
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pencatatan Perkawinan</span>
                    <span className="font-semibold">Gratis</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}

          </div>
        </div>
      </main>
    </div>
  )
}
