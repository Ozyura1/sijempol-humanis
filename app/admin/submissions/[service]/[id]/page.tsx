"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Loader2,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Send,
} from "lucide-react"
import {
  getStatusBadgeColor,
  getStatusLabel,
  getServiceLabel,
  formatDate,
  getServiceApiEndpoint,
} from "@/lib/submission-utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function AdminSubmissionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [submission, setSubmission] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionInput, setShowRejectionInput] = useState(false)

  const service = params.service as string
  const id = params.id as string

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_access_token")
    if (!adminToken) {
      router.push("/admin/login")
      return
    }

    if (service && id) {
      fetchSubmission()
    }
  }, [service, id])

  const fetchSubmission = async () => {
    try {
      setLoading(true)
      setError("")
      const token = localStorage.getItem("admin_access_token")
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

  const handleStatusChange = async (newStatus: string, reason?: string) => {
    if (!submission) return

    try {
      setActionLoading(true)
      setError("")
      const token = localStorage.getItem("admin_access_token")
      const endpoint = getServiceApiEndpoint(service)

      let url = `${API_URL}/${endpoint}/${id}/status`
      const body: any = { status: newStatus }

      // If rejecting, use the reject endpoint
      if (newStatus === "rejected") {
        url = `${API_URL}/${endpoint}/${id}/reject`
        body.rejection_reason = reason || rejectionReason
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Gagal mengubah status")
      }

      const updated = await response.json()
      setSubmission(updated)
      setShowRejectionInput(false)
      setRejectionReason("")
    } catch (err: any) {
      setError(err.message || "Gagal mengubah status")
    } finally {
      setActionLoading(false)
    }
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

  const renderField = (value: any) => {
    if (!value) return "-"
    if (typeof value === "object") return JSON.stringify(value)
    return String(value)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Pengajuan tidak ditemukan</AlertDescription>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Data Pengajuan */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Data Pengajuan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(submission.data || {}).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-gray-700">{getFieldLabel(key)}</label>
                    <p className="mt-1 text-gray-900 break-words">{renderField(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dokumen */}
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

          {/* Alasan Penolakan */}
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
        </div>

        {/* Approval Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Workflow Persetujuan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {submission.status === "pending" && (
                <Button
                  onClick={() => handleStatusChange("verifying")}
                  disabled={actionLoading}
                  className="w-full"
                  variant="outline"
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Mulai Verifikasi
                </Button>
              )}

              {submission.status === "verifying" && (
                <>
                  <Button
                    onClick={() => handleStatusChange("approved")}
                    disabled={actionLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                    Setujui
                  </Button>

                  {!showRejectionInput && (
                    <Button
                      onClick={() => setShowRejectionInput(true)}
                      disabled={actionLoading}
                      className="w-full"
                      variant="destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Tolak
                    </Button>
                  )}

                  {showRejectionInput && (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Masukkan alasan penolakan..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="text-sm"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleStatusChange("rejected", rejectionReason)}
                          disabled={actionLoading || !rejectionReason}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          size="sm"
                        >
                          {actionLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
                          Kirim Penolakan
                        </Button>
                        <Button
                          onClick={() => {
                            setShowRejectionInput(false)
                            setRejectionReason("")
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {submission.status === "approved" && (
                <Button
                  onClick={() => handleStatusChange("completed")}
                  disabled={actionLoading}
                  className="w-full"
                  variant="outline"
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Tandai Selesai
                </Button>
              )}

              {submission.status === "rejected" && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Pengajuan ditolak. Pemohon dapat membuat pengajuan baru.</AlertDescription>
                </Alert>
              )}

              {submission.status === "completed" && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Pengajuan telah selesai.</AlertDescription>
                </Alert>
              )}

              <div className="my-4 border-t"></div>

              <div className="text-sm">
                <p className="font-medium mb-2 text-gray-900">Status Timeline</p>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="text-blue-600">✓</div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">Dibuat</p>
                      <p className="text-xs text-gray-600">{formatDate(submission.created_at)}</p>
                    </div>
                  </div>

                  {(submission.status === "verifying" ||
                    submission.status === "approved" ||
                    submission.status === "rejected" ||
                    submission.status === "completed") && (
                    <div className="flex gap-2">
                      <div className={submission.status === "rejected" ? "text-red-600" : "text-blue-600"}>
                        {submission.status === "rejected" ? "✗" : "✓"}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">
                          {submission.status === "rejected" ? "Ditolak" : "Diverifikasi"}
                        </p>
                        <p className="text-xs text-gray-600">{formatDate(submission.updated_at)}</p>
                      </div>
                    </div>
                  )}

                  {(submission.status === "approved" || submission.status === "completed") && (
                    <div className="flex gap-2">
                      <div className="text-green-600">✓</div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">Disetujui</p>
                        <p className="text-xs text-gray-600">{formatDate(submission.updated_at)}</p>
                      </div>
                    </div>
                  )}

                  {submission.status === "completed" && (
                    <div className="flex gap-2">
                      <div className="text-gray-600">✓</div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">Selesai</p>
                        <p className="text-xs text-gray-600">{formatDate(submission.updated_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
