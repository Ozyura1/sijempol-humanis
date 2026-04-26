"use client"

import { SubmissionForm } from "@/components/forms/submission-form"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { readApiErrorMessage } from "@/lib/api-response"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const perkawinanFields = [
  {
    name: "nik_suami",
    label: "NIK Calon Suami",
    type: "text",
    required: true,
    placeholder: "16 digit NIK",
  },
  {
    name: "nama_suami",
    label: "Nama Lengkap Calon Suami",
    type: "text",
    required: true,
    placeholder: "Nama lengkap",
  },
  {
    name: "tempat_lahir_suami",
    label: "Tempat Lahir Suami",
    type: "text",
    required: true,
    placeholder: "Kota",
  },
  {
    name: "tanggal_lahir_suami",
    label: "Tanggal Lahir Suami",
    type: "date",
    required: true,
  },
  {
    name: "agama_suami",
    label: "Agama Suami",
    type: "select",
    required: true,
    options: [
      { label: "Islam", value: "islam" },
      { label: "Kristen", value: "kristen" },
      { label: "Katolik", value: "katolik" },
      { label: "Hindu", value: "hindu" },
      { label: "Buddha", value: "buddha" },
      { label: "Konghucu", value: "konghucu" },
    ],
  },
  {
    name: "pekerjaan_suami",
    label: "Pekerjaan Suami",
    type: "text",
    required: false,
    placeholder: "Jenis pekerjaan",
  },
  {
    name: "nik_istri",
    label: "NIK Calon Istri",
    type: "text",
    required: true,
    placeholder: "16 digit NIK",
  },
  {
    name: "nama_istri",
    label: "Nama Lengkap Calon Istri",
    type: "text",
    required: true,
    placeholder: "Nama lengkap",
  },
  {
    name: "tempat_lahir_istri",
    label: "Tempat Lahir Istri",
    type: "text",
    required: true,
    placeholder: "Kota",
  },
  {
    name: "tanggal_lahir_istri",
    label: "Tanggal Lahir Istri",
    type: "date",
    required: true,
  },
  {
    name: "agama_istri",
    label: "Agama Istri",
    type: "select",
    required: true,
    options: [
      { label: "Islam", value: "islam" },
      { label: "Kristen", value: "kristen" },
      { label: "Katolik", value: "katolik" },
      { label: "Hindu", value: "hindu" },
      { label: "Buddha", value: "buddha" },
      { label: "Konghucu", value: "konghucu" },
    ],
  },
  {
    name: "pekerjaan_istri",
    label: "Pekerjaan Istri",
    type: "text",
    required: false,
    placeholder: "Jenis pekerjaan",
  },
  {
    name: "tanggal_perkawinan",
    label: "Tanggal Perkawinan",
    type: "date",
    required: true,
  },
  {
    name: "tempat_perkawinan",
    label: "Tempat Perkawinan",
    type: "text",
    required: true,
    placeholder: "Alamat tempat perkawinan",
  },
  {
    name: "nama_wali_nikah",
    label: "Nama Wali Nikah",
    type: "text",
    required: false,
    placeholder: "Nama wali nikah (jika ada)",
  },
  {
    name: "nama_saksi_1",
    label: "Nama Saksi 1",
    type: "text",
    required: true,
    placeholder: "Nama saksi pertama",
  },
  {
    name: "nik_saksi_1",
    label: "NIK Saksi 1",
    type: "text",
    required: true,
    placeholder: "16 digit NIK",
  },
  {
    name: "nama_saksi_2",
    label: "Nama Saksi 2",
    type: "text",
    required: true,
    placeholder: "Nama saksi kedua",
  },
  {
    name: "nik_saksi_2",
    label: "NIK Saksi 2",
    type: "text",
    required: true,
    placeholder: "16 digit NIK",
  },
  {
    name: "catatan",
    label: "Catatan Tambahan",
    type: "textarea",
    required: false,
    placeholder: "Tuliskan catatan apapun...",
  },
  {
    name: "dokumen_nik_suami",
    label: "Dokumen NIK Suami (PDF, JPG, PNG)",
    type: "file",
    required: true,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
  {
    name: "dokumen_nik_istri",
    label: "Dokumen NIK Istri (PDF, JPG, PNG)",
    type: "file",
    required: true,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
  {
    name: "dokumen_kk_suami",
    label: "Dokumen KK Suami (PDF, JPG, PNG)",
    type: "file",
    required: true,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
  {
    name: "dokumen_kk_istri",
    label: "Dokumen KK Istri (PDF, JPG, PNG)",
    type: "file",
    required: true,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
  {
    name: "dokumen_akta_lahir_suami",
    label: "Dokumen Akta Lahir Suami (PDF, JPG, PNG)",
    type: "file",
    required: false,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
  {
    name: "dokumen_akta_lahir_istri",
    label: "Dokumen Akta Lahir Istri (PDF, JPG, PNG)",
    type: "file",
    required: false,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
  {
    name: "dokumen_surat_pengantar",
    label: "Dokumen Surat Pengantar (PDF, JPG, PNG)",
    type: "file",
    required: false,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
] as const

export default function PerkawinanPengajuanPage() {
  const { isAuthenticated, user } = useAuth()

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
      const response = await fetch(`${API_URL}/marriages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        return {
          success: false,
          message: await readApiErrorMessage(response, "Gagal mengirim pengajuan"),
        }
      }

      const result = await response.json()
      return {
        success: true,
        message: "Pengajuan perkawinan berhasil dikirim! Silakan cek status pengajuan Anda di halaman submissions.",
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
        serviceName="perkawinan"
        serviceTitle="Pengajuan Akta Perkawinan"
        fields={perkawinanFields}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
