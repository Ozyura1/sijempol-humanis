"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function KartuKeluargaPage() {
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
          <span className="text-foreground font-medium">Kartu Keluarga</span>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Kartu Keluarga</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Pembuatan data proposit keluarga, pecah, IK, atau pemutihan baru. Layanan penuh dari registrasi hingga pengambilan dokumen.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Deskripsi */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang Kartu Keluarga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Kartu Keluarga (KK) adalah dokumen resmi yang diterbitkan oleh Dinas Kependudukan dan Pencatatan Sipil yang berisi data tentang susunan keluarga dan hubungan keluarga. Dokumen ini sangat penting untuk berbagai keperluan administrasi.
                </p>
                <p>
                  Melalui sistem SiJempol Humanis, Anda dapat membuat kartu keluarga baru, mengubah, atau melakukan perubahan data keluarga dengan mudah dan cepat tanpa perlu mengurus secara manual di kantor.
                </p>
              </CardContent>
            </Card>

            {/* Persyaratan */}
            <Card>
              <CardHeader>
                <CardTitle>Persyaratan</CardTitle>
                <CardDescription>Dokumen yang diperlukan untuk membuat atau mengubah Kartu Keluarga</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Fotokopi KTP kepala keluarga",
                    "Fotokopi Kartu Keluarga lama (jika ada perubahan)",
                    "Fotokopi akta kelahiran anggota keluarga (untuk yang baru)",
                    "Surat keterangan dari RT/RW",
                    "Akta perkawinan (jika ada perubahan status perkawinan)",
                    "Surat cerai atau akta kematian (jika ada perubahan keluarga)",
                    "Pas foto kepala keluarga (jika diperlukan)",
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
                <CardDescription>Langkah-langkah membuat atau mengubah Kartu Keluarga</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { step: 1, title: "Registrasi Akun", desc: "Buat akun di sistem SiJempol Humanis" },
                  { step: 2, title: "Isi Data Keluarga", desc: "Lengkapi data lengkap semua anggota keluarga" },
                  { step: 3, title: "Upload Dokumen", desc: "Unggah semua dokumen persyaratan yang diperlukan" },
                  { step: 4, title: "Verifikasi Admin", desc: "Tim kami memverifikasi data dan dokumen Anda" },
                  { step: 5, title: "Persetujuan", desc: "Dokumen Anda disetujui setelah verifikasi selesai" },
                  { step: 6, title: "Pengambilan", desc: "Ambil Kartu Keluarga di kantor sesuai jadwal" },
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
                    <p className="font-semibold">1-2 Hari Kerja</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cetak</p>
                    <p className="font-semibold">2-3 Hari Kerja</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-semibold text-primary">3-7 Hari Kerja</p>
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
                    <span className="text-muted-foreground">Pembuatan KK Baru</span>
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
