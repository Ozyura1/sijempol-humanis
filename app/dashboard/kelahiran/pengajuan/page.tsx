"use client"

import { SubmissionForm } from "@/components/forms/submission-form"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const kelahiranFields = [
  {
    name: "nama_anak",
    label: "Nama Anak",
    type: "text",
    required: true,
    placeholder: "Masukkan nama anak",
  },
  {
    name: "tanggal_lahir",
    label: "Tanggal Lahir",
    type: "date",
    required: true,
  },
  {
    name: "tempat_lahir",
    label: "Tempat Lahir",
    type: "text",
    required: true,
    placeholder: "Contoh: Rumah Sakit Umum",
  },
  {
    name: "jenis_kelamin",
    label: "Jenis Kelamin",
    type: "select",
    required: true,
    options: [
      { label: "Laki-laki", value: "L" },
      { label: "Perempuan", value: "P" },
    ],
  },
  {
    name: "nama_ayah",
    label: "Nama Ayah",
    type: "text",
    required: true,
    placeholder: "Nama lengkap ayah",
  },
  {
    name: "nik_ayah",
    label: "NIK Ayah",
    type: "text",
    required: true,
    placeholder: "16 digit NIK",
  },
  {
    name: "nama_ibu",
    label: "Nama Ibu",
    type: "text",
    required: true,
    placeholder: "Nama lengkap ibu",
  },
  {
    name: "nik_ibu",
    label: "NIK Ibu",
    type: "text",
    required: true,
    placeholder: "16 digit NIK",
  },
  {
    name: "berat_badan",
    label: "Berat Badan (gram)",
    type: "text",
    required: false,
    placeholder: "3000",
  },
  {
    name: "panjang_badan",
    label: "Panjang Badan (cm)",
    type: "text",
    required: false,
    placeholder: "50",
  },
  {
    name: "catatan",
    label: "Catatan Tambahan",
    type: "textarea",
    required: false,
    placeholder: "Tuliskan catatan apapun...",
  },
  {
    name: "dokumen_akta_lahir",
    label: "Dokumen Akta Lahir (PDF, JPG, PNG)",
    type: "file",
    required: false,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
  {
    name: "dokumen_kk",
    label: "Dokumen Kartu Keluarga (PDF, JPG, PNG)",
    type: "file",
    required: true,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
  {
    name: "dokumen_nik_ayah",
    label: "Dokumen NIK Ayah (PDF, JPG, PNG)",
    type: "file",
    required: true,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
  {
    name: "dokumen_nik_ibu",
    label: "Dokumen NIK Ibu (PDF, JPG, PNG)",
    type: "file",
    required: true,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
] as const

export default function KelahiranPengajuanPage() {
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
      const response = await fetch(`${API_URL}/births`, {
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
        message: "Pengajuan kelahiran berhasil dikirim! Silakan cek status pengajuan Anda di halaman submissions.",
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
        serviceName="kelahiran"
        serviceTitle="Pengajuan Akta Kelahiran"
        fields={kelahiranFields}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
