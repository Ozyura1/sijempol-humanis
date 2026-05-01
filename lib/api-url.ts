const LOCAL_API_URL = "http://localhost:8000/api"

export function getApiUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim()

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "")
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname
    const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".localhost")

    if (!isLocalHost) {
      return `${window.location.origin}/api`
    }
  }

  return LOCAL_API_URL
}
