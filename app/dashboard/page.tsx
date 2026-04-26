"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Clock, FileCheck, Inbox, ShieldCheck } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useAuth } from "@/contexts/auth-context"
import {
  createStatusCounts,
  dashboardServices,
  fetchUserSubmissions,
  type DashboardSubmission,
} from "@/lib/dashboard-data"

const chartColors = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
  "hsl(var(--muted-foreground))",
  "hsl(212 95% 68%)",
]

export default function DashboardPage() {
  const { isAuthenticated, accessToken, user } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<DashboardSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    const load = async () => {
      try {
        setLoading(true)
        setError("")
        const token = accessToken || localStorage.getItem("access_token")
        if (!token) {
          router.push("/auth/login")
          return
        }
        setSubmissions(await fetchUserSubmissions(token))
      } catch (err: any) {
        setError(err.message || "Gagal memuat dashboard")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isAuthenticated, accessToken, router])

  const statusCounts = useMemo(() => createStatusCounts(submissions), [submissions])

  const serviceData = useMemo(
    () =>
      dashboardServices.map((service) => ({
        name: service.shortLabel,
        total: submissions.filter((item) => item.service === service.value).length,
      })),
    [submissions]
  )

  const thisMonth = useMemo(() => {
    const now = new Date()
    return submissions.filter((item) => {
      const createdAt = new Date(item.created_at)
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
    }).length
  }, [submissions])

  const nextAction = submissions.find((item) => item.status === "rejected") || submissions.find((item) => item.status === "pending")

  return (
    <div className="flex flex-col">
      <Header
        title="Dashboard"
        description={`Selamat datang${user?.name ? `, ${user.name}` : ""}. Data yang tampil hanya pengajuan akun Anda.`}
      />

      <div className="flex-1 space-y-6 p-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Pengajuan Saya"
            value={loading ? "..." : submissions.length.toString()}
            description="Total riwayat layanan"
            icon={Inbox}
            variant="primary"
          />
          <StatsCard
            title="Bulan Ini"
            value={loading ? "..." : thisMonth.toString()}
            description="Pengajuan baru"
            icon={FileCheck}
            variant="success"
          />
          <StatsCard
            title="Dalam Proses"
            value={loading ? "..." : (statusCounts.pending + statusCounts.verifying).toString()}
            description="Menunggu petugas"
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Selesai/Disetujui"
            value={loading ? "..." : (statusCounts.approved + statusCounts.completed).toString()}
            description="Siap ditindaklanjuti"
            icon={CheckCircle2}
            variant="default"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Ringkasan Layanan Saya</CardTitle>
              <CardDescription>
                Agregasi personal berdasarkan pengajuan akun ini, tanpa menampilkan data warga lain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis allowDecimals={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]} name="Pengajuan">
                      {serviceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Keamanan Data</CardTitle>
              <CardDescription>Informasi pribadi dibatasi untuk pemilik akun dan admin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/40 p-4">
                <ShieldCheck className="mb-3 h-8 w-8 text-primary" />
                <p className="text-sm font-medium">Mode privasi aktif</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Dashboard ini tidak menampilkan nama, NIK, alamat, atau dokumen milik warga lain.
                </p>
              </div>
              {nextAction ? (
                <Button asChild className="w-full">
                  <Link href={`/dashboard/submissions/${nextAction.service}/${nextAction.id}`}>
                    Tinjau pengajuan terbaru
                  </Link>
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/dashboard/ktp/pengajuan">Mulai pengajuan KTP</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity submissions={submissions} loading={loading} />
          </div>
          <QuickActions submissions={submissions} />
        </div>
      </div>
    </div>
  )
}
