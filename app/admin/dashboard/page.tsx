"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAgenda, Agenda } from "@/app/providers/agenda-provider"
import { LogOut, Plus, Edit2, Trash2, X } from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { agendas, addAgenda, updateAgenda, deleteAgenda } = useAgenda()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    layanan: "",
    tanggal: "",
    jam: "",
    lokasi: "",
    kapasitas: 30,
    terdaftar: 0,
    deskripsi: "",
    status: "tersedia" as const,
  })

  // Check auth
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (!auth) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin/login")
  }

  const handleResetForm = () => {
    setFormData({
      title: "",
      layanan: "",
      tanggal: "",
      jam: "",
      lokasi: "",
      kapasitas: 30,
      terdaftar: 0,
      deskripsi: "",
      status: "tersedia",
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateAgenda(editingId, formData)
    } else {
      addAgenda(formData)
    }
    handleResetForm()
  }

  const handleEdit = (agenda: Agenda) => {
    setFormData({
      title: agenda.title,
      layanan: agenda.layanan,
      tanggal: agenda.tanggal,
      jam: agenda.jam,
      lokasi: agenda.lokasi,
      kapasitas: agenda.kapasitas,
      terdaftar: agenda.terdaftar,
      deskripsi: agenda.deskripsi,
      status: agenda.status,
    })
    setEditingId(agenda.id)
    setShowForm(true)
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "kapasitas" || name === "terdaftar" ? parseInt(value) : value,
    }))
  }

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-white/80 text-sm">Kelola jadwal layanan keliling</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Add Button */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold">Daftar Jadwal</h2>
          <Button
            onClick={() => {
              setShowForm(!showForm)
              if (editingId) handleResetForm()
            }}
            size="lg"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Jadwal
          </Button>
        </div>

        {/* Form Section */}
        {showForm && (
          <Card className="mb-8 border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {editingId ? "Edit Jadwal" : "Tambah Jadwal Baru"}
                  </CardTitle>
                  <CardDescription>
                    Isi formulir untuk membuat atau mengubah jadwal layanan
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetForm}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Judul
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Permohonan KTP-el"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Layanan
                    </label>
                    <Input
                      name="layanan"
                      value={formData.layanan}
                      onChange={handleInputChange}
                      placeholder="KTP Elektronik"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tanggal
                    </label>
                    <Input
                      name="tanggal"
                      type="date"
                      value={formData.tanggal}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Jam
                    </label>
                    <Input
                      name="jam"
                      value={formData.jam}
                      onChange={handleInputChange}
                      placeholder="08:00 - 14:00"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Lokasi
                    </label>
                    <Input
                      name="lokasi"
                      value={formData.lokasi}
                      onChange={handleInputChange}
                      placeholder="Kantor Kab. Minahasen"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Kapasitas
                    </label>
                    <Input
                      name="kapasitas"
                      type="number"
                      value={formData.kapasitas}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Terdaftar
                    </label>
                    <Input
                      name="terdaftar"
                      type="number"
                      value={formData.terdaftar}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="tersedia">Tersedia</option>
                      <option value="penuh">Penuh</option>
                      <option value="ditutup">Ditutup</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      placeholder="Deskripsi layanan..."
                      rows={3}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                <div className="flex gap-4 justify-end">
                  <Button variant="outline" onClick={handleResetForm}>
                    Batal
                  </Button>
                  <Button type="submit" className="gap-2">
                    {editingId ? "Simpan Perubahan" : "Tambah Jadwal"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Data Jadwal ({agendas.length})</CardTitle>
            <CardDescription>
              Kelola semua jadwal layanan keliling disini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Judul</th>
                    <th className="text-left py-3 px-4 font-semibold">Layanan</th>
                    <th className="text-left py-3 px-4 font-semibold">Tanggal</th>
                    <th className="text-left py-3 px-4 font-semibold">Jam</th>
                    <th className="text-left py-3 px-4 font-semibold">Lokasi</th>
                    <th className="text-center py-3 px-4 font-semibold">Kapasitas</th>
                    <th className="text-center py-3 px-4 font-semibold">Status</th>
                    <th className="text-center py-3 px-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {agendas.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-muted-foreground">
                        Tidak ada jadwal. Tambahkan jadwal baru untuk memulai.
                      </td>
                    </tr>
                  ) : (
                    agendas.map((agenda) => (
                      <tr key={agenda.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{agenda.title}</td>
                        <td className="py-3 px-4">{agenda.layanan}</td>
                        <td className="py-3 px-4">{agenda.tanggal}</td>
                        <td className="py-3 px-4">{agenda.jam}</td>
                        <td className="py-3 px-4">{agenda.lokasi}</td>
                        <td className="py-3 px-4 text-center">
                          {agenda.terdaftar}/{agenda.kapasitas}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={
                              agenda.status === "tersedia"
                                ? "outline"
                                : agenda.status === "penuh"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {agenda.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center flex gap-2 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(agenda)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAgenda(agenda.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
