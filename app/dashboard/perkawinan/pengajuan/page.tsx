"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, CheckCircle2, AlertCircle, Heart } from "lucide-react"

export default function PerkawinanPengajuanPage() {
  const [formData, setFormData] = useState({
    // Data Calon Suami
    suamiNik: "",
    suamiNama: "",
    suamiTempatLahir: "",
    suamiTanggalLahir: "",
    suamiAgama: "",
    suamiPekerjaan: "",
    suamiAlamat: "",
    suamiStatus: "",

    // Data Calon Istri
    istriNik: "",
    istriNama: "",
    istriTempatLahir: "",
    istriTanggalLahir: "",
    istriAgama: "",
    istriPekerjaan: "",
    istriAlamat: "",
    istriStatus: "",

    // Data Perkawinan
    tanggalPerkawinan: "",
    tempatPerkawinan: "",
    waliNikah: "",
    namaWali: "",
    saksi1Nik: "",
    namaSaksi1: "",
    saksi2Nik: "",
    namaSaksi2: "",

    // Kontak
    nomorHp: "",
    email: "",
  })

  const [documents, setDocuments] = useState({
    fotoKtpSuami: null as File | null,
    fotoKtpIstri: null as File | null,
    fotoKkSuami: null as File | null,
    fotoKkIstri: null as File | null,
    fotoAktaLahirSuami: null as File | null,
    fotoAktaLahirIstri: null as File | null,
    fotoSuratPengantar: null as File | null,
    fotoPasFotoSuami: null as File | null,
    fotoPasFotoIstri: null as File | null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    setDocuments(prev => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col">
        <Header
          title="Pengajuan Akta Perkawinan"
          description="Formulir pengajuan akta perkawinan"
        />

        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <Heart className="h-16 w-16 text-pink-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Pengajuan Berhasil!</h2>
                <p className="text-muted-foreground mb-6">
                  Pengajuan akta perkawinan Anda telah berhasil dikirim. Nomor pengajuan: <strong>PERKAWINAN-2026-001</strong>
                </p>
                <div className="space-y-3">
                  <Link href="/dashboard/status">
                    <Button className="w-full">
                      Lihat Status Pengajuan
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full">
                      Kembali ke Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Pengajuan Akta Perkawinan"
        description="Formulir pengajuan akta perkawinan"
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/perkawinan">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Form Pengajuan Akta Perkawinan</h1>
            <p className="text-muted-foreground">Lengkapi data lengkap untuk pencatatan akta perkawinan</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data Calon Suami */}
          <Card>
            <CardHeader>
              <CardTitle>Data Calon Suami</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="suamiNik">NIK Suami *</Label>
                  <Input
                    id="suamiNik"
                    placeholder="16 digit NIK"
                    value={formData.suamiNik}
                    onChange={(e) => handleInputChange("suamiNik", e.target.value)}
                    maxLength={16}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suamiNama">Nama Lengkap Suami *</Label>
                  <Input
                    id="suamiNama"
                    placeholder="Nama lengkap sesuai KTP"
                    value={formData.suamiNama}
                    onChange={(e) => handleInputChange("suamiNama", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="suamiTempatLahir">Tempat Lahir *</Label>
                  <Input
                    id="suamiTempatLahir"
                    placeholder="Kota kelahiran"
                    value={formData.suamiTempatLahir}
                    onChange={(e) => handleInputChange("suamiTempatLahir", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suamiTanggalLahir">Tanggal Lahir *</Label>
                  <Input
                    id="suamiTanggalLahir"
                    type="date"
                    value={formData.suamiTanggalLahir}
                    onChange={(e) => handleInputChange("suamiTanggalLahir", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suamiAgama">Agama *</Label>
                  <Select value={formData.suamiAgama} onValueChange={(value) => handleInputChange("suamiAgama", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih agama" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="islam">Islam</SelectItem>
                      <SelectItem value="kristen">Kristen</SelectItem>
                      <SelectItem value="katolik">Katolik</SelectItem>
                      <SelectItem value="hindu">Hindu</SelectItem>
                      <SelectItem value="buddha">Buddha</SelectItem>
                      <SelectItem value="konghucu">Konghucu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="suamiPekerjaan">Pekerjaan *</Label>
                  <Input
                    id="suamiPekerjaan"
                    placeholder="Pekerjaan"
                    value={formData.suamiPekerjaan}
                    onChange={(e) => handleInputChange("suamiPekerjaan", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suamiStatus">Status Perkawinan *</Label>
                  <Select value={formData.suamiStatus} onValueChange={(value) => handleInputChange("suamiStatus", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="belum-kawin">Belum Kawin</SelectItem>
                      <SelectItem value="cerai-hidup">Cerai Hidup</SelectItem>
                      <SelectItem value="cerai-mati">Cerai Mati</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="suamiAlamat">Alamat Lengkap *</Label>
                <Textarea
                  id="suamiAlamat"
                  placeholder="Alamat lengkap sesuai KTP"
                  value={formData.suamiAlamat}
                  onChange={(e) => handleInputChange("suamiAlamat", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Calon Istri */}
          <Card>
            <CardHeader>
              <CardTitle>Data Calon Istri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="istriNik">NIK Istri *</Label>
                  <Input
                    id="istriNik"
                    placeholder="16 digit NIK"
                    value={formData.istriNik}
                    onChange={(e) => handleInputChange("istriNik", e.target.value)}
                    maxLength={16}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="istriNama">Nama Lengkap Istri *</Label>
                  <Input
                    id="istriNama"
                    placeholder="Nama lengkap sesuai KTP"
                    value={formData.istriNama}
                    onChange={(e) => handleInputChange("istriNama", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="istriTempatLahir">Tempat Lahir *</Label>
                  <Input
                    id="istriTempatLahir"
                    placeholder="Kota kelahiran"
                    value={formData.istriTempatLahir}
                    onChange={(e) => handleInputChange("istriTempatLahir", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="istriTanggalLahir">Tanggal Lahir *</Label>
                  <Input
                    id="istriTanggalLahir"
                    type="date"
                    value={formData.istriTanggalLahir}
                    onChange={(e) => handleInputChange("istriTanggalLahir", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="istriAgama">Agama *</Label>
                  <Select value={formData.istriAgama} onValueChange={(value) => handleInputChange("istriAgama", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih agama" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="islam">Islam</SelectItem>
                      <SelectItem value="kristen">Kristen</SelectItem>
                      <SelectItem value="katolik">Katolik</SelectItem>
                      <SelectItem value="hindu">Hindu</SelectItem>
                      <SelectItem value="buddha">Buddha</SelectItem>
                      <SelectItem value="konghucu">Konghucu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="istriPekerjaan">Pekerjaan *</Label>
                  <Input
                    id="istriPekerjaan"
                    placeholder="Pekerjaan"
                    value={formData.istriPekerjaan}
                    onChange={(e) => handleInputChange("istriPekerjaan", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="istriStatus">Status Perkawinan *</Label>
                  <Select value={formData.istriStatus} onValueChange={(value) => handleInputChange("istriStatus", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="belum-kawin">Belum Kawin</SelectItem>
                      <SelectItem value="cerai-hidup">Cerai Hidup</SelectItem>
                      <SelectItem value="cerai-mati">Cerai Mati</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="istriAlamat">Alamat Lengkap *</Label>
                <Textarea
                  id="istriAlamat"
                  placeholder="Alamat lengkap sesuai KTP"
                  value={formData.istriAlamat}
                  onChange={(e) => handleInputChange("istriAlamat", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Perkawinan */}
          <Card>
            <CardHeader>
              <CardTitle>Data Perkawinan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tanggalPerkawinan">Tanggal Perkawinan *</Label>
                  <Input
                    id="tanggalPerkawinan"
                    type="date"
                    value={formData.tanggalPerkawinan}
                    onChange={(e) => handleInputChange("tanggalPerkawinan", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempatPerkawinan">Tempat Perkawinan *</Label>
                  <Input
                    id="tempatPerkawinan"
                    placeholder="Tempat akad nikah"
                    value={formData.tempatPerkawinan}
                    onChange={(e) => handleInputChange("tempatPerkawinan", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="waliNikah">NIK Wali Nikah</Label>
                  <Input
                    id="waliNikah"
                    placeholder="NIK wali nikah (jika ada)"
                    value={formData.waliNikah}
                    onChange={(e) => handleInputChange("waliNikah", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="namaWali">Nama Wali Nikah</Label>
                  <Input
                    id="namaWali"
                    placeholder="Nama wali nikah"
                    value={formData.namaWali}
                    onChange={(e) => handleInputChange("namaWali", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Saksi */}
          <Card>
            <CardHeader>
              <CardTitle>Data Saksi (2 orang)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Saksi 1 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Saksi 1</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="saksi1Nik">NIK Saksi 1 *</Label>
                    <Input
                      id="saksi1Nik"
                      placeholder="16 digit NIK"
                      value={formData.saksi1Nik}
                      onChange={(e) => handleInputChange("saksi1Nik", e.target.value)}
                      maxLength={16}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="namaSaksi1">Nama Saksi 1 *</Label>
                    <Input
                      id="namaSaksi1"
                      placeholder="Nama lengkap saksi"
                      value={formData.namaSaksi1}
                      onChange={(e) => handleInputChange("namaSaksi1", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Saksi 2 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Saksi 2</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="saksi2Nik">NIK Saksi 2 *</Label>
                    <Input
                      id="saksi2Nik"
                      placeholder="16 digit NIK"
                      value={formData.saksi2Nik}
                      onChange={(e) => handleInputChange("saksi2Nik", e.target.value)}
                      maxLength={16}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="namaSaksi2">Nama Saksi 2 *</Label>
                    <Input
                      id="namaSaksi2"
                      placeholder="Nama lengkap saksi"
                      value={formData.namaSaksi2}
                      onChange={(e) => handleInputChange("namaSaksi2", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kontak */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nomorHp">Nomor HP *</Label>
                  <Input
                    id="nomorHp"
                    placeholder="081234567890"
                    value={formData.nomorHp}
                    onChange={(e) => handleInputChange("nomorHp", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Dokumen */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Dokumen</CardTitle>
              <p className="text-sm text-muted-foreground">
                Unggah dokumen dalam format PDF, JPG, atau PNG (maksimal 2MB per file)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Foto KTP Suami *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoKtpSuami", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoKtpSuami"
                      required
                    />
                    <Label htmlFor="fotoKtpSuami" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoKtpSuami ? documents.fotoKtpSuami.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Foto KTP Istri *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoKtpIstri", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoKtpIstri"
                      required
                    />
                    <Label htmlFor="fotoKtpIstri" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoKtpIstri ? documents.fotoKtpIstri.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Foto KK Suami *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoKkSuami", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoKkSuami"
                      required
                    />
                    <Label htmlFor="fotoKkSuami" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoKkSuami ? documents.fotoKkSuami.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Foto KK Istri *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoKkIstri", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoKkIstri"
                      required
                    />
                    <Label htmlFor="fotoKkIstri" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoKkIstri ? documents.fotoKkIstri.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Foto Akta Lahir Suami *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoAktaLahirSuami", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoAktaLahirSuami"
                      required
                    />
                    <Label htmlFor="fotoAktaLahirSuami" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoAktaLahirSuami ? documents.fotoAktaLahirSuami.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Foto Akta Lahir Istri *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoAktaLahirIstri", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoAktaLahirIstri"
                      required
                    />
                    <Label htmlFor="fotoAktaLahirIstri" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoAktaLahirIstri ? documents.fotoAktaLahirIstri.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Surat Pengantar Nikah *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoSuratPengantar", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoSuratPengantar"
                      required
                    />
                    <Label htmlFor="fotoSuratPengantar" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoSuratPengantar ? documents.fotoSuratPengantar.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pas Foto Suami 3x4 *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoPasFotoSuami", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoPasFotoSuami"
                      required
                    />
                    <Label htmlFor="fotoPasFotoSuami" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoPasFotoSuami ? documents.fotoPasFotoSuami.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pas Foto Istri 3x4 *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoPasFotoIstri", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoPasFotoIstri"
                      required
                    />
                    <Label htmlFor="fotoPasFotoIstri" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoPasFotoIstri ? documents.fotoPasFotoIstri.name : "Pilih File"}
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Persetujuan */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Dengan mengajukan permohonan ini, saya menyatakan bahwa semua data yang saya berikan adalah benar dan saya bertanggung jawab atas kebenarannya. Saya juga menyatakan bahwa pernikahan ini dilakukan secara sukarela tanpa ada paksaan dari pihak manapun.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center space-x-2">
                  <Checkbox id="agreement" required />
                  <Label htmlFor="agreement" className="text-sm">
                    Saya menyetujui syarat dan ketentuan yang berlaku
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Mengirim Pengajuan..." : "Kirim Pengajuan"}
            </Button>
            <Link href="/dashboard/perkawinan">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}