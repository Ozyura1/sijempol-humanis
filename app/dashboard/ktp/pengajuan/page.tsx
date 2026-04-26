"use client"

import { SubmissionForm } from "@/components/forms/submission-form"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { readApiErrorMessage } from "@/lib/api-response"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const ktpFields = [
  {
    name: "nik",
    label: "NIK",
    type: "text",
    required: true,
    placeholder: "16 digit NIK",
  },
  {
    name: "nama_lengkap",
    label: "Nama Lengkap",
    type: "text",
    required: true,
    placeholder: "Sesuai dokumen resmi",
  },
  {
    name: "tempat_lahir",
    label: "Tempat Lahir",
    type: "text",
    required: true,
    placeholder: "Kota kelahiran",
  },
  {
    name: "tanggal_lahir",
    label: "Tanggal Lahir",
    type: "date",
    required: true,
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
    name: "alamat",
    label: "Alamat Lengkap",
    type: "textarea",
    required: true,
    placeholder: "Jalan, Nomor, RT/RW",
  },
  {
    name: "rt_rw",
    label: "RT/RW",
    type: "text",
    required: false,
    placeholder: "Contoh: 001/002",
  },
  {
    name: "kelurahan",
    label: "Kelurahan",
    type: "text",
    required: true,
    placeholder: "Nama kelurahan",
  },
  {
    name: "kecamatan",
    label: "Kecamatan",
    type: "text",
    required: true,
    placeholder: "Nama kecamatan",
  },
  {
    name: "kabupaten",
    label: "Kabupaten/Kota",
    type: "text",
    required: true,
    placeholder: "Nama kabupaten/kota",
  },
  {
    name: "provinsi",
    label: "Provinsi",
    type: "text",
    required: true,
    placeholder: "Nama provinsi",
  },
  {
    name: "kode_pos",
    label: "Kode Pos",
    type: "text",
    required: false,
    placeholder: "5 digit kode pos",
  },
  {
    name: "agama",
    label: "Agama",
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
    name: "status_perkawinan",
    label: "Status Perkawinan",
    type: "select",
    required: true,
    options: [
      { label: "Belum Kawin", value: "belum_kawin" },
      { label: "Kawin", value: "kawin" },
      { label: "Cerai Hidup", value: "cerai_hidup" },
      { label: "Cerai Mati", value: "cerai_mati" },
    ],
  },
  {
    name: "pekerjaan",
    label: "Pekerjaan",
    type: "text",
    required: true,
    placeholder: "Jenis pekerjaan",
  },
  {
    name: "kewarganegaraan",
    label: "Kewarganegaraan",
    type: "select",
    required: true,
    options: [
      { label: "Warga Negara Indonesia", value: "WNI" },
      { label: "Warga Negara Asing", value: "WNA" },
    ],
  },
  {
    name: "golongan_darah",
    label: "Golongan Darah",
    type: "select",
    required: false,
    options: [
      { label: "A", value: "A" },
      { label: "B", value: "B" },
      { label: "AB", value: "AB" },
      { label: "O", value: "O" },
    ],
  },
  {
    name: "jenis_pengajuan",
    label: "Jenis Pengajuan",
    type: "select",
    required: true,
    options: [
      { label: "KTP Baru (Pertama Kali)", value: "baru" },
      { label: "Penggantian KTP (Hilang/Rusak)", value: "penggantian" },
      { label: "Perpanjangan KTP", value: "perpanjangan" },
      { label: "Perubahan Data", value: "perubahan" },
    ],
  },
  {
    name: "alasan_pengajuan",
    label: "Alasan/Keterangan Pengajuan",
    type: "textarea",
    required: false,
    placeholder: "Jelaskan alasan atau keterangan tambahan",
  },
  {
    name: "dokumen_nik_lama",
    label: "Dokumen KTP Lama (PDF, JPG, PNG) - Jika ada",
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
    name: "dokumen_akta_lahir",
    label: "Dokumen Akta Lahir (PDF, JPG, PNG)",
    type: "file",
    required: true,
    acceptFileTypes: ".pdf,.jpg,.jpeg,.png",
    maxFileSize: 5,
  },
  {
    name: "dokumen_pas_foto",
    label: "Pas Foto 4x6 Berwarna (JPG, PNG)",
    type: "file",
    required: false,
    acceptFileTypes: ".jpg,.jpeg,.png",
    maxFileSize: 5,
  },
] as const

export default function KTPPengajuanPage() {
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
      const response = await fetch(`${API_URL}/id-cards`, {
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
        message: "Pengajuan KTP berhasil dikirim! Silakan cek status pengajuan Anda di halaman submissions.",
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
        serviceName="ktp"
        serviceTitle="Pengajuan Kartu Tanda Penduduk (KTP)"
        fields={ktpFields}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
