const ALLOWED_ACTIONS = new Set(["request-otp", "verify-otp", "resend-otp"])
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

async function proxyOtpRequest(request: Request, action: string) {
  if (!ALLOWED_ACTIONS.has(action)) {
    return Response.json({ message: "Endpoint OTP tidak ditemukan." }, { status: 404 })
  }

  const body = await request.text()
  const response = await fetch(`${getBackendApiUrl()}/auth/otp/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": request.headers.get("Content-Type") || "application/json",
    },
    body,
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params
  return proxyOtpRequest(request, action)
}
