"use client"

import Link from "next/link"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, FileText, ShieldCheck } from "lucide-react"

export default function IKDPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Statistik Kependudukan"
        description="Akses data agregat kependudukan dibatasi untuk petugas berwenang"
      />

      <div className="flex-1 p-6">
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle>Data kependudukan lintas warga tidak tersedia di dashboard user</CardTitle>
            <CardDescription>
              Untuk menjaga privasi dan mencegah penyalahgunaan, halaman user hanya menampilkan ringkasan pengajuan milik akun Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button asChild>
              <Link href="/dashboard/laporan">
                <BarChart3 className="h-4 w-4" />
                Lihat Laporan Saya
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/status">
                <FileText className="h-4 w-4" />
                Cek Status Pengajuan
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
