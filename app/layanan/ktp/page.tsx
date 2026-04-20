"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function KTPElektronikPage() {
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
          <span className="text-foreground font-medium">KTP Elektronik</span>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">KTP Elektronik</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Pengajuan atau surat tidak, ganti untuk Kartu Tanda Penduduk. Dapatkan KTP elektronik Anda dengan mudah melalui sistem digital kami.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Deskripsi */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang KTP Elektronik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  KTP Elektronik (e-KTP) adalah identitas resmi yang dikeluarkan oleh pemerintah melalui Dinas Kependudukan dan Pencatatan Sipil. Dokumen ini berlaku seumur hidup dan memiliki fitur keamanan tingkat tinggi.
                </p>
                <p>
                  Melalui sistem SiJempol Humanis, Anda dapat mengajukan KTP baru, perpanjangan, atau penggantian tanpa perlu repot datang ke kantor. Proses verifikasi dilakukan secara otomatis dan transparan.
                </p>
              </CardContent>
            </Card>

            {/* Persyaratan */}
            <Card>
              <CardHeader>
                <CardTitle>Persyaratan</CardTitle>
                <CardDescription>Dokumen yang diperlukan untuk mengajukan KTP Elektronik</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Surat keterangan lahir atau akta kelahiran",
                    "Surat keterangan status perkawinan (jika ada perubahan)",
                    "Pas foto ukuran 2x3 (berwarna atau hitam putih)",
                    "Fotokopi Kartu Keluarga",
                    "Dokumen identitas sebelumnya (jika ada)",
                    "Surat rujukan dari kelurahan/desa (untuk KTP pertama kali)",
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
                <CardDescription>Langkah-langkah pengajuan KTP Elektronik</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { step: 1, title: "Registrasi Akun", desc: "Buat akun di sistem SiJempol Humanis dengan data pribadi Anda" },
                  { step: 2, title: "Isi Formulir", desc: "Lengkapi formulir pengajuan dengan data yang sesuai dengan dokumen asli" },
                  { step: 3, title: "Upload Dokumen", desc: "Unggah semua dokumen persyaratan dalam format PDF atau gambar" },
                  { step: 4, title: "Verifikasi Admin", desc: "Tim kami akan memverifikasi dokumen Anda dalam 1-3 hari kerja" },
                  { step: 5, title: "Proses Cetak", desc: "Jika disetujui, kartu akan dicetak dan siap untuk pengambilan" },
                  { step: 6, title: "Pengambilan", desc: "Ambil KTP elektronik Anda di kantor Disdukcapil sesuai jadwal yang ditentukan" },
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
                    <p className="font-semibold">1-3 Hari Kerja</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cetak</p>
                    <p className="font-semibold">3-5 Hari Kerja</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-semibold text-primary">5-10 Hari Kerja</p>
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
                    <span className="text-muted-foreground">Administrasi</span>
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
