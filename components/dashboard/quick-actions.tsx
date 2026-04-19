"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  FileSearch, 
  Printer, 
  Download,
  UserPlus,
  Heart,
  Baby,
  FileText
} from "lucide-react"

const actions = [
  {
    title: "Pengajuan KTP",
    description: "Buat pengajuan KTP baru",
    icon: UserPlus,
    href: "/dashboard/ktp/pengajuan",
    variant: "default" as const,
  },
  {
    title: "Cek Status",
    description: "Lacak status pengajuan",
    icon: FileSearch,
    href: "/dashboard/status",
    variant: "outline" as const,
  },
  {
    title: "Akta Perkawinan",
    description: "Pencatatan perkawinan",
    icon: Heart,
    href: "/dashboard/perkawinan/pengajuan",
    variant: "outline" as const,
  },
  {
    title: "Akta Kelahiran",
    description: "Daftarkan kelahiran",
    icon: Baby,
    href: "/dashboard/kelahiran",
    variant: "outline" as const,
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button
                variant={action.variant}
                className="h-auto w-full flex-col items-start gap-2 p-4 text-left"
              >
                <action.icon className="h-5 w-5" />
                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs font-normal text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Button>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="secondary" size="sm" className="flex-1 gap-2">
            <Printer className="h-4 w-4" />
            Cetak Laporan
          </Button>
          <Button variant="secondary" size="sm" className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
