import express from "express"
import bcrypt from "bcryptjs"
import db from "../db.js"
import { generateTokens, authenticate, blacklistToken, verifyRefreshToken } from "./authMiddleware.js"
import { validatePassword } from "../middleware/validation.js"

const router = express.Router()

router.post("/register", async (req, res) => {
  return res.status(410).json({
    message: "Registrasi sekarang wajib verifikasi OTP. Gunakan /api/auth/otp/request-otp lalu /api/auth/otp/verify-otp.",
  })
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi." })
  }

  await db.read()
  const user = db.data.users.find((item) => item.username === username)
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Username atau password salah." })
  }

  const { accessToken, refreshToken } = generateTokens(user)
  return res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role },
  })
})

router.post("/logout", authenticate, (req, res) => {
  const authHeader = req.headers.authorization || ""
  const token = authHeader.replace(/^Bearer\s+/i, "")
  
  if (token) {
    blacklistToken(token)
  }
  
  return res.json({ message: "Logout sukses." })
})

router.get("/profile", authenticate, async (req, res) => {
  await db.read()
  const user = db.data.users.find((item) => item.id === req.user.id)
  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan." })
  }
  return res.json({ id: user.id, username: user.username, name: user.name, email: user.email, role: user.role, created_at: user.created_at })
})

router.put("/profile", authenticate, async (req, res) => {
  const { name, email } = req.body

  if (!name || !email) {
    return res.status(400).json({ message: "Nama dan email wajib diisi." })
  }

  await db.read()
  const user = db.data.users.find((item) => item.id === req.user.id)
  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan." })
  }

  user.name = name
  user.email = email
  await db.write()

  return res.json({
    message: "Profil berhasil diperbarui.",
    user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role },
  })
})

router.put("/change-password", authenticate, validatePassword, async (req, res) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Password lama dan password baru wajib diisi." })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password baru minimal 6 karakter." })
  }

  await db.read()
  const user = db.data.users.find((item) => item.id === req.user.id)
  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan." })
  }

  if (!bcrypt.compareSync(oldPassword, user.password)) {
    return res.status(401).json({ message: "Password lama salah." })
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10)
  user.password = hashedPassword
  await db.write()

  return res.json({ message: "Password berhasil diubah." })
})

router.post("/refresh", (req, res) => {
  const { refresh_token } = req.body

  if (!refresh_token) {
    return res.status(400).json({ message: "Refresh token diperlukan." })
  }

  const payload = verifyRefreshToken(refresh_token)
  if (!payload) {
    return res.status(401).json({ message: "Refresh token tidak valid atau telah kadaluarsa." })
  }

  db.read().then(() => {
    const user = db.data.users.find((item) => item.id === payload.id)
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." })
    }

    const { accessToken, refreshToken } = generateTokens(user)
    return res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role },
    })
  })
})

export default router
