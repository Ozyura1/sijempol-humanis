"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserLoginForm } from "@/components/auth/user-login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { X } from "lucide-react"

export function AuthModalWrapper() {
  const searchParams = useSearchParams()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [defaultTab, setDefaultTab] = useState<"login" | "register">("login")

  useEffect(() => {
    // Open modal if login=true in URL params
    if (searchParams.get("login") === "true") {
      setShowAuthModal(true)
      setDefaultTab("login")
    }
    if (searchParams.get("register") === "true") {
      setShowAuthModal(true)
      setDefaultTab("register")
    }
  }, [searchParams])

  if (!showAuthModal) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md relative">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-1 hover:bg-muted rounded"
        >
          <X className="h-5 w-5" />
        </button>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Masuk</TabsTrigger>
            <TabsTrigger value="register">Daftar</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <UserLoginForm onSuccess={() => setShowAuthModal(false)} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm onSuccess={() => setShowAuthModal(false)} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
