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
import { ArrowLeft, Upload, CheckCircle2, AlertCircle } from "lucide-react"

export default function KTPPengajuanPage() {
  const [formData, setFormData] = useState({
    nik: "",
    namaLengkap: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    alamat: "",
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    kodePos: "",
    agama: "",
    statusPerkawinan: "",
    pekerjaan: "",
    kewarganegaraan: "WNI",
    golonganDarah: "",
    jenisPengajuan: "",
    alasanPengajuan: "",
    nomorHp: "",
    email: "",
  })

  const [documents, setDocuments] = useState({
    fotoKtpLama: null as File | null,
    fotoKk: null as File | null,
    fotoAktaLahir: null as File | null,
    pasFoto: null as File | null,
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
          title="Pengajuan KTP"
          description="Formulir pengajuan Kartu Tanda Penduduk"
        />

        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Pengajuan Berhasil!</h2>
                <p className="text-muted-foreground mb-6">
                  Pengajuan KTP Anda telah berhasil dikirim. Nomor pengajuan: <strong>KTP-2026-001</strong>
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
        title="Pengajuan KTP"
        description="Formulir pengajuan Kartu Tanda Penduduk"
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/ktp">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Form Pengajuan KTP</h1>
            <p className="text-muted-foreground">Lengkapi data dan unggah dokumen yang diperlukan</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data Pribadi */}
          <Card>
            <CardHeader>
              <CardTitle>Data Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK *</Label>
                  <Input
                    id="nik"
                    placeholder="16 digit NIK"
                    value={formData.nik}
                    onChange={(e) => handleInputChange("nik", e.target.value)}
                    maxLength={16}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="namaLengkap">Nama Lengkap *</Label>
                  <Input
                    id="namaLengkap"
                    placeholder="Sesuai KTP"
                    value={formData.namaLengkap}
                    onChange={(e) => handleInputChange("namaLengkap", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="tempatLahir">Tempat Lahir *</Label>
                  <Input
                    id="tempatLahir"
                    placeholder="Kota kelahiran"
                    value={formData.tempatLahir}
                    onChange={(e) => handleInputChange("tempatLahir", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
                  <Input
                    id="tanggalLahir"
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => handleInputChange("tanggalLahir", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jenisKelamin">Jenis Kelamin *</Label>
                  <Select value={formData.jenisKelamin} onValueChange={(value) => handleInputChange("jenisKelamin", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

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

          {/* Alamat */}
          <Card>
            <CardHeader>
              <CardTitle>Alamat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat Lengkap *</Label>
                <Textarea
                  id="alamat"
                  placeholder="Jl. Contoh No. 123, RT/RW 01/02"
                  value={formData.alamat}
                  onChange={(e) => handleInputChange("alamat", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="rt">RT *</Label>
                  <Input
                    id="rt"
                    placeholder="001"
                    value={formData.rt}
                    onChange={(e) => handleInputChange("rt", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rw">RW *</Label>
                  <Input
                    id="rw"
                    placeholder="002"
                    value={formData.rw}
                    onChange={(e) => handleInputChange("rw", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kelurahan">Kelurahan *</Label>
                  <Input
                    id="kelurahan"
                    placeholder="Kelurahan"
                    value={formData.kelurahan}
                    onChange={(e) => handleInputChange("kelurahan", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kecamatan">Kecamatan *</Label>
                  <Input
                    id="kecamatan"
                    placeholder="Kecamatan"
                    value={formData.kecamatan}
                    onChange={(e) => handleInputChange("kecamatan", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="kota">Kota *</Label>
                  <Input
                    id="kota"
                    placeholder="Kota"
                    value={formData.kota}
                    onChange={(e) => handleInputChange("kota", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provinsi">Provinsi *</Label>
                  <Input
                    id="provinsi"
                    placeholder="Provinsi"
                    value={formData.provinsi}
                    onChange={(e) => handleInputChange("provinsi", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kodePos">Kode Pos</Label>
                  <Input
                    id="kodePos"
                    placeholder="12345"
                    value={formData.kodePos}
                    onChange={(e) => handleInputChange("kodePos", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Tambahan */}
          <Card>
            <CardHeader>
              <CardTitle>Data Tambahan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="agama">Agama *</Label>
                  <Select value={formData.agama} onValueChange={(value) => handleInputChange("agama", value)}>
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
                <div className="space-y-2">
                  <Label htmlFor="statusPerkawinan">Status Perkawinan *</Label>
                  <Select value={formData.statusPerkawinan} onValueChange={(value) => handleInputChange("statusPerkawinan", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="belum-kawin">Belum Kawin</SelectItem>
                      <SelectItem value="kawin">Kawin</SelectItem>
                      <SelectItem value="cerai-hidup">Cerai Hidup</SelectItem>
                      <SelectItem value="cerai-mati">Cerai Mati</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pekerjaan">Pekerjaan *</Label>
                  <Input
                    id="pekerjaan"
                    placeholder="Pekerjaan"
                    value={formData.pekerjaan}
                    onChange={(e) => handleInputChange("pekerjaan", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="kewarganegaraan">Kewarganegaraan *</Label>
                  <Select value={formData.kewarganegaraan} onValueChange={(value) => handleInputChange("kewarganegaraan", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kewarganegaraan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WNI">Warga Negara Indonesia</SelectItem>
                      <SelectItem value="WNA">Warga Negara Asing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="golonganDarah">Golongan Darah</Label>
                  <Select value={formData.golonganDarah} onValueChange={(value) => handleInputChange("golonganDarah", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih golongan darah" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                      <SelectItem value="O">O</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jenis Pengajuan */}
          <Card>
            <CardHeader>
              <CardTitle>Jenis Pengajuan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jenisPengajuan">Jenis Pengajuan KTP *</Label>
                <Select value={formData.jenisPengajuan} onValueChange={(value) => handleInputChange("jenisPengajuan", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis pengajuan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baru">KTP Baru (Pertama Kali)</SelectItem>
                    <SelectItem value="penggantian">Penggantian KTP (Hilang/Rusak)</SelectItem>
                    <SelectItem value="perpanjangan">Perpanjangan KTP</SelectItem>
                    <SelectItem value="perubahan">Perubahan Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.jenisPengajuan === "perubahan" && (
                <div className="space-y-2">
                  <Label htmlFor="alasanPengajuan">Alasan Perubahan</Label>
                  <Textarea
                    id="alasanPengajuan"
                    placeholder="Jelaskan data yang akan diubah dan alasan perubahan"
                    value={formData.alasanPengajuan}
                    onChange={(e) => handleInputChange("alasanPengajuan", e.target.value)}
                  />
                </div>
              )}
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
                  <Label>Foto KTP Lama (jika ada)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoKtpLama", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoKtpLama"
                    />
                    <Label htmlFor="fotoKtpLama" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoKtpLama ? documents.fotoKtpLama.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Foto Kartu Keluarga *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoKk", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoKk"
                      required
                    />
                    <Label htmlFor="fotoKk" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoKk ? documents.fotoKk.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Foto Akta Kelahiran *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoAktaLahir", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoAktaLahir"
                      required
                    />
                    <Label htmlFor="fotoAktaLahir" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoAktaLahir ? documents.fotoAktaLahir.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pas Foto 3x4 cm *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("pasFoto", e.target.files?.[0] || null)}
                      className="hidden"
                      id="pasFoto"
                      required
                    />
                    <Label htmlFor="pasFoto" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.pasFoto ? documents.pasFoto.name : "Pilih File"}
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
                    Dengan mengajukan permohonan ini, saya menyatakan bahwa data yang saya berikan adalah benar dan saya bertanggung jawab atas kebenarannya.
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
            <Link href="/dashboard/ktp">
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