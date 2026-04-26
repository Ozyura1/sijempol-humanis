export function getStatusBadgeColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "verifying":
      return "bg-blue-100 text-blue-800"
    case "approved":
      return "bg-green-100 text-green-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "completed":
      return "bg-gray-100 text-gray-800"
    case "deleted":
      return "bg-slate-100 text-slate-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Menunggu Review"
    case "verifying":
      return "Sedang Diverifikasi"
    case "approved":
      return "Disetujui"
    case "rejected":
      return "Ditolak"
    case "completed":
      return "Selesai"
    case "deleted":
      return "Dihapus"
    default:
      return status
  }
}

export function getServiceLabel(serviceName: string) {
  const labels: Record<string, string> = {
    "id-cards": "KTP",
    "id_cards": "KTP",
    births: "Akta Kelahiran",
    deaths: "Akta Kematian",
    marriages: "Akta Perkawinan",
    moves: "Pindah Domisili",
    "family-cards": "Kartu Keluarga",
    "family_cards": "Kartu Keluarga",
  }
  return labels[serviceName] || serviceName
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getServiceApiEndpoint(serviceName: string) {
  const endpoints: Record<string, string> = {
    "id-cards": "id-cards",
    ktp: "id-cards",
    births: "births",
    kelahiran: "births",
    deaths: "deaths",
    kematian: "deaths",
    marriages: "marriages",
    perkawinan: "marriages",
    moves: "moves",
    pindah: "moves",
    "family-cards": "family-cards",
    "family_cards": "family-cards",
    kk: "family-cards",
  }
  return endpoints[serviceName] || serviceName
}

// API Fetch functions
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function fetchSubmissions(serviceName: string, page = 1, limit = 10) {
  const endpoint = getServiceApiEndpoint(serviceName)
  const accessToken = localStorage.getItem("access_token")

  if (!accessToken) {
    throw new Error("User tidak terautentikasi")
  }

  const response = await fetch(`${API_URL}/${endpoint}?page=${page}&limit=${limit}`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Token kadaluarsa, silakan login kembali")
    }
    throw new Error("Gagal mengambil data")
  }

  return await response.json()
}

export async function fetchSubmissionById(serviceName: string, id: number) {
  const endpoint = getServiceApiEndpoint(serviceName)
  const accessToken = localStorage.getItem("access_token")

  if (!accessToken) {
    throw new Error("User tidak terautentikasi")
  }

  const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Data tidak ditemukan")
  }

  return await response.json()
}

export async function submitService(serviceName: string, data: any) {
  const endpoint = getServiceApiEndpoint(serviceName)
  const accessToken = localStorage.getItem("access_token")

  if (!accessToken) {
    throw new Error("User tidak terautentikasi")
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Gagal mengirim data")
  }

  return await response.json()
}

export async function updateSubmission(serviceName: string, id: number, data: any) {
  const endpoint = getServiceApiEndpoint(serviceName)
  const accessToken = localStorage.getItem("access_token")

  if (!accessToken) {
    throw new Error("User tidak terautentikasi")
  }

  const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Gagal mengubah data")
  }

  return await response.json()
}

export async function deleteSubmission(serviceName: string, id: number) {
  const endpoint = getServiceApiEndpoint(serviceName)
  const accessToken = localStorage.getItem("access_token")

  if (!accessToken) {
    throw new Error("User tidak terautentikasi")
  }

  const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Gagal menghapus data")
  }

  return await response.json()
}

export async function updateSubmissionStatus(serviceName: string, id: number, newStatus: string, rejectionReason?: string) {
  const endpoint = getServiceApiEndpoint(serviceName)
  const accessToken = localStorage.getItem("access_token")

  if (!accessToken) {
    throw new Error("User tidak terautentikasi")
  }

  if (newStatus === "rejected" && !rejectionReason) {
    throw new Error("Alasan penolakan wajib diisi")
  }

  const url = newStatus === "rejected" 
    ? `${API_URL}/${endpoint}/${id}/reject`
    : `${API_URL}/${endpoint}/${id}/status`

  const body = newStatus === "rejected"
    ? { rejection_reason: rejectionReason }
    : { new_status: newStatus }

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Gagal mengubah status")
  }

  return await response.json()
}
