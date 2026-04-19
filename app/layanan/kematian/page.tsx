"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AktaKematianPage() {
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
          <span className="text-foreground font-medium">Akta Kematian</span>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Akta Kematian</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Pengajuan akta kematian antar atau akta pelakak. Dokumen resmi untuk peristiwa kematian seseorang.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Deskripsi */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang Akta Kematian</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Akta kematian adalah dokumen resmi yang diterbitkan oleh Dinas Kependudukan dan Pencatatan Sipil sebagai pencatatan peristiwa kematian. Dokumen ini penting untuk berbagai keperluan administratif, warisan, asuransi, dan hukum.
                </p>
                <p>
                  Melalui sistem SiJempol Humanis, Anda dapat mengajukan pencatatan kematian dengan mudah dan cepat. Tim kami memahami sensitivitas situasi dan memberikan pelayanan yang profesional dan berempati.
                </p>
              </CardContent>
            </Card>

            {/* Persyaratan */}
            <Card>
              <CardHeader>
                <CardTitle>Persyaratan</CardTitle>
                <CardDescription>Dokumen yang diperlukan untuk pencatatan akta kematian</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Surat keterangan kematian dari rumah sakit atau tenaga medis",
                    "Fotokopi KTP almarhum/almarhumah",
                    "Fotokopi Kartu Keluarga",
                    "Fotokopi akta kelahiran almarhum/almarhumah",
                    "Surat pernyataan dari keluarga atau RT/RW",
                    "Fotokopi KTP saksi pelapor",
                    "Dokumen pernikahan (jika almarhum/almarhumah telah menikah)",
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
                <CardDescription>Langkah-langkah pencatatan akta kematian</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { step: 1, title: "Registrasi Akun", desc: "Buat akun di sistem SiJempol Humanis" },
                  { step: 2, title: "Isi Data Almarhum", desc: "Lengkapi data lengkap orang yang meninggal" },
                  { step: 3, title: "Isi Data Pelapor", desc: "Masukkan data pelapor (keluarga terdekat)" },
                  { step: 4, title: "Upload Dokumen", desc: "Unggah semua dokumen keterangan kematian" },
                  { step: 5, title: "Verifikasi Admin", desc: "Tim kami memverifikasi dokumen dan data" },
                  { step: 6, title: "Cetak Akta", desc: "Akta kematian dicetak dan siap diambil" },
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
                    <span className="text-muted-foreground">Pencatatan Kematian</span>
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
