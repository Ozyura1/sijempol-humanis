"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Phone, Mail, MapPin, Instagram, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { useAspirasi } from "@/app/providers/aspirasi-provider"
import { SiteHeader } from "@/components/site/header"

export default function HubungiKamiPage() {
  const { addAspirasi } = useAspirasi()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Tambah aspirasi ke context
    addAspirasi({
      nama: formData.name,
      email: formData.email,
      pesan: formData.message,
      tanggal: new Date().toISOString().split('T')[0],
    })

    // Reset form dan tampilkan pesan sukses
    setFormData({
      name: "",
      email: "",
      message: "",
    })
    setSubmitted(true)

    // Hilangkan pesan sukses setelah 5 detik
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-4 text-sm uppercase tracking-wider opacity-75">LAYANAN RESPONSIF</div>
          <h1 className="text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Kami siap mendengarkan aspirasi dan membantu kebutuhan administrasi kependudukan Anda dengan sepenuh hati.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-primary">Kirim Pesan</CardTitle>
              <CardDescription>Tinggalkan pesan Anda di bawah ini, tim kami akan merespons dalam 1×24 jam kerja.</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted && (
                <Alert className="mb-4 bg-emerald-50 border-emerald-200">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-800">
                    Pesan Anda telah berhasil dikirim! Tim kami akan segera merespons.
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Nama Lengkap</label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Masukkan nama lengkap Anda"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Alamat Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="contoh@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Pesan</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tuliskan pertanyaan atau aspirasi Anda secara detail..."
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Kirim Pesan
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6" id="informasi-kontak">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Telepon CS</h4>
                    <p className="text-primary font-bold">0283343262</p>
                    <p className="text-xs text-muted-foreground">Senin - Jumat: 08:00 - 16:00 WIB</p>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Instagram className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Instagram</h4>
                    <p className="text-primary font-bold">@disdukcapiltegal</p>
                    <p className="text-xs text-muted-foreground">Update layanan & informasi terbaru</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email Resmi</h4>
                    <p className="text-primary font-bold">info@disdukcapiltegal.org</p>
                    <p className="text-xs text-muted-foreground">Kami akan merespons dalam 1×24 jam</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Lokasi Kantor</h4>
                    <p className="font-semibold text-sm">Jl. Lele No.14, Tegalsari, Kec. Tegal Bar., Kota Tegal, Jawa Tengah 52111</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardContent className="pt-6">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Lokasi Kantor Disdukcapil Tegal"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.272280512856!2d109.12842990000001!3d-6.8579337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb9b828481605%3A0xe1b9994599edb6e1!2sDinas%20Kependudukan%20Dan%20Pencatatan%20Sipil!5e0!3m2!1sid!2sid!4v1776574624702!5m2!1sid!2sid"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
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
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <span className="text-sm font-bold">SJ</span>
                </div>
                <div>
                  <h3 className="font-bold">SiJempol Humanis</h3>
                </div>
              </div>
              <p className="text-sm opacity-80">
                Inovasi pelayanan kependudukan Kota Tegal yang cepat, terpercaya, dan memberikan hak identifikasi.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Navigasi</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="/#layanan" className="hover:opacity-100">Layanan</Link></li>
                <li><Link href="/cek-status" className="hover:opacity-100">Cek Jadwal</Link></li>
                <li><Link href="/#tentang" className="hover:opacity-100">Tentang Kami</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="/" className="hover:opacity-100">Bantuan</Link></li>
                <li><Link href="/faq" className="hover:opacity-100">FAQ</Link></li>
                <li><Link href="/" className="hover:opacity-100">Kebijakan Privasi</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ikuti Kami</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="https://www.facebook.com/share/18BgFUKYgv/" className="hover:opacity-100">Facebook</a></li>
                <li><a href="https://www.instagram.com/disdukkotategal?igsh=MWlyMXhlbzVhdzF2dw==" className="hover:opacity-100">Instagram</a></li>
                <li><a href="https://x.com/DisdukKotaTegal?s=20" className="hover:opacity-100">Twitter/X</a></li>
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
