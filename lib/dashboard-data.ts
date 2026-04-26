import type { LucideIcon } from "lucide-react"
import { Baby, CreditCard, FileText, Heart, Home, MapPinned } from "lucide-react"

export type SubmissionStatus = "pending" | "verifying" | "approved" | "rejected" | "completed" | "deleted"

export interface DashboardService {
  value: string
  label: string
  shortLabel: string
  icon: LucideIcon
  createHref: string
  historyHref: string
}

export interface DashboardSubmission {
  id: string | number
  user_id?: string | number
  applicant_name?: string
  status: SubmissionStatus
  data?: Record<string, any>
  documents?: Record<string, any>
  rejection_reason?: string | null
  created_at: string
  updated_at: string
  service: string
  serviceLabel: string
  serviceShortLabel: string
  createHref: string
}

export const dashboardServices: DashboardService[] = [
  {
    value: "id-cards",
    label: "KTP Elektronik",
    shortLabel: "KTP",
    icon: CreditCard,
    createHref: "/dashboard/ktp/pengajuan",
    historyHref: "/dashboard/ktp",
  },
  {
    value: "births",
    label: "Akta Kelahiran",
    shortLabel: "Kelahiran",
    icon: Baby,
    createHref: "/dashboard/kelahiran/pengajuan",
    historyHref: "/dashboard/kelahiran",
  },
  {
    value: "deaths",
    label: "Akta Kematian",
    shortLabel: "Kematian",
    icon: FileText,
    createHref: "/dashboard/kematian/pengajuan",
    historyHref: "/dashboard/kematian",
  },
  {
    value: "marriages",
    label: "Akta Perkawinan",
    shortLabel: "Perkawinan",
    icon: Heart,
    createHref: "/dashboard/perkawinan/pengajuan",
    historyHref: "/dashboard/perkawinan",
  },
  {
    value: "moves",
    label: "Pindah Domisili",
    shortLabel: "Pindah",
    icon: MapPinned,
    createHref: "/dashboard/pindah/pengajuan",
    historyHref: "/dashboard/submissions",
  },
  {
    value: "family-cards",
    label: "Kartu Keluarga",
    shortLabel: "KK",
    icon: Home,
    createHref: "/dashboard/kk/pengajuan",
    historyHref: "/dashboard/submissions",
  },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function fetchUserSubmissions(token: string, status?: string) {
  const allSubmissions: DashboardSubmission[] = []

  for (const service of dashboardServices) {
    const url = new URL(`${API_URL}/${service.value}`)
    url.searchParams.set("limit", "100")
    if (status && status !== "all") {
      url.searchParams.set("status", status)
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 401) {
      throw new Error("Sesi berakhir. Silakan login kembali.")
    }

    if (!response.ok) {
      continue
    }

    const payload = await response.json()
    const data = Array.isArray(payload) ? payload : payload.data || []
    allSubmissions.push(
      ...data.map((submission: any) => ({
        ...submission,
        service: service.value,
        serviceLabel: service.label,
        serviceShortLabel: service.shortLabel,
        createHref: service.createHref,
      }))
    )
  }

  return allSubmissions.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export function createStatusCounts(submissions: DashboardSubmission[]) {
  return {
    pending: submissions.filter((item) => item.status === "pending").length,
    verifying: submissions.filter((item) => item.status === "verifying").length,
    approved: submissions.filter((item) => item.status === "approved").length,
    rejected: submissions.filter((item) => item.status === "rejected").length,
    completed: submissions.filter((item) => item.status === "completed").length,
  }
}

export function buildSubmissionsCsv(submissions: DashboardSubmission[]) {
  const rows = [
    ["ID", "Layanan", "Status", "Tanggal Pengajuan", "Tanggal Update"],
    ...submissions.map((item) => [
      String(item.id),
      item.serviceLabel,
      item.status,
      item.created_at,
      item.updated_at,
    ]),
  ]

  return rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n")
}

export function downloadTextFile(filename: string, content: string, mimeType = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
