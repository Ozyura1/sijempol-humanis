const LOCAL_API_URL = "http://localhost:8000/api"

function isPrivateIpv4(hostname: string) {
  const parts = hostname.split(".").map((part) => Number(part))

  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false
  }

  const [first, second] = parts
  return first === 10 || (first === 172 && second >= 16 && second <= 31) || (first === 192 && second === 168)
}

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

      if (!isPageLocal && (isApiLocal || isPrivateIpv4(apiHost) || apiHost === pageHost)) {
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
