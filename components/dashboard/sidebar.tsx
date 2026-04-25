"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Heart,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Kependudukan",
    icon: Users,
    children: [
      { name: "Data KTP", href: "/dashboard/ktp" },
      { name: "Pengajuan Baru", href: "/dashboard/ktp/pengajuan" },
      { name: "Verifikasi", href: "/dashboard/ktp/verifikasi" },
    ],
  },
  {
    name: "Pencatatan Sipil",
    icon: FileText,
    children: [
      { name: "Perkawinan", href: "/dashboard/perkawinan" },
      { name: "Akta Kelahiran", href: "/dashboard/kelahiran" },
      { name: "Akta Kematian", href: "/dashboard/kematian" },
    ],
  },
  {
    name: "IKD",
    href: "/dashboard/ikd",
    icon: CreditCard,
  },
  {
    name: "Laporan",
    href: "/dashboard/laporan",
    icon: FileText,
  },
]

const adminNavigation = [
  {
    name: "Pengaturan",
    href: "/dashboard/pengaturan",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [openItems, setOpenItems] = useState<string[]>(["Kependudukan", "Pencatatan Sipil"])

  const toggleItem = (name: string) => {
    setOpenItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    )
  }

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <Image
          src="/logosijempol.jpeg"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">JEBOL</span>
          <span className="text-xs text-sidebar-foreground/60">Disdukcapil</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          Menu Utama
        </div>
        {navigation.map((item) =>
          item.children ? (
            <Collapsible
              key={item.name}
              open={openItems.includes(item.name)}
              onOpenChange={() => toggleItem(item.name)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openItems.includes(item.name) && "rotate-180"
                    )}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pl-11 pt-1">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm transition-colors",
                      pathname === child.href
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    {child.name}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        )}

        {user?.role === "admin" && (
          <>
            <div className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Administrasi
            </div>
            {adminNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{user?.name || "Administrator"}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              {user?.role?.replace("_", " ") || "User"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Keluar</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}
