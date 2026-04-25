"use client"

import { SubmissionForm } from "@/components/forms/submission-form"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const pindahFields = [
  {
    name: "nik",
    label: "NIK Pemohon",
    type: "text",
    required: true,
    placeholder: "16 digit NIK",
  },
  {
    name: "nama_pemohon",
    label: "Nama Pemohon",
    type: "text",
    required: true,
    placeholder: "Nama lengkap",
  },
  {
    name: "tempat_lahir",
    label: "Tempat Lahir",
    type: "text",
    required: false,
    placeholder: "Kota/Kabupaten",
  },
  {
    name: "tanggal_lahir",
    label: "Tanggal Lahir",
    type: "date",
    required: false,
  },
  {
    name: "alamat_asal",
    label: "Alamat Asal (Saat Ini)",
    type: "textarea",
    required: true,
    placeholder: "Jalan, No., Kelurahan, Kecamatan, Kabupaten, Provinsi",
  },
  {
    name: "rt_rw_asal",
    label: "RT/RW Asal",
    type: "text",
    required: false,
    placeholder: "Contoh: 001/002",
  },
  {
    name: "alamat_tujuan",
    label: "Alamat Tujuan (Pindah ke)",
    type: "textarea",
    required: true,
    placeholder: "Jalan, No., Kelurahan, Kecamatan, Kabupaten, Provinsi",
  },
  {
    name: "kelurahan_tujuan",
    label: "Kelurahan Tujuan",
    type: "text",
    required: true,
    placeholder: "Nama kelurahan tujuan",
  },
  {
    name: "kecamatan_tujuan",
    label: "Kecamatan Tujuan",
    type: "text",
    required: true,
    placeholder: "Nama kecamatan tujuan",
  },
  {
    name: "kabupaten_tujuan",
    label: "Kabupaten/Kota Tujuan",
    type: "text",
    required: true,
    placeholder: "Nama kabupaten/kota tujuan",
  },
  {
    name: "provinsi_tujuan",
    label: "Provinsi Tujuan",
    type: "text",
    required: true,
    placeholder: "Nama provinsi tujuan",
  },
  {
    name: "alasan_pindah",
    label: "Alasan Pindah",
    type: "select",
    required: true,
    options: [
      { label: "Pekerjaan", value: "pekerjaan" },
      { label: "Pendidikan", value: "pendidikan" },
      { label: "Keluarga", value: "keluarga" },
      { label: "Memiliki Rumah Baru", value: "rumah_baru" },
      { label: "Lainnya", value: "lainnya" },
    ],
  },
  {
    name: "keterangan_lainnya",
    label: "Keterangan Lainnya",
    type: "textarea",
    required: false,
    placeholder: "Jelaskan lebih detail jika diperlukan",
  },
  {
    name: "tanggal_rencana_pindah",
    label: "Tanggal Rencana Pindah",
    type: "date",
    required: true,
  },
  {
    name: "catatan",
    label: "Catatan Tambahan",
    type: "textarea",
    required: false,
    placeholder: "Tuliskan catatan apapun...",
  },
  {
    name: "dokumen_nik",
    label: "Dokumen NIK (PDF, JPG, PNG)",
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
    name: "dokumen_surat_pindah",
    label: "Dokumen Surat Pindah (PDF, JPG, PNG) - Jika ada",
    type: "file",
    required: false,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
]

export default function PindahPengajuanPage() {
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
      const response = await fetch(`${API_URL}/moves`, {
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
        message: "Pengajuan pindah domisili berhasil dikirim! Silakan cek status pengajuan Anda di halaman submissions.",
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
        serviceName="pindah"
        serviceTitle="Pengajuan Pindah Domisili"
        fields={pindahFields}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
