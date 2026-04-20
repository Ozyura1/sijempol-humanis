"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [currentPath, setCurrentPath] = useState(pathname)

  useEffect(() => {
    setCurrentPath(pathname)
  }, [pathname])

  return (
    <main
      key={currentPath}
      className={cn(
        "min-h-screen",
        "animate-in fade-in duration-300 ease-out",
        "motion-safe:transition-opacity motion-safe:ease-out"
      )}
    >
      {children}
    </main>
  )
}
