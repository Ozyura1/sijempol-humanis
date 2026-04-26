"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, CheckCircle2, XCircle, AlertCircle, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate, getStatusLabel } from "@/lib/submission-utils"
import type { DashboardSubmission } from "@/lib/dashboard-data"

interface RecentActivityProps {
  submissions: DashboardSubmission[]
  loading?: boolean
}

const statusConfig = {
  pending: {
    icon: Clock,
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  verifying: {
    icon: AlertCircle,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  approved: {
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  rejected: {
    icon: XCircle,
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  completed: {
    icon: CheckCircle2,
    className: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
  },
  deleted: {
    icon: XCircle,
    className: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
  },
}

export function RecentActivity({ submissions, loading = false }: RecentActivityProps) {
  const recent = submissions.slice(0, 6)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Aktivitas Pengajuan Saya</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/submissions">Lihat semua</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-4 pt-0">
            {loading ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                Memuat aktivitas pengajuan...
              </div>
            ) : recent.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <Inbox className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium">Belum ada pengajuan</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Riwayat layanan Anda akan tampil di sini setelah pengajuan dikirim.
                </p>
              </div>
            ) : (
              recent.map((submission) => {
                const service = submission.serviceLabel
                const serviceIcon = submission.serviceShortLabel
                const status = statusConfig[submission.status] || statusConfig.pending
                const StatusIcon = status.icon

                return (
                  <Link
                    key={`${submission.service}-${submission.id}`}
                    href={`/dashboard/submissions/${submission.service}/${submission.id}`}
                    className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                      {serviceIcon}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium leading-none">
                          {service}
                        </p>
                        <Badge
                          variant="secondary"
                          className={cn("shrink-0 gap-1", status.className)}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {getStatusLabel(submission.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Nomor referensi {String(submission.id).padStart(4, "0")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(submission.updated_at || submission.created_at)}
                      </p>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
