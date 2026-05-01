"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Daftar SiJempol</CardTitle>
          <CardDescription>Buat akun dengan verifikasi OTP email</CardDescription>
        </CardHeader>
        <RegisterForm successRedirect="/auth/login?registered=true" />
      </Card>
    </div>
  )
}
