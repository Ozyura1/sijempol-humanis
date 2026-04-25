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
