"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react"
import { getStatusBadgeColor, getStatusLabel, formatDate } from "@/lib/submission-utils"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function VerifikasiPage() {
  const { isAuthenticated, accessToken } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }
    fetchSubmissions()
  }, [isAuthenticated, accessToken])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/id-cards?limit=100`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      })

      if (response.status === 401) {
        router.push("/auth/login")
        return
      }

      if (!response.ok) {
        throw new Error("Gagal memuat data")
      }

      const data = await response.json()
      const submissions = Array.isArray(data) ? data : data.data || []
      
      // Filter submissions that need verification
      const pendingSubmissions = submissions.filter(
        (sub: any) => sub.status === "pending" || sub.status === "verifying"
      )
      
      setSubmissions(pendingSubmissions)
    } catch (err: any) {
      setError(err.message || "Gagal memuat pengajuan")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Verifikasi KTP</h1>
        <p className="text-gray-600 mt-2">
          Daftar pengajuan KTP yang menunggu verifikasi Anda
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4 opacity-50" />
            <p className="text-gray-600 text-lg">Semua pengajuan KTP sudah diverifikasi</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/dashboard">Kembali ke Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission: any) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{submission.applicant_name}</h3>
                      <Badge className={getStatusBadgeColor(submission.status)}>
                        {getStatusLabel(submission.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Pengajuan: {formatDate(submission.created_at)}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">No. Referensi:</span>
                        <p className="font-medium">{submission.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <p className="font-medium">{getStatusLabel(submission.status)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button asChild variant="outline" className="gap-2">
                    <Link href={`/dashboard/submissions/id-cards/${submission.id}`}>
                      Lihat Detail
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {submissions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Menunggu Review</p>
                  <p className="text-2xl font-bold">
                    {submissions.filter((s: any) => s.status === "pending").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sedang Diverifikasi</p>
                  <p className="text-2xl font-bold">
                    {submissions.filter((s: any) => s.status === "verifying").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pengajuan</p>
                  <p className="text-2xl font-bold">{submissions.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
