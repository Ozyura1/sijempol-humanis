"use client"

import { SubmissionForm } from "@/components/forms/submission-form"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const kkFields = [
  {
    name: "nama_kepala_keluarga",
    label: "Nama Kepala Keluarga",
    type: "text",
    required: true,
    placeholder: "Nama lengkap",
  },
  {
    name: "nik_kepala_keluarga",
    label: "NIK Kepala Keluarga",
    type: "text",
    required: true,
    placeholder: "16 digit NIK",
  },
  {
    name: "alamat",
    label: "Alamat Lengkap",
    type: "textarea",
    required: true,
    placeholder: "Jalan, No., Kelurahan, Kecamatan, Kabupaten, Provinsi",
  },
  {
    name: "jenis_pengajuan",
    label: "Jenis Pengajuan",
    type: "select",
    required: true,
    options: [
      { label: "Kartu Keluarga Baru", value: "baru" },
      { label: "Perubahan KK", value: "perubahan" },
      { label: "Duplikat KK", value: "duplikat" },
    ],
  },
  {
    name: "alasan_permohonan",
    label: "Alasan Permohonan",
    type: "textarea",
    required: false,
    placeholder: "Jelaskan alasan permohonan Anda",
  },
  {
    name: "jumlah_anggota_keluarga",
    label: "Jumlah Anggota Keluarga",
    type: "text",
    required: false,
    placeholder: "Contoh: 4",
  },
  {
    name: "catatan",
    label: "Catatan Tambahan",
    type: "textarea",
    required: false,
    placeholder: "Tuliskan catatan apapun...",
  },
  {
    name: "dokumen_kk_lama",
    label: "Dokumen KK Lama (PDF, JPG, PNG) - Jika ada",
    type: "file",
    required: false,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
  {
    name: "dokumen_nik_kepala_keluarga",
    label: "Dokumen NIK Kepala Keluarga (PDF, JPG, PNG)",
    type: "file",
    required: true,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
  {
    name: "dokumen_nik_anggota",
    label: "Dokumen NIK Anggota Keluarga (PDF, JPG, PNG)",
    type: "file",
    required: false,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
  {
    name: "dokumen_akta_lahir",
    label: "Dokumen Akta Lahir (PDF, JPG, PNG) - Jika ada",
    type: "file",
    required: false,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
]

export default function KkPengajuanPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  if (!isAuthenticated || user?.role !== "user") {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Anda harus login sebagai user untuk mengakses halaman ini.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const handleSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/family-cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          message: error.message || "Gagal mengirim pengajuan",
        }
      }

      const result = await response.json()
      return {
        success: true,
        message: "Pengajuan Kartu Keluarga berhasil dikirim! Silakan cek status pengajuan Anda di halaman submissions.",
        data: result,
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Terjadi kesalahan saat mengirim pengajuan",
      }
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <SubmissionForm
        serviceName="kk"
        serviceTitle="Pengajuan Kartu Keluarga"
        fields={kkFields}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
