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
import { ArrowLeft, Upload, CheckCircle2, AlertCircle, Baby } from "lucide-react"

export default function KelahiranPengajuanPage() {
  const [formData, setFormData] = useState({
    // Data Bayi
    namaBayi: "",
    jenisKelaminBayi: "",
    tempatLahir: "",
    tanggalLahir: "",
    waktuLahir: "",
    jenisKelahiran: "",
    kelahiranKe: "",
    penolongKelahiran: "",
    beratBayi: "",
    panjangBayi: "",

    // Data Ayah
    nikAyah: "",
    namaAyah: "",
    tempatLahirAyah: "",
    tanggalLahirAyah: "",
    agamaAyah: "",
    pekerjaanAyah: "",
    alamatAyah: "",

    // Data Ibu
    nikIbu: "",
    namaIbu: "",
    tempatLahirIbu: "",
    tanggalLahirIbu: "",
    agamaIbu: "",
    pekerjaanIbu: "",
    alamatIbu: "",

    // Data Pelapor
    nikPelapor: "",
    namaPelapor: "",
    hubunganPelapor: "",

    // Kontak
    nomorHp: "",
    email: "",
  })

  const [documents, setDocuments] = useState({
    fotoKkOrtu: null as File | null,
    fotoKtpAyah: null as File | null,
    fotoKtpIbu: null as File | null,
    fotoSuratKelahiran: null as File | null,
    fotoBukuNikah: null as File | null,
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
          title="Pengajuan Akta Kelahiran"
          description="Formulir pengajuan akta kelahiran"
        />

        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <Baby className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Pengajuan Berhasil!</h2>
                <p className="text-muted-foreground mb-6">
                  Pengajuan akta kelahiran Anda telah berhasil dikirim. Nomor pengajuan: <strong>KELAHIRAN-2026-001</strong>
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
        title="Pengajuan Akta Kelahiran"
        description="Formulir pengajuan akta kelahiran"
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Form Pengajuan Akta Kelahiran</h1>
            <p className="text-muted-foreground">Lengkapi data kelahiran bayi untuk pencatatan akta</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data Bayi */}
          <Card>
            <CardHeader>
              <CardTitle>Data Bayi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="namaBayi">Nama Lengkap Bayi *</Label>
                  <Input
                    id="namaBayi"
                    placeholder="Nama lengkap bayi"
                    value={formData.namaBayi}
                    onChange={(e) => handleInputChange("namaBayi", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jenisKelaminBayi">Jenis Kelamin *</Label>
                  <Select value={formData.jenisKelaminBayi} onValueChange={(value) => handleInputChange("jenisKelaminBayi", value)}>
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

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="tempatLahir">Tempat Lahir *</Label>
                  <Input
                    id="tempatLahir"
                    placeholder="Kota/kabupaten kelahiran"
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
                  <Label htmlFor="waktuLahir">Waktu Lahir</Label>
                  <Input
                    id="waktuLahir"
                    type="time"
                    value={formData.waktuLahir}
                    onChange={(e) => handleInputChange("waktuLahir", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="jenisKelahiran">Jenis Kelahiran *</Label>
                  <Select value={formData.jenisKelahiran} onValueChange={(value) => handleInputChange("jenisKelahiran", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tunggal">Tunggal</SelectItem>
                      <SelectItem value="kembar">Kembar</SelectItem>
                      <SelectItem value="kembar-2">Kembar 2</SelectItem>
                      <SelectItem value="kembar-3">Kembar 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kelahiranKe">Kelahiran ke *</Label>
                  <Input
                    id="kelahiranKe"
                    type="number"
                    placeholder="1"
                    value={formData.kelahiranKe}
                    onChange={(e) => handleInputChange("kelahiranKe", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="penolongKelahiran">Penolong Kelahiran *</Label>
                  <Select value={formData.penolongKelahiran} onValueChange={(value) => handleInputChange("penolongKelahiran", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih penolong" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dokter">Dokter</SelectItem>
                      <SelectItem value="bidan">Bidan</SelectItem>
                      <SelectItem value="dukun">Dukun</SelectItem>
                      <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beratBayi">Berat Bayi (kg)</Label>
                  <Input
                    id="beratBayi"
                    placeholder="3.2"
                    value={formData.beratBayi}
                    onChange={(e) => handleInputChange("beratBayi", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="panjangBayi">Panjang Bayi (cm)</Label>
                  <Input
                    id="panjangBayi"
                    placeholder="50"
                    value={formData.panjangBayi}
                    onChange={(e) => handleInputChange("panjangBayi", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Ayah */}
          <Card>
            <CardHeader>
              <CardTitle>Data Ayah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nikAyah">NIK Ayah *</Label>
                  <Input
                    id="nikAyah"
                    placeholder="16 digit NIK"
                    value={formData.nikAyah}
                    onChange={(e) => handleInputChange("nikAyah", e.target.value)}
                    maxLength={16}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="namaAyah">Nama Lengkap Ayah *</Label>
                  <Input
                    id="namaAyah"
                    placeholder="Nama lengkap ayah"
                    value={formData.namaAyah}
                    onChange={(e) => handleInputChange("namaAyah", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="tempatLahirAyah">Tempat Lahir Ayah *</Label>
                  <Input
                    id="tempatLahirAyah"
                    placeholder="Kota kelahiran"
                    value={formData.tempatLahirAyah}
                    onChange={(e) => handleInputChange("tempatLahirAyah", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggalLahirAyah">Tanggal Lahir Ayah *</Label>
                  <Input
                    id="tanggalLahirAyah"
                    type="date"
                    value={formData.tanggalLahirAyah}
                    onChange={(e) => handleInputChange("tanggalLahirAyah", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agamaAyah">Agama Ayah *</Label>
                  <Select value={formData.agamaAyah} onValueChange={(value) => handleInputChange("agamaAyah", value)}>
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
                  <Label htmlFor="pekerjaanAyah">Pekerjaan Ayah *</Label>
                  <Input
                    id="pekerjaanAyah"
                    placeholder="Pekerjaan ayah"
                    value={formData.pekerjaanAyah}
                    onChange={(e) => handleInputChange("pekerjaanAyah", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alamatAyah">Alamat Ayah *</Label>
                  <Textarea
                    id="alamatAyah"
                    placeholder="Alamat lengkap ayah"
                    value={formData.alamatAyah}
                    onChange={(e) => handleInputChange("alamatAyah", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Ibu */}
          <Card>
            <CardHeader>
              <CardTitle>Data Ibu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nikIbu">NIK Ibu *</Label>
                  <Input
                    id="nikIbu"
                    placeholder="16 digit NIK"
                    value={formData.nikIbu}
                    onChange={(e) => handleInputChange("nikIbu", e.target.value)}
                    maxLength={16}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="namaIbu">Nama Lengkap Ibu *</Label>
                  <Input
                    id="namaIbu"
                    placeholder="Nama lengkap ibu"
                    value={formData.namaIbu}
                    onChange={(e) => handleInputChange("namaIbu", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="tempatLahirIbu">Tempat Lahir Ibu *</Label>
                  <Input
                    id="tempatLahirIbu"
                    placeholder="Kota kelahiran"
                    value={formData.tempatLahirIbu}
                    onChange={(e) => handleInputChange("tempatLahirIbu", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggalLahirIbu">Tanggal Lahir Ibu *</Label>
                  <Input
                    id="tanggalLahirIbu"
                    type="date"
                    value={formData.tanggalLahirIbu}
                    onChange={(e) => handleInputChange("tanggalLahirIbu", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agamaIbu">Agama Ibu *</Label>
                  <Select value={formData.agamaIbu} onValueChange={(value) => handleInputChange("agamaIbu", value)}>
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
                  <Label htmlFor="pekerjaanIbu">Pekerjaan Ibu *</Label>
                  <Input
                    id="pekerjaanIbu"
                    placeholder="Pekerjaan ibu"
                    value={formData.pekerjaanIbu}
                    onChange={(e) => handleInputChange("pekerjaanIbu", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alamatIbu">Alamat Ibu *</Label>
                  <Textarea
                    id="alamatIbu"
                    placeholder="Alamat lengkap ibu"
                    value={formData.alamatIbu}
                    onChange={(e) => handleInputChange("alamatIbu", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Pelapor */}
          <Card>
            <CardHeader>
              <CardTitle>Data Pelapor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="nikPelapor">NIK Pelapor *</Label>
                  <Input
                    id="nikPelapor"
                    placeholder="16 digit NIK"
                    value={formData.nikPelapor}
                    onChange={(e) => handleInputChange("nikPelapor", e.target.value)}
                    maxLength={16}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="namaPelapor">Nama Pelapor *</Label>
                  <Input
                    id="namaPelapor"
                    placeholder="Nama lengkap pelapor"
                    value={formData.namaPelapor}
                    onChange={(e) => handleInputChange("namaPelapor", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hubunganPelapor">Hubungan dengan Bayi *</Label>
                  <Select value={formData.hubunganPelapor} onValueChange={(value) => handleInputChange("hubunganPelapor", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih hubungan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ayah">Ayah</SelectItem>
                      <SelectItem value="ibu">Ibu</SelectItem>
                      <SelectItem value="keluarga">Keluarga Lain</SelectItem>
                      <SelectItem value="saksi">Saksi</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label>Foto Kartu Keluarga Orang Tua *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoKkOrtu", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoKkOrtu"
                      required
                    />
                    <Label htmlFor="fotoKkOrtu" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoKkOrtu ? documents.fotoKkOrtu.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Foto KTP Ayah *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoKtpAyah", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoKtpAyah"
                      required
                    />
                    <Label htmlFor="fotoKtpAyah" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoKtpAyah ? documents.fotoKtpAyah.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Foto KTP Ibu *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoKtpIbu", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoKtpIbu"
                      required
                    />
                    <Label htmlFor="fotoKtpIbu" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoKtpIbu ? documents.fotoKtpIbu.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Surat Keterangan Kelahiran dari RS/Bidan *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoSuratKelahiran", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoSuratKelahiran"
                      required
                    />
                    <Label htmlFor="fotoSuratKelahiran" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoSuratKelahiran ? documents.fotoSuratKelahiran.name : "Pilih File"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Foto Buku Nikah Orang Tua *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("fotoBukuNikah", e.target.files?.[0] || null)}
                      className="hidden"
                      id="fotoBukuNikah"
                      required
                    />
                    <Label htmlFor="fotoBukuNikah" className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      {documents.fotoBukuNikah ? documents.fotoBukuNikah.name : "Pilih File"}
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
                    Dengan mengajukan permohonan ini, saya menyatakan bahwa semua data yang saya berikan adalah benar dan saya bertanggung jawab atas kebenarannya. Saya juga menyatakan bahwa bayi yang dilaporkan adalah anak kandung dari orang tua yang disebutkan.
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
            <Link href="/dashboard">
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