"use client"

import Link from "next/link"
import Image from "next/image"
import {
  CreditCard,
  FileText,
  Heart,
  Baby,
  Users,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site/header"

const services = [
  {
    title: "KTP Elektronik",
    description: "Pengajuan atau surat tidak, ganti untuk Kartu Tanda Penduduk",
    icon: CreditCard,
    href: "/layanan/ktp",
  },
  {
    title: "Akta Kelahiran",
    description: "Pencatatan kelahiran baru untuk anak Anda dengan proses digital yang praktis",
    icon: Baby,
    href: "/layanan/kelahiran",
  },
  {
    title: "Akta Perkawinan",
    description: "Layanan pencatatan akta perkawinan untuk pembuatan bagi yang ingin menikah",
    icon: Heart,
    href: "/layanan/perkawinan",
  },
  {
    title: "Kartu Keluarga",
    description: "Pembuatan data proposit keluarga, pecah, IK, atau pemutihan baru",
    icon: Users,
    href: "/layanan/kk",
  },
  {
    title: "Akta Kematian",
    description: "Pengajuan akta kematian antar atau akta pelakak",
    icon: FileText,
    href: "/layanan/kematian",
  },
  {
    title: "Surat Pindah",
    description: "Layanan suraian sering Suran untuk wilayah lain",
    icon: FileText,
    href: "/layanan/pindah",
  },
]

const features = [
  {
    title: "Akses Mudah",
    description: "Layanan tersedia 24/7 dari perangkat apa pun tanpa perlu mengantri panjang",
    icon: Shield,
  },
  {
    title: "Data Aman",
    description: "Enkripsi untuk menjamin keamanan identitas kependudukan Anda",
    icon: Clock,
  },
  {
    title: "Verifikasi Cepat",
    description: "Sistem yang mempercepat proses pengajuan dokus administrasi",
    icon: CheckCircle2,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Shield className="h-4 w-4" />
                LAYANAN PUBLIC DIGITAL
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight lg:text-6xl">
                SiJempol
                <span className="block text-primary">Humanis</span>
              </h1>
              <p className="mt-6 text-pretty text-lg text-muted-foreground lg:text-xl">
                Nikmati kemudahan pengurusan dokumen kependudukan secara modern, transparan, dan tepat waktu langsunng dari genggaman Anda.
              </p>
              <div className="mt-10 flex flex-col items-start justify-start gap-4 sm:flex-row">
                <Link href="#layanan">
                  <Button size="lg" className="gap-2">
                    Mulai Sekarang
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <Image
                src="/gambardisdukcapil.jpeg"
                alt="Disdukcapil Service"
                width={500}
                height={500}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </section>

      {/* Features */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="layanan" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Layanan Kami</h2>
            <p className="mt-4 text-muted-foreground">
              Berbagai layanan administrasi kependudukan dan pencatatan sipil yang dapat Anda akses secara online
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.title} className="group transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary">
                    <service.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={service.href}>
                    <Button variant="link" className="gap-2 p-0">
                      Pelajari lebih lanjut
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Inovasi Pelayanan Publik untuk Warga Kota Tegal</h2>
            <p className="mt-4 text-muted-foreground">
              SiJempol Humanis adalah inisiatif unggulan dari Disdukcapil Kota Tegal untuk mendigitalisasi seluruh proses administrasi kependudukan. Kami menggunakan filosofi "Humanis" yang berarti melayani dengan empati, keramahan, dan kemudahan akses bagi seluruh lapisan masyarakat, memberikan hak identifikasi yang tidak lagi menunggu.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Visi Transparansi Tangan Pengurus Luar</h3>
              <p className="mt-2 text-sm text-muted-foreground">Kecepatan Layanan Berbasis SLA</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Kecepatan Layanan Berbasis SLA</h3>
              <p className="mt-2 text-sm text-muted-foreground">Kecepatan Layanan Berbasis SLA</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Integrasi Data Nasional yang Akurat</h3>
              <p className="mt-2 text-sm text-muted-foreground">Integrasi Data Nasional yang Akurat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontak" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Hubungi Kami</h2>
            <p className="mt-4 text-muted-foreground">
              Tim berikan kami siap membantuan Anda kapan pun Anda membutuhkan
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Telepon & WhatsApp</h3>
                <p className="mt-2 text-sm font-bold text-primary">0283343262</p>
                <p className="text-xs text-muted-foreground">Hubungi kami untuk bantuan terkait layanan</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Layanan Email</h3>
                <p className="mt-2 text-sm font-bold text-primary"> info@disdukcapiltegal.org</p>
                <p className="text-xs text-muted-foreground">Kirimkan saran atau pertanyaan via email elektronik</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Alamat Kantor</h3>
                <p className="mt-2 text-sm font-semibold">Jl. Lele No.14, Tegalsari, Kec. Tegal Bar., Kota Tegal, Jawa Tengah 52111</p>

              </CardContent>
            </Card>
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/hubungi-kami">
              <Button size="lg" className="gap-2">
                Hubungi Kami Lebih Lanjut
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <Image
                  src="/logosijempol.jpeg"
                  alt="SiJempol Humanis Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <span className="font-bold">SiJempol</span>
                  <p className="text-xs text-muted-foreground">Humanis</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Layanan Digital Administrasi Kependudukan Kota Tegal
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Layanan</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/layanan/ktp" className="hover:text-primary">KTP Elektronik</Link></li>
                <li><Link href="/layanan/kk" className="hover:text-primary">Kartu Keluarga</Link></li>
                <li><Link href="/layanan/kelahiran" className="hover:text-primary">Akta Kelahiran</Link></li>
                <li><Link href="/layanan/perkawinan" className="hover:text-primary">Akta Perkawinan</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Informasi</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="#tentang" className="hover:text-primary">Tentang Kami</Link></li>
                <li><Link href="#layanan" className="hover:text-primary">Layanan</Link></li>
                <li><Link href="#kontak" className="hover:text-primary">Kontak</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary">Kebijakan Privasi</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Syarat & Ketentuan</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SiJempol Humanis - Disdukcapil Kota Tegal. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
