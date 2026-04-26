"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, Download, FileSearch } from "lucide-react"
import {
  buildSubmissionsCsv,
  dashboardServices,
  downloadTextFile,
  type DashboardSubmission,
} from "@/lib/dashboard-data"

interface QuickActionsProps {
  submissions?: DashboardSubmission[]
}

export function QuickActions({ submissions = [] }: QuickActionsProps) {
  const featuredActions = dashboardServices.slice(0, 4)

  const handleExport = () => {
    downloadTextFile("pengajuan-saya.csv", buildSubmissionsCsv(submissions))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {featuredActions.map((action, index) => (
            <Button
              key={action.createHref}
              asChild
              variant={index === 0 ? "default" : "outline"}
              className="h-auto w-full flex-col items-start gap-2 p-4 text-left"
            >
              <Link href={action.createHref}>
                <action.icon className="h-5 w-5" />
                <span className="font-medium">{action.shortLabel}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Buat pengajuan
                </span>
              </Link>
            </Button>
          ))}
        </div>

        <Button asChild variant="outline" className="mt-3 w-full justify-start gap-2">
          <Link href="/dashboard/status">
            <FileSearch className="h-4 w-4" />
            Cek Status Pengajuan
          </Link>
        </Button>

        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            Cetak
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="flex-1 gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
