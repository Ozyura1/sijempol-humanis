import express from "express"
import bcrypt from "bcryptjs"
import db, { nextId } from "../db.js"
import { validateEmail } from "../middleware/validation.js"
import { generateOTP, sendOTPEmail } from "../utils/email.js"

const router = express.Router()
const OTP_TTL_MINUTES = 10

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase()
}

function normalizeText(value) {
  return String(value || "").trim()
}

function ensureOtpCollection() {
  if (!Array.isArray(db.data.otp_requests)) {
    db.data.otp_requests = []
  }
}

function findLatestOtpRequest(email) {
  return db.data.otp_requests
    .filter((request) => normalizeEmail(request.email) === email)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
}

function createOtpResponse(message, email, otp, emailSent) {
  const response = {
    message,
    email,
    otp_expires_in: OTP_TTL_MINUTES,
    email_sent: Boolean(emailSent),
  }

  if (!emailSent && process.env.NODE_ENV !== "production") {
    response.dev_otp = otp
  }

  return response
}

// Request OTP - Step 1 of registration
router.post("/request-otp", validateEmail, async (req, res) => {
  const email = normalizeEmail(req.body.email)
  const username = normalizeText(req.body.username)
  const name = normalizeText(req.body.name)

  if (!email || !username || !name) {
    return res.status(400).json({ message: "Email, username, dan nama wajib diisi." })
  }

  if (username.length < 3) {
    return res.status(400).json({ message: "Username minimal 3 karakter." })
  }

  try {
    await db.read()
    ensureOtpCollection()

    const existingUser = db.data.users.find((user) => user.username === username)
    if (existingUser) {
      return res.status(409).json({ message: "Username sudah terdaftar." })
    }

    const existingEmail = db.data.users.find((user) => normalizeEmail(user.email) === email)
    if (existingEmail) {
      return res.status(409).json({ message: "Email sudah terdaftar." })
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    db.data.otp_requests = db.data.otp_requests.filter(
      (request) =>
        normalizeEmail(request.email) !== email &&
        request.username !== username &&
        new Date(request.created_at) >= oneHourAgo
    )

    const otp = generateOTP()
    const otpRequest = {
      id: nextId("otp_requests"),
      email,
      username,
      name,
      otp_code: otp,
      otp_expires_at: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    }

    db.data.otp_requests.push(otpRequest)
    await db.write()

    try {
      const emailSent = await sendOTPEmail(email, otp, name)

      if (!emailSent && process.env.NODE_ENV === "production") {
        await db.read()
        ensureOtpCollection()
        db.data.otp_requests = db.data.otp_requests.filter((request) => request.id !== otpRequest.id)
        await db.write()
        return res.status(503).json({ message: "Email OTP belum dapat dikirim. Periksa konfigurasi email server." })
      }

      return res.status(201).json(
        createOtpResponse(
          emailSent
            ? "Kode OTP telah dikirim ke email Anda. Silakan periksa folder spam jika tidak terlihat."
            : "Mode development: email belum dikonfigurasi, gunakan dev_otp untuk verifikasi.",
          email,
          otp,
          emailSent
        )
      )
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError)
      await db.read()
      ensureOtpCollection()
      db.data.otp_requests = db.data.otp_requests.filter((request) => request.id !== otpRequest.id)
      await db.write()
      return res.status(503).json({ message: "Gagal mengirim kode OTP. Silakan periksa email server lalu coba lagi." })
    }
  } catch (error) {
    console.error("Error in request-otp:", error)
    return res.status(500).json({ message: "Terjadi kesalahan saat memproses permintaan." })
  }
})

// Verify OTP and complete registration - Step 2 of registration
router.post("/verify-otp", async (req, res) => {
  const email = normalizeEmail(req.body.email)
  const otpCode = normalizeText(req.body.otp_code)
  const { password, confirmPassword } = req.body

  if (!email || !otpCode || !password || !confirmPassword) {
    return res.status(400).json({ message: "Email, OTP, dan password wajib diisi." })
  }

  if (!/^\d{6}$/.test(otpCode)) {
    return res.status(400).json({ message: "Kode OTP harus berisi 6 digit angka." })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password dan konfirmasi password tidak cocok." })
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password minimal 6 karakter." })
  }

  try {
    await db.read()
    ensureOtpCollection()

    const otpRequest = findLatestOtpRequest(email)

    if (!otpRequest) {
      return res.status(400).json({ message: "Tidak ada permintaan OTP untuk email ini. Silakan daftar ulang." })
    }

    if (new Date() > new Date(otpRequest.otp_expires_at)) {
      db.data.otp_requests = db.data.otp_requests.filter((request) => request.id !== otpRequest.id)
      await db.write()
      return res.status(400).json({ message: "Kode OTP telah kadaluarsa. Silakan minta OTP baru." })
    }

    if (otpRequest.otp_code !== otpCode) {
      return res.status(400).json({ message: "Kode OTP tidak valid." })
    }

    const existingUser = db.data.users.find((user) => user.username === otpRequest.username)
    if (existingUser) {
      return res.status(409).json({ message: "Username sudah terdaftar." })
    }

    const existingEmail = db.data.users.find((user) => normalizeEmail(user.email) === email)
    if (existingEmail) {
      return res.status(409).json({ message: "Email sudah terdaftar." })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)
    const user = {
      id: nextId("users"),
      username: otpRequest.username,
      password: hashedPassword,
      name: otpRequest.name,
      email,
      role: "user",
      is_verified: true,
      created_at: new Date().toISOString(),
    }

    db.data.users.push(user)
    db.data.otp_requests = db.data.otp_requests.filter((request) => request.id !== otpRequest.id)
    await db.write()

    const responseUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    }

    return res.status(201).json({
      message: "Registrasi berhasil! Akun Anda telah diverifikasi. Silakan login.",
      user: responseUser,
    })
  } catch (error) {
    console.error("Error in verify-otp:", error)
    return res.status(500).json({ message: "Terjadi kesalahan saat memverifikasi OTP." })
  }
})

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  const email = normalizeEmail(req.body.email)

  if (!email) {
    return res.status(400).json({ message: "Email wajib diisi." })
  }

  try {
    await db.read()
    ensureOtpCollection()

    const otpRequest = findLatestOtpRequest(email)

    if (!otpRequest) {
      return res.status(400).json({ message: "Tidak ada permintaan OTP untuk email ini." })
    }

    const otp = generateOTP()

    try {
      const emailSent = await sendOTPEmail(email, otp, otpRequest.name)

      if (!emailSent && process.env.NODE_ENV === "production") {
        return res.status(503).json({ message: "Email OTP belum dapat dikirim. Periksa konfigurasi email server." })
      }

      otpRequest.otp_code = otp
      otpRequest.otp_expires_at = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString()
      otpRequest.created_at = new Date().toISOString()
      await db.write()

      return res.status(200).json(
        createOtpResponse(
          emailSent ? "Kode OTP baru telah dikirim ke email Anda." : "Mode development: email belum dikonfigurasi, gunakan dev_otp untuk verifikasi.",
          email,
          otp,
          emailSent
        )
      )
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError)
      return res.status(503).json({ message: "Gagal mengirim ulang kode OTP. Silakan periksa email server lalu coba lagi." })
    }
  } catch (error) {
    console.error("Error in resend-otp:", error)
    return res.status(500).json({ message: "Terjadi kesalahan saat mengirim ulang OTP." })
  }
})

export default router
