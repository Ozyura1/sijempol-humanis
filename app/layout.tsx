import type { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { AgendaProvider } from "./providers/agenda-provider"
import { AspirasiProvider } from "./providers/aspirasi-provider"
import { PageTransition } from "@/components/site/page-transition"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
})

export const metadata: Metadata = {
  title: "SiJempol Humanis - Layanan Kependudukan Digital",
  description: "Sistem Jempol Permohonan Layanan Kependudukan yang Humanis - Disdukcapil Kota Tegal",
  keywords: ["disdukcapil", "kependudukan", "ktp", "akta", "perkawinan", "pemerintah", "tegal"],
}

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <AgendaProvider>
          <AspirasiProvider>
            <PageTransition>{children}</PageTransition>
          </AspirasiProvider>
        </AgendaProvider>
      </body>
    </html>
  )
}
