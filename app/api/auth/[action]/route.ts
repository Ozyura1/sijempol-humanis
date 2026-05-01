const ALLOWED_ACTIONS = new Set(["login", "logout", "refresh", "profile", "change-password"])
const DEFAULT_BACKEND_API_URL = "http://127.0.0.1:8000/api"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function getBackendApiUrl() {
  return (
    process.env.BACKEND_INTERNAL_API_URL ||
    process.env.BACKEND_INTERNAL_URL ||
    DEFAULT_BACKEND_API_URL
  ).replace(/\/$/, "")
}

function copyRequestHeaders(request: Request) {
  const headers = new Headers()
  const contentType = request.headers.get("Content-Type")
  const authorization = request.headers.get("Authorization")

  if (contentType) {
    headers.set("Content-Type", contentType)
  }

  if (authorization) {
    headers.set("Authorization", authorization)
  }

  return headers
}

async function proxyAuthRequest(request: Request, action: string, method: string) {
  if (!ALLOWED_ACTIONS.has(action)) {
    return Response.json({ message: "Endpoint auth tidak ditemukan." }, { status: 404 })
  }

  const hasBody = method !== "GET" && method !== "HEAD"
  const response = await fetch(`${getBackendApiUrl()}/auth/${action}`, {
    method,
    headers: copyRequestHeaders(request),
    body: hasBody ? await request.text() : undefined,
    cache: "no-store",
  })

  const contentType = response.headers.get("Content-Type") || "application/json"
  const responseBody = await response.text()

  return new Response(responseBody, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      "Content-Type": contentType,
    },
  })
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params
  return proxyAuthRequest(request, action, "GET")
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params
  return proxyAuthRequest(request, action, "POST")
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params
  return proxyAuthRequest(request, action, "PUT")
}
