"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowLeft, Calendar, User, FileText, Loader2, Download } from "lucide-react"
import { getStatusBadgeColor, getStatusLabel, getServiceLabel, formatDate, getServiceApiEndpoint } from "@/lib/submission-utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function SubmissionDetailPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [submission, setSubmission] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const service = params.service as string
  const id = params.id as string

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "user") {
      router.push("/dashboard/login")
      return
    }

    if (service && id) {
      fetchSubmission()
    }
  }, [isAuthenticated, user, service, id])

  const fetchSubmission = async () => {
    try {
      setLoading(true)
      setError("")
      const token = localStorage.getItem("access_token")
      const endpoint = getServiceApiEndpoint(service)

      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Pengajuan tidak ditemukan")
      }

      const data = await response.json()
      setSubmission(data)
    } catch (err: any) {
      setError(err.message || "Gagal memuat detail pengajuan")
    } finally {
      setLoading(false)
    }
  }

  const renderField = (value: any, key: string) => {
    if (!value) return null
    if (typeof value === "object") {
      if (key.includes("dokumen") || key.includes("document")) {
        // This is a document (Base64)
        return (
          <a
            href={value}
            download={key}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 underline"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </a>
        )
      }
      return JSON.stringify(value)
    }
    return String(value)
  }

  const getFieldLabel = (key: string) => {
    const labels: Record<string, string> = {
      nik: "NIK",
      nama_lengkap: "Nama Lengkap",
      nama_anak: "Nama Anak",
      nama_ayah: "Nama Ayah",
      nama_ibu: "Nama Ibu",
      tanggal_lahir: "Tanggal Lahir",
      tempat_lahir: "Tempat Lahir",
      jenis_kelamin: "Jenis Kelamin",
      agama: "Agama",
      alamat: "Alamat",
      rt_rw: "RT/RW",
      kelurahan: "Kelurahan",
      kecamatan: "Kecamatan",
      kabupaten: "Kabupaten",
      provinsi: "Provinsi",
      status_perkawinan: "Status Perkawinan",
      pekerjaan: "Pekerjaan",
      kode_pos: "Kode Pos",
      catatan: "Catatan Tambahan",
    }
    return labels[key] || key.replace(/_/g, " ").charAt(0).toUpperCase() + key.replace(/_/g, " ").slice(1)
  }

  if (!isAuthenticated || user?.role !== "user") {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Anda harus login sebagai user untuk mengakses halaman ini.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali
      </Button>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : submission ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{getServiceLabel(service)}</CardTitle>
                  <p className="text-gray-600">ID: {submission.id}</p>
                </div>
                <Badge className={`${getStatusBadgeColor(submission.status)} text-base px-4 py-2`}>
                  {getStatusLabel(submission.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Tanggal Pengajuan
                  </div>
                  <p className="text-lg font-semibold">{formatDate(submission.created_at)}</p>
                </div>

                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <User className="h-4 w-4 mr-2" />
                    Nama Pemohon
                  </div>
                  <p className="text-lg font-semibold">{submission.applicant_name}</p>
                </div>

                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Tanggal Update
                  </div>
                  <p className="text-lg font-semibold">{formatDate(submission.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Data Pengajuan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(submission.data || {}).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-gray-700">{getFieldLabel(key)}</label>
                    <p className="mt-1 text-gray-900 break-words">{renderField(value, key)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {submission.documents && Object.keys(submission.documents).length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Dokumen Pendukung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(submission.documents).map(([key, value]: [string, any]) => (
                    <div
                      key={key}
                      className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{getFieldLabel(key)}</p>
                        <p className="text-sm text-gray-600">File dokumen</p>
                      </div>
                      <a
                        href={value}
                        download={key}
                        className="inline-flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 underline"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {submission.rejection_reason && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900">Alasan Penolakan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-800">{submission.rejection_reason}</p>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}
    </div>
  )
}
