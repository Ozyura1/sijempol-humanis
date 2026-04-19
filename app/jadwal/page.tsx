"use client"

import Link from "next/link"
import { Calendar, ArrowRight, MapPin, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAgenda } from "@/app/providers/agenda-provider"
import { useState } from "react"

export default function JadwalPage() {
  const { agendas } = useAgenda()
  const [selectedMonth, setSelectedMonth] = useState(new Date(2026, 4)) // May 2026

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const monthName = selectedMonth.toLocaleDateString("id-ID", { month: "long", year: "numeric" })

  const days = []
  const firstDay = firstDayOfMonth(selectedMonth)
  const totalDays = daysInMonth(selectedMonth)

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of month
  for (let i = 1; i <= totalDays; i++) {
    days.push(i)
  }

  const getAgendaForDate = (day: number) => {
    const dateStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return agendas.find((a) => a.tanggal === dateStr)
  }

  const handlePrevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))
  }

  const [selectedAgenda, setSelectedAgenda] = useState<string | null>(null)
  const selectedAgendaData = selectedAgenda ? agendas.find((a) => a.id === selectedAgenda) : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-lg font-bold">SiJempol</span>
            <span className="text-sm text-muted-foreground">Humanis</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/#layanan" className="hover:text-primary">Layanan</Link>
            <Link href="/#tentang" className="hover:text-primary">Tentang</Link>
            <Link href="/hubungi-kami" className="hover:text-primary">Kontak</Link>
            <Link href="/cek-status" className="text-primary font-semibold">Cek Jadwal</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Kalender Layanan Keliling</h1>
          <p className="text-muted-foreground">Pantau jadwal petugas Disdukcapil di wilayah Anda.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{monthName}</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevMonth}
                    >
                      ← 
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextMonth}
                    >
                      →
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["MIH", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"].map((day) => (
                    <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, index) => {
                    const agenda = day ? getAgendaForDate(day) : null
                    const isSelected = selectedAgenda && agenda?.id === selectedAgenda
                    const isRedDay = day && [19].includes(day) // Hari libur

                    return (
                      <div
                        key={index}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer transition-colors
                          ${!day ? "bg-transparent" : ""}
                          ${day && isRedDay ? "text-red-600" : ""}
                          ${day && !agenda ? "bg-muted hover:bg-muted/80" : ""}
                          ${agenda && isSelected ? "bg-primary text-primary-foreground" : ""}
                          ${agenda && !isSelected ? "bg-primary/20 hover:bg-primary/30 text-primary" : ""}
                        `}
                        onClick={() => {
                          if (agenda) {
                            setSelectedAgenda(agenda.id)
                          }
                        }}
                      >
                        {day && (
                          <div className="flex flex-col items-center justify-center h-full w-full">
                            <span>{day}</span>
                            {agenda && (
                              <span className="text-xs">●</span>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <div className="flex items-center gap-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary/20" />
                <span className="text-sm">Jadwal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 text-red-600" />
                <span className="text-sm">Libur</span>
              </div>
            </div>

            {/* Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-sm text-blue-900">
                  <strong>Informasi Penjadwalan:</strong> Jadwal dapat berubah sesuai/atas kondisi lapangan dan keterlibatan jaringan satu lokasi. Harap membaca dokumen persyaratan lengkap.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detail Jadwal Terdekat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedAgendaData ? (
                  <div className="space-y-4">
                    <div>
                      <Badge className="mb-2">{selectedAgendaData.tanggal}</Badge>
                      <h3 className="font-bold text-lg">{selectedAgendaData.title}</h3>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Jam</p>
                        <p className="font-semibold">{selectedAgendaData.jam}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Lokasi</p>
                        <p className="font-semibold text-sm">{selectedAgendaData.lokasi}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Kapasitas</p>
                        <p className="font-semibold">{selectedAgendaData.terdaftar}/{selectedAgendaData.kapasitas}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(selectedAgendaData.terdaftar / selectedAgendaData.kapasitas) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      Lihat Rincian Lokasi
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Klik tanggal di kalender untuk melihat detail jadwal
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-primary text-primary-foreground border-0">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-2">Butuh Layanan Urgent?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Gunakan fitur 'Lampur Bola' untuk asyanan prioritas lama dan disabilitas.
                </p>
                <Button variant="secondary" className="w-full" size="sm">
                  Ajukan Sekarang
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-r from-primary to-primary/80 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <h3 className="font-bold mb-2">SiJempol Humanis</h3>
              <p className="text-sm opacity-80">
                Sistem Jempol Permohonan Layanan Kependudukan yang Humanis, Melayani warga Kota Tegal dengan teknologi.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="/layanan/ktp" className="hover:opacity-100">Permohonan KTP-el</Link></li>
                <li><Link href="/layanan/kelahiran" className="hover:opacity-100">Akta Kelahiran</Link></li>
                <li><Link href="/layanan/perkawinan" className="hover:opacity-100">Akta Perkawinan</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="/" className="hover:opacity-100">FAQ</Link></li>
                <li><Link href="/" className="hover:opacity-100">Kebijakan Privasi</Link></li>
                <li><Link href="/" className="hover:opacity-100">Syarat & Ketentuan</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ikuti Kami</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Facebook</a></li>
                <li><a href="#" className="hover:opacity-100">Instagram</a></li>
                <li><a href="#" className="hover:opacity-100">Twitter/X</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-sm opacity-75">
            <p>&copy; 2026 Disdukcapil Kota Tegal. Melayani dengan Sepenuh Hati.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
