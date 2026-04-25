"use client"

import Link from "next/link"
import { ChevronDown, HelpCircle, Mail, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SiteHeader } from "@/components/site/header"
import { useState } from "react"

const faqData = [
  {
    question: "Apa itu SiJempol Humanis?",
    answer: "SiJempol Humanis adalah sistem digital untuk permohonan layanan kependudukan yang dikembangkan oleh Disdukcapil Kota Tegal. Sistem ini memudahkan warga dalam mengajukan berbagai dokumen kependudukan secara online tanpa perlu datang ke kantor."
  },
  {
    question: "Layanan apa saja yang tersedia di SiJempol Humanis?",
    answer: "Kami menyediakan layanan pengajuan KTP Elektronik, Akta Kelahiran, Akta Kematian, Akta Perkawinan, Kartu Keluarga, dan Surat Pindah. Semua layanan dapat diajukan secara online melalui sistem kami."
  },
  {
    question: "Bagaimana cara mendaftar akun?",
    answer: "Untuk mendaftar akun, klik tombol 'Daftar' di halaman utama, isi formulir pendaftaran dengan data diri yang valid, dan verifikasi email Anda. Setelah itu, Anda dapat login dan mulai mengajukan layanan."
  },
  {
    question: "Berapa lama proses verifikasi pengajuan?",
    answer: "Proses verifikasi biasanya memakan waktu 1-3 hari kerja. Anda akan menerima notifikasi melalui email dan aplikasi ketika pengajuan Anda telah diverifikasi. Untuk layanan tertentu, waktu proses mungkin lebih lama tergantung kompleksitas dokumen."
  },
  {
    question: "Apakah ada biaya untuk menggunakan layanan ini?",
    answer: "Layanan SiJempol Humanis sepenuhnya gratis. Namun, biaya administrasi untuk pembuatan dokumen kependudukan tetap berlaku sesuai dengan ketentuan yang berlaku dan akan dibayarkan saat pengambilan dokumen."
  },
  {
    question: "Dokumen apa saja yang perlu disiapkan?",
    answer: "Dokumen yang diperlukan bervariasi tergantung jenis layanan. Secara umum, Anda perlu menyiapkan KTP, Kartu Keluarga, akta nikah (jika ada), dan dokumen pendukung lainnya. Detail persyaratan dapat dilihat di halaman masing-masing layanan."
  },
  {
    question: "Bagaimana cara melacak status pengajuan?",
    answer: "Anda dapat melacak status pengajuan melalui dashboard akun Anda di menu 'Riwayat Pengajuan'. Status akan terupdate secara real-time dari 'Pending', 'Dalam Proses', 'Disetujui', hingga 'Selesai'."
  },
  {
    question: "Apa yang harus dilakukan jika pengajuan ditolak?",
    answer: "Jika pengajuan ditolak, Anda akan menerima notifikasi dengan alasan penolakan. Perbaiki dokumen yang bermasalah sesuai petunjuk, lalu ajukan ulang. Tim kami siap membantu melalui kontak yang tersedia."
  },
  {
    question: "Apakah data pribadi saya aman?",
    answer: "Ya, keamanan data adalah prioritas utama kami. Semua data dienkripsi dan disimpan dengan standar keamanan tinggi. Kami hanya menggunakan data untuk keperluan proses layanan dan tidak membagikannya ke pihak ketiga tanpa izin Anda."
  },
  {
    question: "Bagaimana cara menghubungi dukungan teknis?",
    answer: "Anda dapat menghubungi dukungan teknis melalui email support@sijempolhumanis.go.id, telepon (0283) 123456, atau WhatsApp di nomor yang tersedia. Tim kami siap membantu 24/7."
  },
  {
    question: "Apakah sistem ini dapat diakses di perangkat mobile?",
    answer: "Ya, sistem SiJempol Humanis responsif dan dapat diakses melalui browser di perangkat mobile, tablet, dan desktop. Kami juga sedang mengembangkan aplikasi mobile untuk kemudahan akses."
  },
  {
    question: "Bagaimana jika saya lupa password?",
    answer: "Klik 'Lupa Password' di halaman login, masukkan email Anda, dan ikuti instruksi yang dikirim ke email. Pastikan email yang Anda gunakan masih aktif dan dapat diakses."
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">Pertanyaan Umum (FAQ)</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Temukan jawaban atas pertanyaan yang sering ditanyakan tentang layanan SiJempol Humanis.
            Jika pertanyaan Anda tidak terjawab di sini, jangan ragu untuk menghubungi kami.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* FAQ Content */}
          <div className="lg:col-span-2 space-y-4">
            {faqData.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <Collapsible
                  open={openItems.includes(index)}
                  onOpenChange={() => toggleItem(index)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardTitle className="text-left flex items-center justify-between text-lg">
                        {faq.question}
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            openItems.includes(index) ? "rotate-180" : ""
                          }`}
                        />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Butuh Bantuan?
                </CardTitle>
                <CardDescription>
                  Tidak menemukan jawaban yang Anda cari?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">support@sijempolhumanis.go.id</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Telepon</p>
                      <p className="text-sm text-muted-foreground">(0283) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">+62 812-3456-7890</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  <Link href="/hubungi-kami" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Hubungi Kami
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Tautan Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/jadwal" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    📅 Cek Jadwal Layanan
                  </Button>
                </Link>
                <Link href="/layanan/ktp" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    🆔 Ajukan KTP Elektronik
                  </Button>
                </Link>
                <Link href="/layanan/kelahiran" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    👶 Ajukan Akta Kelahiran
                  </Button>
                </Link>
                <Link href="/hubungi-kami" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    💬 Kirim Aspirasi
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Pembaruan FAQ</h4>
                    <p className="text-sm text-blue-800">
                      FAQ ini diperbarui secara berkala sesuai dengan perkembangan layanan dan pertanyaan pengguna.
                    </p>
                  </div>
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
                <li><Link href="/faq" className="hover:opacity-100">FAQ</Link></li>
                <li><Link href="/privacy" className="hover:opacity-100">Kebijakan Privasi</Link></li>
                <li><Link href="/terms" className="hover:opacity-100">Syarat & Ketentuan</Link></li>
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