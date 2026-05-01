import express from "express"
import bcrypt from "bcryptjs"
import db, { nextId } from "../db.js"
import { validateEmail } from "../middleware/validation.js"
import { generateOTP, sendOTPEmail } from "../utils/email.js"

const router = express.Router()

// Request OTP - Step 1 of registration
router.post("/request-otp", validateEmail, async (req, res) => {
  const { email, username, name } = req.body

  // Validate required fields
  if (!email || !username || !name) {
    return res.status(400).json({ message: "Email, username, dan nama wajib diisi." })
  }

  if (username.length < 3) {
    return res.status(400).json({ message: "Username minimal 3 karakter." })
  }

  try {
    await db.read()

    // Check if username already exists
    const existingUser = db.data.users.find((user) => user.username === username)
    if (existingUser) {
      return res.status(409).json({ message: "Username sudah terdaftar." })
    }

    // Check if email already exists
    const existingEmail = db.data.users.find((user) => user.email === email)
    if (existingEmail) {
      return res.status(409).json({ message: "Email sudah terdaftar." })
    }

    // Clean old OTP requests for this email (older than 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    db.data.otp_requests = db.data.otp_requests.filter(
      (req) => !(req.email === email && new Date(req.created_at) < oneHourAgo)
    )

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP request
    const otpRequest = {
      id: nextId("otp_requests"),
      email,
      username,
      name,
      otp_code: otp,
      otp_expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
    }

    db.data.otp_requests.push(otpRequest)
    await db.write()

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, name)
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError)
      // Still return success to user, email might have been queued
      return res.status(201).json({
        message: "Kode OTP telah dikirim ke email Anda. Silakan periksa folder spam jika tidak terlihat.",
        email: email,
        otp_expires_in: 10, // minutes
      })
    }

    return res.status(201).json({
      message: "Kode OTP telah dikirim ke email Anda. Silakan periksa folder spam jika tidak terlihat.",
      email: email,
      otp_expires_in: 10, // minutes
    })
  } catch (error) {
    console.error("Error in request-otp:", error)
    return res.status(500).json({ message: "Terjadi kesalahan saat memproses permintaan." })
  }
})

// Verify OTP and complete registration - Step 2 of registration
router.post("/verify-otp", async (req, res) => {
  const { email, otp_code, password, confirmPassword } = req.body

  if (!email || !otp_code || !password || !confirmPassword) {
    return res.status(400).json({ message: "Email, OTP, dan password wajib diisi." })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password dan konfirmasi password tidak cocok." })
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password minimal 6 karakter." })
  }

  try {
    await db.read()

    // Find OTP request
    const otpRequest = db.data.otp_requests.find((req) => req.email === email)

    if (!otpRequest) {
      return res.status(400).json({ message: "Tidak ada permintaan OTP untuk email ini. Silakan daftar ulang." })
    }

    // Check OTP expiration
    if (new Date() > new Date(otpRequest.otp_expires_at)) {
      // Remove expired OTP request
      db.data.otp_requests = db.data.otp_requests.filter((req) => req.id !== otpRequest.id)
      await db.write()
      return res.status(400).json({ message: "Kode OTP telah kadaluarsa. Silakan minta OTP baru." })
    }

    // Verify OTP
    if (otpRequest.otp_code !== otp_code) {
      return res.status(400).json({ message: "Kode OTP tidak valid." })
    }

    // Check if username or email already registered (in case of double submission)
    const existingUser = db.data.users.find((user) => user.username === otpRequest.username)
    if (existingUser) {
      return res.status(409).json({ message: "Username sudah terdaftar." })
    }

    const existingEmail = db.data.users.find((user) => user.email === email)
    if (existingEmail) {
      return res.status(409).json({ message: "Email sudah terdaftar." })
    }

    // Create user
    const hashedPassword = bcrypt.hashSync(password, 10)
    const user = {
      id: nextId("users"),
      username: otpRequest.username,
      password: hashedPassword,
      name: otpRequest.name,
      email: email,
      role: "user",
      is_verified: true,
      created_at: new Date().toISOString(),
    }

    db.data.users.push(user)

    // Remove used OTP request
    db.data.otp_requests = db.data.otp_requests.filter((req) => req.id !== otpRequest.id)

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
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: "Email wajib diisi." })
  }

  try {
    await db.read()

    // Find OTP request
    const otpRequest = db.data.otp_requests.find((req) => req.email === email)

    if (!otpRequest) {
      return res.status(400).json({ message: "Tidak ada permintaan OTP untuk email ini." })
    }

    // Generate new OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Update OTP request
    otpRequest.otp_code = otp
    otpRequest.otp_expires_at = expiresAt.toISOString()

    await db.write()

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, otpRequest.name)
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError)
      return res.status(201).json({
        message: "Kode OTP baru telah dikirim ke email Anda.",
        email: email,
        otp_expires_in: 10,
      })
    }

    return res.status(200).json({
      message: "Kode OTP baru telah dikirim ke email Anda.",
      email: email,
      otp_expires_in: 10, // minutes
    })
  } catch (error) {
    console.error("Error in resend-otp:", error)
    return res.status(500).json({ message: "Terjadi kesalahan saat mengirim ulang OTP." })
  }
})

export default router
