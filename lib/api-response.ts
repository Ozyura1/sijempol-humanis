export async function readApiErrorMessage(response: Response, fallback = "Terjadi kesalahan saat mengirim pengajuan") {
  const contentType = response.headers.get("content-type") || ""

  try {
    if (contentType.includes("application/json")) {
      const data = await response.json()
      return data?.message || fallback
    }

    const text = await response.text()
    if (text) {
      return text
    }
  } catch {
    // fall through to fallback
  }

  if (response.status === 413) {
    return "Ukuran file terlalu besar. Silakan kecilkan file lalu coba lagi."
  }

  return fallback
}
