"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  CreditCard, 
  Heart, 
  Baby, 
  FileCheck, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  type: "ktp" | "perkawinan" | "kelahiran" | "kematian"
  title: string
  description: string
  status: "pending" | "verified" | "approved" | "rejected"
  timestamp: string
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "ktp",
    title: "Pengajuan KTP Baru",
    description: "Ahmad Surya - NIK: 3201xxxxxxxxx001",
    status: "pending",
    timestamp: "5 menit lalu",
  },
  {
    id: "2",
    type: "perkawinan",
    title: "Pencatatan Perkawinan",
    description: "Budi Santoso & Siti Aminah",
    status: "verified",
    timestamp: "15 menit lalu",
  },
  {
    id: "3",
    type: "kelahiran",
    title: "Akta Kelahiran",
    description: "Bayi Perempuan - Ibu: Dewi Lestari",
    status: "approved",
    timestamp: "1 jam lalu",
  },
  {
    id: "4",
    type: "ktp",
    title: "Perpanjangan KTP",
    description: "Rudi Hartono - NIK: 3201xxxxxxxxx045",
    status: "rejected",
    timestamp: "2 jam lalu",
  },
  {
    id: "5",
    type: "perkawinan",
    title: "Pencatatan Perkawinan",
    description: "Eko Prasetyo & Maya Sari",
    status: "approved",
    timestamp: "3 jam lalu",
  },
]

const typeIcons = {
  ktp: CreditCard,
  perkawinan: Heart,
  kelahiran: Baby,
  kematian: FileCheck,
}

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

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-4 pt-0">
            {mockActivities.map((activity) => {
              const TypeIcon = typeIcons[activity.type]
              const status = statusConfig[activity.status]
              const StatusIcon = status.icon

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <TypeIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <Badge
                        variant="secondary"
                        className={cn("shrink-0 gap-1", status.className)}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
