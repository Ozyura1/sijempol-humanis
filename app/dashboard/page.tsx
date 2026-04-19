"use client"

import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  CreditCard,
  Heart,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

const monthlyData = [
  { month: "Jan", ktp: 145, perkawinan: 32, kelahiran: 78 },
  { month: "Feb", ktp: 132, perkawinan: 28, kelahiran: 65 },
  { month: "Mar", ktp: 178, perkawinan: 41, kelahiran: 92 },
  { month: "Apr", ktp: 156, perkawinan: 35, kelahiran: 84 },
  { month: "Mei", ktp: 189, perkawinan: 45, kelahiran: 98 },
  { month: "Jun", ktp: 201, perkawinan: 52, kelahiran: 105 },
]

const statusData = [
  { name: "Menunggu", value: 45, fill: "hsl(var(--warning))" },
  { name: "Diproses", value: 78, fill: "hsl(var(--primary))" },
  { name: "Selesai", value: 234, fill: "hsl(var(--success))" },
  { name: "Ditolak", value: 12, fill: "hsl(var(--destructive))" },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Dashboard"
        description="Selamat datang di Sistem Administrasi Kependudukan"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Penduduk"
            value="1.234.567"
            icon={Users}
            variant="primary"
            trend={{ value: 2.5, isPositive: true }}
          />
          <StatsCard
            title="KTP Diproses"
            value="156"
            description="Bulan ini"
            icon={CreditCard}
            variant="success"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Menunggu Verifikasi"
            value="45"
            description="Perlu tindakan"
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Akta Terbit"
            value="892"
            description="Tahun ini"
            icon={FileCheck}
            variant="default"
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Statistik Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorKtp" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="colorPerkawinan" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--success))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--success))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ktp"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorKtp)"
                      name="KTP"
                    />
                    <Area
                      type="monotone"
                      dataKey="perkawinan"
                      stroke="hsl(var(--success))"
                      fillOpacity={1}
                      fill="url(#colorPerkawinan)"
                      name="Perkawinan"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Pengajuan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      type="number"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={80}
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
