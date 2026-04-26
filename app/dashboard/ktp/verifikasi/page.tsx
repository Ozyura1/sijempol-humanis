"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, FileText } from "lucide-react"

export default function VerifikasiPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle>Akses verifikasi dibatasi untuk admin</CardTitle>
          <CardDescription>
            Dashboard user tidak menampilkan antrean atau data verifikasi warga lain. Anda tetap dapat memantau pengajuan pribadi melalui halaman status.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/dashboard/status">
              <FileText className="h-4 w-4" />
              Status Pengajuan Saya
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/ktp">Riwayat KTP Saya</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
