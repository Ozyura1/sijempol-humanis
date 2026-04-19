"use client"

import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  CreditCard,
  Heart,
  Baby,
  FileText,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
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
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts"

const monthlyTrendData = [
  { month: "Jan", ktp: 145, kelahiran: 78, perkawinan: 32, kematian: 12 },
  { month: "Feb", ktp: 132, kelahiran: 65, perkawinan: 28, kematian: 15 },
  { month: "Mar", ktp: 178, kelahiran: 92, perkawinan: 41, kematian: 11 },
  { month: "Apr", ktp: 156, kelahiran: 84, perkawinan: 35, kematian: 18 },
  { month: "Mei", ktp: 189, kelahiran: 98, perkawinan: 45, kematian: 14 },
  { month: "Jun", ktp: 201, kelahiran: 105, perkawinan: 52, kematian: 16 },
]

const demographicData = [
  { name: "0-14 tahun", value: 245678, color: "hsl(var(--chart-1))" },
  { name: "15-64 tahun", value: 789456, color: "hsl(var(--chart-2))" },
  { name: "65+ tahun", value: 199433, color: "hsl(var(--chart-3))" },
]

const genderData = [
  { name: "Laki-laki", value: 618234, color: "hsl(var(--primary))" },
  { name: "Perempuan", value: 616333, color: "hsl(212 95% 68%)" },
]

const districtData = [
  { district: "Jakarta Pusat", population: 234567, ktp: 198234 },
  { district: "Jakarta Utara", population: 312456, ktp: 278943 },
  { district: "Jakarta Barat", population: 287654, ktp: 245678 },
  { district: "Jakarta Selatan", population: 298765, ktp: 267890 },
  { district: "Jakarta Timur", population: 356789, ktp: 312456 },
]

export default function IKDPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Indeks Kependudukan Daerah"
        description="Statistik dan analisis data kependudukan"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Filter Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Select defaultValue="2026">
              <SelectTrigger className="w-[120px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Wilayah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Wilayah</SelectItem>
                <SelectItem value="pusat">Jakarta Pusat</SelectItem>
                <SelectItem value="utara">Jakarta Utara</SelectItem>
                <SelectItem value="barat">Jakarta Barat</SelectItem>
                <SelectItem value="selatan">Jakarta Selatan</SelectItem>
                <SelectItem value="timur">Jakarta Timur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Laporan
          </Button>
        </div>

        {/* Main Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Penduduk</p>
                  <p className="mt-1 text-3xl font-bold">1.234.567</p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-emerald-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>+2.5%</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">KTP Terbit</p>
                  <p className="mt-1 text-3xl font-bold">1.156.234</p>
                  <p className="mt-2 text-sm text-muted-foreground">93.6% coverage</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Kelahiran</p>
                  <p className="mt-1 text-3xl font-bold">522</p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-emerald-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>+12.3%</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Baby className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Perkawinan</p>
                  <p className="mt-1 text-3xl font-bold">233</p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                    <ArrowDownRight className="h-4 w-4" />
                    <span>-3.2%</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Kematian</p>
                  <p className="mt-1 text-3xl font-bold">86</p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-emerald-600">
                    <ArrowDownRight className="h-4 w-4" />
                    <span>-8.1%</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <Tabs defaultValue="trend" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trend">Tren Bulanan</TabsTrigger>
            <TabsTrigger value="demographic">Demografi</TabsTrigger>
            <TabsTrigger value="district">Per Wilayah</TabsTrigger>
          </TabsList>

          <TabsContent value="trend" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Tren Layanan per Bulan</CardTitle>
                  <CardDescription>Perbandingan jumlah layanan tahun 2026</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyTrendData}>
                        <defs>
                          <linearGradient id="colorKTP" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorKelahiran" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
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
                          fill="url(#colorKTP)"
                          name="KTP"
                        />
                        <Area
                          type="monotone"
                          dataKey="kelahiran"
                          stroke="hsl(var(--success))"
                          fillOpacity={1}
                          fill="url(#colorKelahiran)"
                          name="Kelahiran"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Perkawinan & Kematian</CardTitle>
                  <CardDescription>Tren 6 bulan terakhir</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="perkawinan"
                          stroke="hsl(330 80% 60%)"
                          strokeWidth={2}
                          dot={{ fill: "hsl(330 80% 60%)" }}
                          name="Perkawinan"
                        />
                        <Line
                          type="monotone"
                          dataKey="kematian"
                          stroke="hsl(var(--muted-foreground))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--muted-foreground))" }}
                          name="Kematian"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demographic" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Komposisi Usia</CardTitle>
                  <CardDescription>Distribusi penduduk berdasarkan kelompok usia</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={demographicData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {demographicData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Komposisi Jenis Kelamin</CardTitle>
                  <CardDescription>Distribusi penduduk berdasarkan jenis kelamin</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {genderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="district" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data per Wilayah</CardTitle>
                <CardDescription>Perbandingan jumlah penduduk dan KTP terbit per wilayah</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis
                        dataKey="district"
                        type="category"
                        width={120}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => value.toLocaleString("id-ID")}
                      />
                      <Legend />
                      <Bar
                        dataKey="population"
                        fill="hsl(var(--primary))"
                        name="Total Penduduk"
                        radius={[0, 4, 4, 0]}
                      />
                      <Bar
                        dataKey="ktp"
                        fill="hsl(var(--success))"
                        name="KTP Terbit"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
