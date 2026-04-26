"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Database, Download, Eye, RefreshCw, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { downloadTextFile } from "@/lib/dashboard-data"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

type DatabaseRow = {
  collection: string
  collectionLabel: string
  id: number | string
  summary: string
  statusLabel?: string
  created_at?: string
  updated_at?: string
  user_id?: number | string
  [key: string]: any
}

export default function AdminDatabasePage() {
  const router = useRouter()
  const { isAuthenticated, user, accessToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [rows, setRows] = useState<DatabaseRow[]>([])
  const [collections, setCollections] = useState<{ key: string; label: string; total: number }[]>([])
  const [search, setSearch] = useState("")
  const [collectionFilter, setCollectionFilter] = useState("all")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login")
      return
    }

    const load = async () => {
      try {
        setLoading(true)
        setError("")
        const token = accessToken || localStorage.getItem("access_token")
        const response = await fetch(`${API_URL}/admin/database`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 401 || response.status === 403) {
          router.push("/admin/login")
          return
        }

        if (!response.ok) {
          throw new Error("Gagal memuat tabel database")
        }

        const data = await response.json()
        setRows(data.data || [])
        setCollections(data.collections || [])
      } catch (err: any) {
        setError(err.message || "Gagal memuat tabel database")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isAuthenticated, user, accessToken, router])

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase()
    return rows.filter((row) => {
      const matchesCollection = collectionFilter === "all" || row.collection === collectionFilter
      const matchesSearch =
        !query ||
        row.collectionLabel.toLowerCase().includes(query) ||
        String(row.id).toLowerCase().includes(query) ||
        row.summary.toLowerCase().includes(query)
      return matchesCollection && matchesSearch
    })
  }, [rows, search, collectionFilter])

  const exportRows = () => {
    const headers = ["collection", "id", "summary", "status_or_role", "created_at", "updated_at"]
    const csvRows = [
      headers,
      ...filteredRows.map((row) => [
        row.collection,
        row.id,
        row.summary,
        row.statusLabel || "-",
        row.created_at || "",
        row.updated_at || "",
      ]),
    ]

    const csv = csvRows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    downloadTextFile("admin-database.csv", csv)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tabel Database</h1>
          <p className="text-muted-foreground">
            Ringkasan seluruh koleksi database, hanya untuk admin.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/submissions">Semua Pengajuan</Link>
          </Button>
          <Button variant="outline" onClick={exportRows} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-5 mb-6">
        {collections.map((item) => (
          <Card key={item.key}>
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-3xl font-bold">{item.total}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Cari koleksi, ID, atau ringkasan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={collectionFilter} onValueChange={setCollectionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih koleksi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Koleksi</SelectItem>
                  {collections.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => window.location.reload()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Muat Ulang
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Semua Data</CardTitle>
          <Badge variant="secondary" className="gap-2">
            <Database className="h-3 w-3" />
            {filteredRows.length} baris
          </Badge>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Koleksi</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Ringkasan</TableHead>
                  <TableHead>Status / Role</TableHead>
                  <TableHead className="hidden lg:table-cell">Dibuat</TableHead>
                  <TableHead className="hidden xl:table-cell">Update</TableHead>
                  <TableHead className="w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={`${row.collection}-${row.id}`}>
                    <TableCell className="font-medium">{row.collectionLabel}</TableCell>
                    <TableCell className="font-mono text-sm">{String(row.id)}</TableCell>
                    <TableCell className="max-w-[360px] truncate">{row.summary}</TableCell>
                    <TableCell>
                      {row.statusLabel ? (
                        <Badge variant="outline">{row.statusLabel}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {row.created_at ? new Date(row.created_at).toLocaleString("id-ID") : "-"}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                      {row.updated_at ? new Date(row.updated_at).toLocaleString("id-ID") : "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => router.push(`/admin/submissions/${row.collection}/${row.id}`)}
                        disabled={!["id_cards", "births", "deaths", "marriages", "moves", "family_cards"].includes(row.collection)}
                      >
                        <Eye className="h-4 w-4" />
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!loading && filteredRows.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Tidak ada data yang cocok dengan filter saat ini.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
