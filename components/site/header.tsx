"use client"

import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ArrowRight, Menu } from "lucide-react"

const navItems = [
  { label: "Layanan", href: "/#layanan" },
  { label: "Tentang", href: "/#tentang" },
  { label: "Kontak", href: "/hubungi-kami" },
  { label: "Cek Jadwal", href: "/jadwal" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logosijempol.jpeg"
            alt="SiJempol Humanis Logo"
            width={40}
            height={40}
            className="rounded-lg"
            priority
          />
          <div>
            <span className="text-lg font-bold">SiJempol</span>
            <span className="ml-2 text-sm text-muted-foreground">Humanis</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input text-foreground transition hover:bg-muted lg:hidden"
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="fixed inset-y-0 left-0 z-50 w-full max-w-xs rounded-none border-r border-border bg-background p-6 shadow-2xl overflow-y-auto transition-transform duration-300 ease-out transform-gpu translate-x-0 data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full data-[state=open]:animate-in data-[state=closed]:animate-out sm:rounded-r-3xl">
            <div className="flex items-center gap-3">
              <Image
                src="/logosijempol.jpeg"
                alt="SiJempol Humanis Logo"
                width={32}
                height={32}
                className="rounded-lg"
                priority
              />
              <div>
                <p className="text-base font-semibold">SiJempol</p>
                <p className="text-sm text-muted-foreground">Humanis</p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {navItems.map((item) => (
                <DialogClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-foreground transition hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                </DialogClose>
              ))}
            </div>

            <div className="mt-8">
              <DialogClose asChild>
                <Link
                  href="/jadwal"
                  className="flex items-center justify-between rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Mulai Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
