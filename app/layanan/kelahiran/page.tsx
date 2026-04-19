"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AktaKelahiranPage() {
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
          <span className="text-foreground font-medium">Akta Kelahiran</span>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Akta Kelahiran</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Pencatatan kelahiran baru untuk anak Anda dengan proses digital yang praktis. Dapatkan akta kelahiran resmi dari pemerintah.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Deskripsi */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang Akta Kelahiran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Akta kelahiran adalah dokumen resmi yang membuktikan peristiwa kelahiran seseorang. Dokumen ini sangat penting untuk keperluan administratif, pendidikan, kesehatan, dan hukum.
                </p>
                <p>
                  Melalui sistem SiJempol Humanis, Anda dapat mencatatkan kelahiran anak dengan mudah tanpa repot mengantri. Proses pendaftaran dilakukan secara cepat dan dukungan penuh dari tim kami.
                </p>
              </CardContent>
            </Card>

            {/* Persyaratan */}
            <Card>
              <CardHeader>
                <CardTitle>Persyaratan</CardTitle>
                <CardDescription>Dokumen yang diperlukan untuk mencatatkan akta kelahiran</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Surat keterangan lahir dari rumah sakit/bidan",
                    "Fotokopi KTP kedua orang tua",
                    "Fotokopi Kartu Keluarga atau akta perkawinan orang tua",
                    "Buku nikah orang tua (jika tersedia)",
                    "Surat pernyataan dari RT/RW untuk kelahiran di rumah",
                    "Pas foto orang tua (jika diperlukan)",
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
                <CardDescription>Langkah-langkah pencatatan akta kelahiran</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { step: 1, title: "Registrasi Akun", desc: "Buat akun di sistem SiJempol Humanis" },
                  { step: 2, title: "Isi Data Anak", desc: "Lengkapi informasi lengkap tentang anak yang baru lahir" },
                  { step: 3, title: "Isi Data Orang Tua", desc: "Masukkan data lengkap kedua orang tua" },
                  { step: 4, title: "Upload Dokumen", desc: "Unggah semua dokumen persyaratan yang diperlukan" },
                  { step: 5, title: "Verifikasi Admin", desc: "Tim kami memverifikasi data dan dokumen Anda" },
                  { step: 6, title: "Cetak Akta", desc: "Akta kelahiran dicetak dan siap diambil" },
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
                    <p className="font-semibold">2-3 Hari Kerja</p>
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
                    <span className="text-muted-foreground">Pencatatan Kelahiran</span>
                    <span className="font-semibold">Gratis</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="space-y-3">
              <Link href="/jadwal" className="block">
                <Button className="w-full" size="lg">
                  Mulai Pengajuan
                </Button>
              </Link>
              <Link href="/jadwal" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Cek Status Pengajuan
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
