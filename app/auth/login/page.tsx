"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    // If already authenticated and is user, redirect to dashboard
    if (isAuthenticated && user?.role === "user") {
      router.replace("/dashboard")
    } else {
      // Otherwise redirect to home page where login modal can be opened
      router.replace("/?login=true")
    }
  }, [isAuthenticated, user, router])

  // This page is just a redirect, so show nothing
  return null
}
