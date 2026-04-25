"use client"

import { SubmissionForm } from "@/components/forms/submission-form"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const kematianFields = [
  {
    name: "nama_almarhum",
    label: "Nama Almarhum/Almarhumah",
    type: "text",
    required: true,
    placeholder: "Nama lengkap",
  },
  {
    name: "nik_almarhum",
    label: "NIK Almarhum/Almarhumah",
    type: "text",
    required: true,
    placeholder: "16 digit NIK",
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
    required: false,
    placeholder: "Kota/Kabupaten",
  },
  {
    name: "tanggal_kematian",
    label: "Tanggal Kematian",
    type: "date",
    required: true,
  },
  {
    name: "tempat_kematian",
    label: "Tempat Kematian",
    type: "text",
    required: true,
    placeholder: "Rumah Sakit / Rumah / Jalan, dll",
  },
  {
    name: "penyebab_kematian",
    label: "Penyebab Kematian",
    type: "textarea",
    required: false,
    placeholder: "Jelaskan penyebab kematian",
  },
  {
    name: "nama_pelapor",
    label: "Nama Pelapor",
    type: "text",
    required: true,
    placeholder: "Nama keluarga yang melaporkan",
  },
  {
    name: "hubungan_pelapor",
    label: "Hubungan dengan Almarhum",
    type: "select",
    required: true,
    options: [
      { label: "Suami/Istri", value: "suami_istri" },
      { label: "Anak", value: "anak" },
      { label: "Orang Tua", value: "orang_tua" },
      { label: "Saudara", value: "saudara" },
      { label: "Lainnya", value: "lainnya" },
    ],
  },
  {
    name: "no_hp_pelapor",
    label: "No. HP Pelapor",
    type: "tel",
    required: true,
    placeholder: "08xxxxxxxxxx",
  },
  {
    name: "catatan",
    label: "Catatan Tambahan",
    type: "textarea",
    required: false,
    placeholder: "Tuliskan catatan apapun...",
  },
  {
    name: "dokumen_nik_almarhum",
    label: "Dokumen NIK Almarhum (PDF, JPG, PNG)",
    type: "file",
    required: true,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
  {
    name: "dokumen_nik_pelapor",
    label: "Dokumen NIK Pelapor (PDF, JPG, PNG)",
    type: "file",
    required: true,
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
    name: "dokumen_surat_medis",
    label: "Dokumen Surat Keterangan Medis (PDF, JPG, PNG)",
    type: "file",
    required: false,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
] as const

export default function KematianPengajuanPage() {
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
      const response = await fetch(`${API_URL}/deaths`, {
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
        message: "Pengajuan kematian berhasil dikirim! Silakan cek status pengajuan Anda di halaman submissions.",
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
        serviceName="kematian"
        serviceTitle="Pengajuan Akta Kematian"
        fields={kematianFields}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
