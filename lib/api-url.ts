const LOCAL_API_URL = "http://localhost:8000/api"

export function getApiUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim()

  if (configuredUrl) {
    const normalizedUrl = configuredUrl.replace(/\/$/, "")

    if (typeof window !== "undefined") {
      const pageHost = window.location.hostname
      const isPageLocal =
        pageHost === "localhost" ||
        pageHost === "127.0.0.1" ||
        pageHost.endsWith(".localhost")
      const apiHost = new URL(normalizedUrl, window.location.origin).hostname
      const isApiLocal = apiHost === "localhost" || apiHost === "127.0.0.1"

      if (!isPageLocal && isApiLocal) {
        return `${window.location.origin}/api`
      }
    }

    return normalizedUrl
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
